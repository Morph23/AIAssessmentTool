import Head from 'next/head';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const QUESTIONS = [
  {
    title: "Understanding AI's Impact on Pupil Learning",
    prompt: "How well do you understand how AI might affect how pupils learn, complete tasks, and develop skills in your classroom?",
    options: [
      {
        value: 'limited',
        label: 'Limited Understanding',
        desc: "I'm unsure how AI specifically impacts pupil learning or classroom activities."
      },
      {
        value: 'developing',
        label: 'Developing Awareness',
        desc: "I'm beginning to see how AI tools could influence pupil work and learning processes in my subject."
      },
      {
        value: 'active',
        label: 'Active Integration',
        desc: "I clearly understand AI's impact on pupil learning and can identify specific implications for my lessons."
      },
      {
        value: 'thought',
        label: 'Thought Leadership',
        desc: "I have deep insights into AI's effects on pupil learning and actively contribute to discussions on AI's role in education."
      }
    ]
  },
  {
    title: "Integrating AI into Pedagogical Practice",
    prompt: "How actively are you exploring or using AI tools to enhance your lesson planning, teaching methods, or pupil engagement?",
    options: [
      {
        value: 'not_engaged',
        label: 'Not Engaged',
        desc: "I haven't actively explored AI tools for teaching; this is handled by others or not yet considered."
      },
      {
        value: 'beginning',
        label: 'Beginning Exploration',
        desc: "I've started to investigate how AI might improve my teaching but haven't implemented any changes yet."
      },
      {
        value: 'confident',
        label: 'Confident Application',
        desc: "I actively use AI tools to enhance my teaching effectiveness and improve pupil learning outcomes."
      },
      {
        value: 'innovative',
        label: 'Innovative Pioneer',
        desc: "I lead innovative AI integration in classroom teaching, sharing successful practices and supporting colleagues."
      }
    ]
  },
  {
    title: "Managing AI in School Assessment",
    prompt: "How confident are you in adapting your assessment methods to account for AI tools while maintaining assessment fairness and capturing true pupil learning?",
    options: [
      {
        value: 'uncertain',
        label: 'Uncertain',
        desc: "I'm unsure how to modify assessments to address AI use while maintaining school standards."
      },
      {
        value: 'learning',
        label: 'Learning',
        desc: "I'm developing strategies for AI-aware assessment but need more guidance on best practices for my classroom."
      },
      {
        value: 'leading',
        label: 'Leading by Example',
        desc: "I've successfully adapted my assessment methods to account for AI while preserving learning objectives for pupils."
      },
      {
        value: 'champion',
        label: 'School Champion',
        desc: "I lead school-wide efforts to develop AI-informed assessment practices and academic integrity guidelines."
      }
    ]
  },
  {
    title: "Supporting Pupils' AI Literacy",
    prompt: "How effectively do you guide pupils in understanding appropriate and ethical AI use in their schoolwork and future lives?",
    options: [
      {
        value: 'limited',
        label: 'Limited Understanding',
        desc: "I struggle to provide clear guidance on AI ethics and appropriate use in school contexts."
      },
      {
        value: 'developing',
        label: 'Developing Awareness',
        desc: "I'm learning to communicate AI ethics and appropriate use but need more expertise and confidence."
      },
      {
        value: 'active',
        label: 'Active Integration',
        desc: "I effectively teach pupils about responsible AI use and integrate AI literacy into my curriculum."
      },
      {
        value: 'thought',
        label: 'Thought Leadership',
        desc: "I champion AI literacy education, developing comprehensive approaches that prepare pupils for an AI-influenced world."
      }
    ]
  },
  {
    title: "AI's Impact on Your Subject Area",
    prompt: "How well do you understand how AI is transforming your subject area and the future skills pupils will need?",
    options: [
      {
        value: 'limited',
        label: 'Limited Understanding',
        desc: "I'm uncertain how AI specifically impacts my subject's future direction or what skills pupils will need."
      },
      {
        value: 'beginning',
        label: 'Beginning Exploration',
        desc: "I'm starting to understand AI's relevance to my subject area but need deeper, subject-specific insights."
      },
      {
        value: 'confident',
        label: 'Confident Application',
        desc: "I have clear insights into how AI is reshaping my subject and can articulate these changes to pupils and colleagues."
      },
      {
        value: 'innovative',
        label: 'Innovative Pioneer',
        desc: "I actively contribute to understanding AI's subject impact and help shape my curriculum's AI integration."
      }
    ]
  },
  {
    title: "Updating Curriculum for the AI Era",
    prompt: "How actively are you revising lesson content and learning objectives to remain relevant in an AI-influenced world?",
    options: [
      {
        value: 'not_engaged',
        label: 'Not Engaged',
        desc: "I haven't systematically considered how AI should influence my curriculum or lesson design."
      },
      {
        value: 'beginning',
        label: 'Beginning Exploration',
        desc: "I'm beginning to identify areas where my curriculum might need updating for the AI era."
      },
      {
        value: 'confident',
        label: 'Confident Application',
        desc: "I regularly update my lessons to reflect AI developments and prepare pupils for an AI-integrated future."
      },
      {
        value: 'innovative',
        label: 'Innovative Pioneer',
        desc: "I lead curriculum innovation, creating AI-aware programs that set standards for future-ready education in my school."
      }
    ]
  },
  {
    title: "Staying Current with AI Developments",
    prompt: "How systematically do you monitor AI advances that could affect your subject area and your teaching practice?",
    options: [
      {
        value: 'limited',
        label: 'Limited Understanding',
        desc: "I occasionally encounter AI news but don't systematically track developments relevant to my teaching."
      },
      {
        value: 'developing',
        label: 'Developing Awareness',
        desc: "I'm developing a more structured approach to staying informed about AI trends in education."
      },
      {
        value: 'active',
        label: 'Active Integration',
        desc: "I regularly analyze AI developments and their implications for my teaching and subject area."
      },
      {
        value: 'thought',
        label: 'Thought Leadership',
        desc: "I proactively identify emerging AI trends and translate insights into actionable strategies for my school community."
      }
    ]
  },
  {
    title: "AI in Classroom & Teacher Workflow",
    prompt: "How effectively are you exploring or using AI tools to enhance your classroom preparation, data analysis (e.g., pupil progress), or teaching efficiency?",
    options: [
      {
        value: 'not_engaged',
        label: 'Not Engaged',
        desc: "I haven't explored how AI could enhance my classroom preparation or teaching efficiency."
      },
      {
        value: 'beginning',
        label: 'Beginning Exploration',
        desc: "I'm starting to investigate AI applications in teaching support but haven't implemented significant changes yet."
      },
      {
        value: 'confident',
        label: 'Confident Application',
        desc: "I successfully integrate AI tools into my teaching workflow, enhancing efficiency and analytical capabilities (e.g., assessing pupil data)."
      },
      {
        value: 'innovative',
        label: 'Innovative Pioneer',
        desc: "I pioneer AI-enhanced teaching methodologies and share innovative approaches with my school colleagues."
      }
    ]
  },
  {
    title: "Navigating AI Ethics in Schools",
    prompt: "How well do you address ethical considerations around AI use with pupils, in their schoolwork, and in collaboration with colleagues?",
    options: [
      {
        value: 'uncertain',
        label: 'Uncertain',
        desc: "I'm not fully aware of the ethical implications of AI in school settings or pupil work."
      },
      {
        value: 'learning',
        label: 'Learning',
        desc: "I recognize the importance of AI ethics in schools but need clearer frameworks for implementation in my classroom."
      },
      {
        value: 'leading',
        label: 'Leading by Example',
        desc: "I actively promote ethical AI practices in my classroom and contribute to establishing clear guidelines for pupils."
      },
      {
        value: 'champion',
        label: 'School Champion',
        desc: "I champion the development of comprehensive ethical AI frameworks for my school's teaching and learning."
      }
    ]
  },
  {
    title: "School AI Leadership",
    prompt: "How actively do you share knowledge about AI applications with colleagues and contribute to school AI policies and practices?",
    options: [
      {
        value: 'limited',
        label: 'Limited Understanding',
        desc: "I focus on my own AI learning and don't actively share insights or contribute to school AI policies."
      },
      {
        value: 'beginning',
        label: 'Beginning Exploration',
        desc: "I occasionally discuss AI applications with colleagues but haven't taken formal leadership roles."
      },
      {
        value: 'confident',
        label: 'Confident Application',
        desc: "I regularly share AI knowledge with colleagues and contribute to departmental/school AI initiatives and policies."
      },
      {
        value: 'thought',
        label: 'Thought Leadership',
        desc: "I lead school-wide AI initiatives, mentor colleagues, and actively shape school AI policies and practices."
      }
    ]
  }
];

