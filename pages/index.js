


import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { getAllAssessmentConfigs, DEFAULT_CONFIG_ID } from '../lib/assessmentConfigs';

export default function Home() {
  const router = useRouter();
  const allConfigs = useMemo(() => getAllAssessmentConfigs(), []);
  const [selectedConfigId, setSelectedConfigId] = useState('');
  const selectedConfig = useMemo(
    () => allConfigs.find((config) => config.id === selectedConfigId) ?? null,
    [allConfigs, selectedConfigId]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem('selectedAssessmentConfig');
      if (stored) {
        setSelectedConfigId(stored);
      }
    } catch (error) {
      console.warn('Unable to read stored configuration', error);
    }
  }, []);

  const handleLoadAssessment = (event) => {
    event.preventDefault();
    const configId = selectedConfigId || DEFAULT_CONFIG_ID;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedAssessmentConfig', configId);
      }
    } catch (err) {
      console.error('Unable to store selected config in localStorage', err);
    }
    router.push('/assessment');
  };

  return (
    <>
      <Head>
        <title>Customisable AI Teacher Assessment</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="assessment-bg">
        <div className="assessment-header">
          <img src="/defatoed.png" alt="DEfactoED Logo" className="defactoed-logo" />
        </div>
        <div className="assessment-card">
          <h1 className="assessment-title">Customisable AI Teacher Assessment</h1>
          <p className="assessment-subtitle">Select the configuration that best matches your context to unlock tailored insights.</p>

          <div className="assessment-welcome">
            <h2 className="assessment-welcome-title">Start by choosing a configuration</h2>
            <p className="assessment-welcome-para">
              Each pathway mirrors the standalone assessment at your disposal. Pick the configuration that fits your role or department, then follow the prompts to capture context and complete the question set.
            </p>
          </div>

          <form className="assessment-form" onSubmit={handleLoadAssessment}>
            <div className="assessment-field">
              <label htmlFor="config">Assessment configuration</label>
              <select
                id="config"
                name="config"
                value={selectedConfigId}
                onChange={(event) => setSelectedConfigId(event.target.value)}
              >
                <option value="">Choose a configuration...</option>
                {allConfigs.map((config) => (
                  <option key={config.id} value={config.id}>
                    {config.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedConfig ? (
              <div className="assessment-welcome">
                <h3 className="assessment-welcome-title">{selectedConfig.welcome.title}</h3>
                <p className="assessment-welcome-para">{selectedConfig.welcome.description}</p>
                <p className="assessment-welcome-para">
                  Context questions: {selectedConfig.contextFields.length} &nbsp;•&nbsp; Assessment questions: {selectedConfig.questions.length}
                </p>
                <p className="assessment-welcome-para">
                  You will receive a personalised analysis aligned to <strong>{selectedConfig.name}</strong> as soon as you complete the assessment.
                </p>
              </div>
            ) : (
              <div className="assessment-welcome">
                <h3 className="assessment-welcome-title">Not sure where to begin?</h3>
                <p className="assessment-welcome-para">
                  If you are exploring whole-class practice, select <strong>AI Teacher readiness</strong>. Subject-specific or leadership assessments are available for science, humanities, and school strategy.
                </p>
              </div>
            )}

            <button type="submit" className="assessment-btn">
              Load Assessment
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
