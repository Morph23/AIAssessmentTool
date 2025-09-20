import Head from 'next/head';
import { useEffect, useState } from 'react';

// Fallback action plan generator (simple version)
function generateFallbackActionPlan(percentage) {
  let now, next, later;
  if (percentage >= 75) {
    now = `<li><strong>Share a Success:</strong> Share an AI-powered resource or activity with a colleague.</li>`;
    next = `<li><strong>Lead a Pilot Project:</strong> Try a new AI tool with a class and share results.</li>`;
    later = `<li><strong>Influence Policy:</strong> Help shape your school's AI guidelines based on your experience.</li>`;
  } else if (percentage >= 45) {
    now = `<li><strong>Differentiate a Resource:</strong> Use AI to adapt a class text for different learners.</li>`;
    next = `<li><strong>Explore AI for Assessment:</strong> Use AI to create a quiz or rubric for an upcoming topic.</li>`;
    later = `<li><strong>Curriculum Evolution:</strong> Consider how AI will change key skills in your subject in 5 years.</li>`;
  } else {
    now = `<li><strong>Brainstorm Lesson Ideas:</strong> Use an AI tool to generate three creative lesson starters.</li>`;
    next = `<li><strong>Watch a Tutorial:</strong> Watch a short AI-for-teachers video on YouTube.</li>`;
    later = `<li><strong>AI for Admin:</strong> Try AI for a simple admin task, like summarizing meeting notes.</li>`;
  }
  return `
    <h3>🎯 Now (2-4 Weeks): Quick Wins</h3><ul>${now}</ul>
    <h3>🌱 Next (This Term): Build Skills</h3><ul>${next}</ul>
    <h3>🔭 Later: Think Strategically</h3><ul>${later}</ul>
  `;
}

function getInterpretation(scorePercentage) {
  if (scorePercentage >= 90) return { label: '🌟 AI Education Pioneer', color: '#28a745', desc: `You're ready to lead and innovate. Focus on scaling your impact and mentoring others.` };
  if (scorePercentage >= 75) return { label: '🚀 Advanced AI Teacher', color: '#1f4e79', desc: `You have a strong command of AI in education. Refine your advanced skills and share your expertise.` };
  if (scorePercentage >= 60) return { label: '💡 Developing AI Teacher', color: '#e99402', desc: `You have a solid foundation. Build confidence through consistent, practical application.` };
  if (scorePercentage >= 40) return { label: '🌱 Emerging AI Teacher', color: '#dc3545', desc: `You're building awareness and ready to move from theory to practice with hands-on tasks.` };
  return { label: '🎯 AI Education Starter', color: '#dc3545', desc: `You're at the beginning of an exciting journey. Start with the basics to build foundational knowledge.` };
}

// Placeholder: get answers/context from localStorage or query (should be replaced with real state management)
function getAssessmentData() {
  if (typeof window === 'undefined') return null;
  try {
    const data = JSON.parse(localStorage.getItem('assessmentResults'));
    return data;
  } catch {
    return null;
  }
}

