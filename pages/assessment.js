import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { DEFAULT_CONFIG_ID, getAssessmentConfig } from '../lib/assessmentConfigs';

const inferStoredConfigId = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_CONFIG_ID;
  }
  const stored = window.localStorage.getItem('selectedAssessmentConfig');
  return stored || DEFAULT_CONFIG_ID;
};

const readStoredContext = (configId) => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = window.localStorage.getItem('assessmentContext');
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    if (parsed?.configId === configId && typeof parsed.context === 'object') {
      return parsed.context;
    }

    return {};
  } catch (error) {
    console.warn('Unable to read stored assessment context', error);
    try {
      window.localStorage.removeItem('assessmentContext');
    } catch (storageError) {
      console.warn('Failed to clear invalid stored context', storageError);
    }
    return {};
  }
};

const readStoredResults = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem('assessmentResults');
    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch (error) {
    console.warn('Unable to read stored assessment results', error);
    try {
      window.localStorage.removeItem('assessmentResults');
    } catch (storageError) {
      console.warn('Failed to clear invalid stored results', storageError);
    }
    return null;
  }
};

export default function Assessment() {
  const router = useRouter();
  const [configId, setConfigId] = useState(DEFAULT_CONFIG_ID);
  const [contextValues, setContextValues] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState([]);

  const config = useMemo(() => getAssessmentConfig(configId), [configId]);
  const totalQuestions = config.questions.length;
  const questionIndex = currentStep > 0 ? currentStep - 1 : 0;
  const activeQuestion = currentStep > 0 ? config.questions[questionIndex] : null;
  const progress = totalQuestions > 0 ? Math.min((currentStep / totalQuestions) * 100, 100) : 0;

  useEffect(() => {
    const inferred = inferStoredConfigId();
    setConfigId(inferred);
    setContextValues(readStoredContext(inferred));
  }, []);

  useEffect(() => {
    if (!config) {
      return;
    }

    const baseAnswers = Array(config.questions.length).fill(null);
    const stored = readStoredResults();

    if (!stored || stored.configId !== config.id) {
      setAnswers(baseAnswers);
      return;
    }

    const restored = config.questions.map((question, idx) => {
      const storedAnswer = Array.isArray(stored.answers) ? stored.answers[idx] : null;

      if (!storedAnswer) {
        return null;
      }

      const matchedOption = (question.options || []).find((option) => {
        if (storedAnswer.optionValue) {
          return option.value === storedAnswer.optionValue;
        }
        if (storedAnswer.optionLabel) {
          return option.label === storedAnswer.optionLabel;
        }
        if (typeof storedAnswer === 'string') {
          return option.value === storedAnswer;
        }
        if (typeof storedAnswer === 'number') {
          return option.score === storedAnswer;
        }
        return false;
      });

      if (!matchedOption) {
        return null;
      }

      return {
        optionValue: matchedOption.value,
        optionLabel: matchedOption.label,
        optionDescription: matchedOption.description,
        score: typeof matchedOption.score === 'number' ? matchedOption.score : 0
      };
    });

    setAnswers(restored);
  }, [config]);

  const handleContextChange = (fieldId, value) => {
    setContextValues((prev) => {
      const updated = { ...prev, [fieldId]: value };

      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(
            'assessmentContext',
            JSON.stringify({ configId, context: updated })
          );
        } catch (error) {
          console.warn('Unable to persist assessment context', error);
        }
      }

      return updated;
    });
  };

  const handleSelectOption = (questionIdx, option) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[questionIdx] = {
        optionValue: option.value,
        optionLabel: option.label,
        optionDescription: option.description || '',
        score: typeof option.score === 'number' ? option.score : 0
      };
      return updated;
    });
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const persistResults = () => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const questionsPayload = config.questions.map((question) => ({
        id: question.id,
        title: question.title,
        prompt: question.prompt,
        options: question.options.map((option) => ({
          value: option.value,
          label: option.label,
          description: option.description || ''
        }))
      }));

      const normalisedAnswers = answers.map((answer, idx) => ({
        questionId: config.questions[idx].id,
        optionValue: answer?.optionValue ?? '',
        optionLabel: answer?.optionLabel ?? '',
        optionDescription: answer?.optionDescription ?? '',
        score: typeof answer?.score === 'number' ? answer.score : 0
      }));

      const numericScores = normalisedAnswers.map((answer) => answer.score);

      const payload = {
        configId,
        answers: normalisedAnswers,
        numericScores,
        questions: questionsPayload,
        context: contextValues
      };

      window.localStorage.setItem('assessmentResults', JSON.stringify(payload));
      window.localStorage.setItem(
        'assessmentContext',
        JSON.stringify({ configId, context: contextValues })
      );
    } catch (error) {
      console.error('Failed to save assessment results', error);
    }
  };

  const handleComplete = () => {
    persistResults();
    router.push('/results');
  };

  const handleNext = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
      return;
    }

    if (currentStep < totalQuestions) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    handleComplete();
  };

  if (!config) {
    return null;
  }

  const selectedAnswer = currentStep > 0 ? answers[questionIndex] : null;
  const contextComplete = config.contextFields.every((field) => {
    const value = contextValues[field.id];

    if (field.type === 'textarea') {
      return typeof value === 'string' && value.trim().length > 0;
    }

    return value !== undefined && value !== null && `${value}`.length > 0;
  });

  const showContextStep = currentStep === 0;
  const hasPrevious = currentStep > 0;
  const isFinalQuestion = currentStep === totalQuestions;

  return (
    <>
      <Head>
        <title>{config.name}</title>
      </Head>
      <div className="assessment-bg">
        <div className="assessment-header">
          <img src="/defatoed.png" alt="DEfactoED Logo" className="defactoed-logo" />
        </div>
        <div className="assessment-card">
          <h1 className="assessment-title">{config.name}</h1>
          <p className="assessment-subtitle">
            {config.heroSubtitle || config.welcome.description}
          </p>
          <hr className="assessment-divider" />
          <div className="assessment-progress-bar">
            <div className="assessment-progress" style={{ width: `${progress}%` }} />
          </div>

          {showContextStep ? (
            <>
              <div className="assessment-welcome">
                <h2 className="assessment-welcome-title">{config.welcome.title}</h2>
                <p className="assessment-welcome-para">{config.welcome.description}</p>
              </div>
              <div className="assessment-form">
                {config.contextFields.map((field) => (
                  <div key={field.id} className="assessment-field">
                    <label htmlFor={field.id}>{field.label}</label>
                    {field.type === 'select' ? (
                      <select
                        id={field.id}
                        value={contextValues[field.id] ?? ''}
                        onChange={(event) => handleContextChange(field.id, event.target.value)}
                      >
                        <option value="">Select...</option>
                        {field.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        id={field.id}
                        value={contextValues[field.id] ?? ''}
                        onChange={(event) => handleContextChange(field.id, event.target.value)}
                        rows={5}
                        placeholder={field.placeholder || ''}
                      />
                    ) : (
                      <input
                        id={field.id}
                        type="text"
                        value={contextValues[field.id] ?? ''}
                        onChange={(event) => handleContextChange(field.id, event.target.value)}
                        placeholder={field.placeholder || ''}
                      />
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 className="assessment-question-title">
                Question {currentStep}: {activeQuestion?.title}
              </h2>
              <p className="assessment-question-prompt">{activeQuestion?.prompt}</p>
              <div className="assessment-options">
                {activeQuestion?.options.map((option) => {
                  const isSelected = selectedAnswer?.optionValue === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      className={`assessment-option${isSelected ? ' selected' : ''}`}
                      onClick={() => handleSelectOption(questionIndex, option)}
                    >
                      <span className="assessment-option-label">{option.label}</span>
                      {option.description && (
                        <span className="assessment-option-desc">{option.description}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <div className="assessment-nav-row">
            <div style={{ flex: 1 }}>
              {hasPrevious && (
                <button className="assessment-nav-btn" type="button" onClick={handlePrev}>
                  Previous
                </button>
              )}
            </div>
            <div>
              <button
                className="assessment-nav-btn primary"
                type="button"
                onClick={handleNext}
                disabled={showContextStep ? !contextComplete : !selectedAnswer}
              >
                {isFinalQuestion ? 'Show Results' : showContextStep ? 'Start Assessment' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}