export default function Assessment() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(''));
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('');
  const [industry, setIndustry] = useState('');
  const [orgsize, setOrgsize] = useState('');
  const router = useRouter();
  const progress = ((current + 1) / QUESTIONS.length) * 100;

  useEffect(() => {
    // Load personal context saved on the index page
    if (typeof window === 'undefined') return;
    try {
      const meta = JSON.parse(localStorage.getItem('assessmentMeta'));
      if (meta) {
        setRole(meta.position || '');
        setExperience(meta.experience || '');
        setIndustry(meta.subject || '');
        setOrgsize(meta.aiKnowledge || '');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleSelect = (val) => {
    const updated = [...answers];
    updated[current] = val;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1);
    } else {
      // Before navigating to results, persist assessment data to localStorage
      if (typeof window !== 'undefined') {
          try {
          // Convert selected string values into numeric scores using custom mapping [2,3,5,8]
          const SCORE_MAP = [2, 3, 5, 8];
          const numericAnswers = answers.map((val, idx) => {
            const opts = QUESTIONS[idx].options || [];
            const found = opts.findIndex(o => o.value === val);
            return found >= 0 ? SCORE_MAP[found] : 0;
          });

          // Build a lightweight questions payload (titles + option labels)
          const questionsPayload = QUESTIONS.map(q => ({
            title: q.title,
            options: q.options.map(o => ({ label: o.label }))
          }));

          const payload = {
            answers: numericAnswers,
            questions: questionsPayload,
            context: {
              role,
              experience,
              industry,
              orgsize
            }
          };

          localStorage.setItem('assessmentResults', JSON.stringify(payload));
        } catch (e) {
          console.error('Failed to save assessment results:', e);
        }
      }

      router.push('/results');
    }
  };

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const selected = answers[current];
  const q = QUESTIONS[current];

  return (
    <>
      <Head>
        <title>Personalised AI Teacher Assessment</title>
      </Head>
      <div className="assessment-bg">
        <div className="assessment-header">
          <img src="/defatoed.png" alt="DEfactoED Logo" className="defactoed-logo" />
        </div>
        <div className="assessment-card">
          <h1 className="assessment-title">Personalised AI Teacher Assessment</h1>
          <p className="assessment-subtitle">Evaluate your readiness to incorporate AI into teaching activities.</p>
          <hr className="assessment-divider" />
          <div className="assessment-progress-bar">
            <div className="assessment-progress" style={{ width: `${progress}%` }} />
          </div>
          <h2 className="assessment-question-title">Question {current + 1}: {q.title}</h2>
          <p className="assessment-question-prompt">{q.prompt}</p>
          <div className="assessment-options">
            {q.options.map(opt => (
              <button
                key={opt.value}
                type="button"
                className={`assessment-option${selected === opt.value ? ' selected' : ''}`}
                onClick={() => handleSelect(opt.value)}
              >
                <span className="assessment-option-label">{opt.label}</span>
                <span className="assessment-option-desc">{opt.desc}</span>
              </button>
            ))}
          </div>
          <div className="assessment-nav-row">
            <div style={{ flex: 1 }}>
              {current > 0 && (
                <button className="assessment-nav-btn" type="button" onClick={handlePrev}>Previous</button>
              )}
            </div>
            <div>
              {current < QUESTIONS.length - 1 ? (
                <button className="assessment-nav-btn primary" type="button" onClick={handleNext} disabled={!selected}>Next</button>
              ) : (
                <button className="assessment-nav-btn primary" type="button" onClick={handleNext} disabled={!selected}>Show Results</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