export default function ResultsPage() {
  const [score, setScore] = useState(null);
  const [percentage, setPercentage] = useState(null);
  const [interpretation, setInterpretation] = useState(null);
  const [actionPlan, setActionPlan] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [context, setContext] = useState(null);
  const [rawSaved, setRawSaved] = useState(null);

  useEffect(() => {
    // Get answers/context (replace with real state management as needed)
    const data = getAssessmentData();
    if (!data || !data.answers || !data.questions) {
      setError('No assessment data found. Please complete the assessment first.');
      setLoading(false);
      return;
    }
  // New scoring: options map to [2,3,5,8] so max per question is 8
  const SCORE_MAP = [2, 3, 5, 8];
  const maxPerQuestion = Math.max(...SCORE_MAP);
  const total = data.questions.length * maxPerQuestion;
  const rawScore = data.answers.reduce((sum, v) => sum + (parseInt(v, 10) || 0), 0);
  const pct = Math.round((rawScore / total) * 100);
    setScore(rawScore);
    setPercentage(pct);
    setInterpretation(getInterpretation(pct));
    setContext(data.context || {});
  setRawSaved(data);

    // Build prompt for GPT-4o mini
    // Map numeric stored scores back to option labels using SCORE_MAP
    const detailedAnswers = data.answers.map((score, idx) => {
      const q = data.questions[idx];
      const optionIndex = SCORE_MAP.indexOf(parseInt(score, 10));
      return {
        question_number: idx + 1,
        question_title: q.title,
        score: score,
        selected_option: q.options[optionIndex]?.label || ''
      };
    });
    const prompt = `You are an expert AI Teaching Coach, specializing in practical, encouraging, and clear advice for busy school teachers. Your tone is supportive and jargon-free. Create a personalized action plan for a teacher based on their self-assessment results.\n\nThe teacher's context is:\n${JSON.stringify(data.context, null, 2)}\n\nTheir assessment answers are:\n${JSON.stringify(detailedAnswers, null, 2)}\n\nBased on this data, provide a concise and actionable roadmap using the following structure. Use HTML formatting as specified. Do not include any introductory or concluding paragraphs outside of this structure.\n\n<h3>🎯 Now (The Next 2-4 Weeks): Quick Wins for Your Classroom</h3>...`;

    // Call GPT-4o mini endpoint via Next.js API proxy
    fetch('/api/gpt4o', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are an expert AI Teaching Coach.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 700,
        temperature: 0.7
      })
    })
      .then(async res => {
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content || '';
        setActionPlan(content);
        setLoading(false);
      })
      .catch(() => {
        setActionPlan(generateFallbackActionPlan(pct));
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Assessment Results - AI Teacher Assessment</title>
      </Head>
      <div className="assessment-bg">
        <div className="assessment-card">
          <h1 className="assessment-title">Assessment Results</h1>
          {error ? (
            <p className="assessment-subtitle" style={{ color: 'red' }}>{error}</p>
          ) : loading ? (
            <p className="assessment-subtitle">Generating your personalized action plan...</p>
          ) : (
            <>
              <div style={{ textAlign: 'center', margin: '24px 0' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: interpretation?.color }}>{percentage}%</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 600, color: interpretation?.color }}>{interpretation?.label}</div>
                <div style={{ margin: '12px 0', color: '#555' }}>{interpretation?.desc}</div>
              </div>
              <hr className="assessment-divider" />
              <div>
                <h2 style={{ color: '#1f4e79', fontSize: '1.3rem', marginBottom: 8 }}>Your Personalized Action Plan</h2>
                <div className="ai-analysis" dangerouslySetInnerHTML={{ __html: actionPlan }} />
                <div style={{ marginTop: 18, display: 'flex', gap: 12 }}>
                  <button className="assessment-nav-btn" onClick={() => downloadReport()}>Download Report</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function downloadReport() {
  // Use saved raw data from localStorage if available
  let data = null;
  try {
    data = JSON.parse(localStorage.getItem('assessmentResults'));
  } catch {}
  if (!data) return alert('No saved assessment found to download.');

  const SCORE_MAP = [2, 3, 5, 8];
  const total = data.questions.length * Math.max(...SCORE_MAP);
  const rawScore = data.answers.reduce((s, v) => s + (parseInt(v, 10) || 0), 0);
  const pct = Math.round((rawScore / total) * 100);

  const detailed = data.answers.map((score, idx) => {
    const q = data.questions[idx];
    const labelIndex = SCORE_MAP.indexOf(parseInt(score, 10));
    return `<div style="margin-bottom:12px"><strong>${idx + 1}. ${q.title}</strong><div style="color:#666">Selected: ${q.options[labelIndex]?.label || ''} (${score})</div></div>`;
  }).join('');

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>AI Teacher Report</title></head><body><div><h1>AI Teacher Assessment Report</h1><h2>Score: ${pct}%</h2>${detailed}<hr/><h3>Action Plan</h3><div>${document.querySelector('.ai-analysis')?.innerHTML || ''}</div></div></body></html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AI-Teacher-Report-${new Date().toISOString().slice(0,10)}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
