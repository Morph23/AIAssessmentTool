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

    import Head from 'next/head';
    import { useEffect, useState } from 'react';

    const SCORE_MAP = [2, 3, 5, 8];
    const INTERP = [
      { min: 90, label: '🌟 AI Education Pioneer', color: '#28a745', desc: `You're ready to lead and innovate. Your focus should be on scaling your impact and mentoring others.` },
      { min: 75, label: '🚀 Advanced AI Teacher', color: '#1f4e79', desc: `You have a strong command of AI in education. It's time to refine your advanced skills and share your expertise.` },
      { min: 60, label: '💡 Developing AI Teacher', color: '#e99402', desc: `You have a solid foundation. The next step is to build confidence through consistent, practical application.` },
      { min: 40, label: '🌱 Emerging AI Teacher', color: '#dc3545', desc: `You're building awareness and are ready to move from theory to practice with simple, hands-on tasks.` },
      { min: 0, label: '🎯 AI Education Starter', color: '#dc3545', desc: `You're at the beginning of an exciting journey. Start with the basics to build foundational knowledge.` }
    ];

    function getInterpretation(pct) {
      for (const i of INTERP) if (pct >= i.min) return i;
    }

    function getPersonalContextLabel(category, value) {
      const labels = {
        role: {
          primary: 'Teacher (Primary/Elementary)',
          secondary: 'Teacher (Secondary/High School)',
          hod: 'Head of Department/Subject Lead',
          sen: 'SEN Coordinator/Learning Support Teacher',
          admin: 'School Leader/Administrator',
          trainee: 'Trainee Teacher/Early Career Teacher'
        },
        experience: {
          new: 'New to teaching (0-2 years)',
          developing: 'Developing teacher (3-7 years)',
          experienced: 'Experienced teacher (8-15 years)',
          seasoned: 'Seasoned educator (15+ years)'
        },
        industry: {
          primary: 'Primary/Elementary (General)',
          english: 'English/Literacy',
          math: 'Mathematics/Numeracy',
          science: 'Science',
          humanities: 'Humanities',
          arts: 'Arts & Design',
          pe: 'Physical Education',
          ict: 'ICT/Computer Science',
          vocational: 'Vocational Subjects',
          sen: 'Special Educational Needs (SEN)'
        },
        orgsize: {
          minimal: 'Minimal exposure to AI',
          basic: 'Basic awareness of AI',
          intermediate: 'Some hands-on experience',
          advanced: 'Regular use of AI'
        }
      };
      return labels[category]?.[value] || value || '-';
    }

    function generateFallbackActionPlan(percentage) {
      let nowContent, nextContent, laterContent;
      if (percentage >= 75) {
        nowContent = `<li><h5>Share a Success</h5><p><strong>What to do:</strong> Share one successful AI-powered resource or activity you created with a colleague in your department.</p><p><strong>Why it helps:</strong> This builds your role as a leader, encourages collaboration, and scales positive AI impact across the school.</p></li>`;
        nextContent = `<li><h5>Lead a Pilot Project</h5><p><strong>What to do:</strong> Volunteer to lead a small pilot project exploring a new AI tool with a specific class or year group.</p><p><strong>Why it helps:</strong> This provides a structured way to innovate, gather evidence of impact, and build a case for wider adoption.</p></li>`;
        laterContent = `<li><h5>Influence School Policy</h5><p><strong>What to consider:</strong> How can your practical experience inform your school's official AI guidelines and policies?</p><p><strong>Why it matters:</strong> Teacher-led policy is more effective and ensures that school-wide strategies are grounded in real classroom practice.</p></li>`;
      } else if (percentage >= 45) {
        nowContent = `<li><h5>Differentiate a Resource</h5><p><strong>What to do:</strong> Take a piece of text you're using in class and ask an AI to simplify it for learners who need support, or add extension questions for advanced pupils.</p><p><strong>Why it helps:</strong> This is a quick, powerful way to cater to diverse learning needs without creating multiple resources from scratch.</p></li>`;
        nextContent = `<li><h5>Explore AI for Assessment</h5><p><strong>What to do:</strong> Use an AI tool to help you create a marking rubric or generate varied quiz questions for an upcoming topic.</p><p><strong>Why it helps:</strong> This builds your confidence in using AI for core teaching tasks and can significantly reduce your marking workload over time.</p></li>`;
        laterContent = `<li><h5>Curriculum Evolution</h5><p><strong>What to consider:</strong> How might AI tools change the most important skills pupils need to succeed in your subject in the next five years?</p><p><strong>Why it matters:</strong> Thinking about this now helps you prepare pupils for their future, ensuring your teaching remains relevant and impactful.</p></li>`;
      } else {
        nowContent = `<li><h5>Brainstorm Lesson Ideas</h5><p><strong>What to do:</strong> Use an AI tool like ChatGPT or Gemini to brainstorm three creative starter activities for your next topic.</p><p><strong>Why it helps:</strong> This saves planning time and can introduce fresh perspectives into your lessons with very little effort.</p></li>`;
        nextContent = `<li><h5>Watch a Tutorial</h5><p><strong>What to do:</strong> Find and watch a 15-minute "AI for Teachers" video tutorial on YouTube that demonstrates a specific tool.</p><p><strong>Why it helps:</strong> This is a low-commitment way to build foundational knowledge and see what's possible before trying it yourself.</p></li>`;
        laterContent = `<li><h5>AI for Admin</h5><p><strong>What to consider:</strong> How could AI help with just one administrative task, like drafting a parent email or summarizing meeting notes?</p><p><strong>Why it matters:</strong> Starting with non-teaching tasks can be an easy entry point to understanding AI's potential to save you valuable time.</p></li>`;
      }
      return `<h3>🎯 Now (The Next 2-4 Weeks): Quick Wins for Your Classroom</h3><ul>${nowContent}</ul><h3>🌱 Next (This Term): Build Your Skills</h3><ul>${nextContent}</ul><h3>🔭 Later (Next Term & Beyond): Think Strategically</h3><ul>${laterContent}</ul>`;
    }

    function getAssessmentData() {
      if (typeof window === 'undefined') return null;
      try {
        return JSON.parse(localStorage.getItem('assessmentResults'));
      } catch {
        return null;
      }
    }

    export default function ResultsPage() {
      const [score, setScore] = useState(null);
      const [percentage, setPercentage] = useState(null);
      const [interp, setInterp] = useState(null);
      const [actionPlan, setActionPlan] = useState('');
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [context, setContext] = useState({});
      const [detailedAnswers, setDetailedAnswers] = useState([]);

      useEffect(() => {
        const data = getAssessmentData();
        if (!data || !data.answers || !data.questions) {
          setError('No assessment data found. Please complete the assessment first.');
          setLoading(false);
          return;
        }
        const total = data.questions.length * 8;
        const rawScore = data.answers.reduce((sum, v) => sum + (parseInt(v, 10) || 0), 0);
        const pct = Math.round((rawScore / total) * 100);
        setScore(rawScore);
        setPercentage(pct);
        const interpObj = getInterpretation(pct);
        setInterp(interpObj);
        setContext(data.context || {});

        // Build detailed answers for prompt and breakdown
        const details = data.answers.map((score, idx) => {
          const q = data.questions[idx];
          const optionIndex = SCORE_MAP.indexOf(parseInt(score, 10));
          return {
            question_number: idx + 1,
            question_title: q.title,
            score: score,
            selected_option: q.options[optionIndex]?.label || ''
          };
        });
        setDetailedAnswers(details);

        // Build prompt for GPT-4o mini
        const prompt = `You are an expert AI Teaching Coach, specializing in providing practical, encouraging, and clear advice for busy school teachers. Your tone is supportive and jargon-free. Your task is to create a personalized action plan for a teacher based on their self-assessment results.\n\nThe teacher's context is:\n- Role: ${getPersonalContextLabel('role', data.context?.role)}\n- Experience: ${getPersonalContextLabel('experience', data.context?.experience)}\n- Subject: ${getPersonalContextLabel('industry', data.context?.industry)}\n- Current AI Knowledge: ${getPersonalContextLabel('orgsize', data.context?.orgsize)}\n\nTheir assessment answers are:\n${JSON.stringify(details, null, 2)}\n\nBased on this data, provide a concise and actionable roadmap using the following structure. Use HTML formatting as specified. Do not include any introductory or concluding paragraphs outside of this structure.\n\n<h3>🎯 Now (The Next 2-4 Weeks): Quick Wins for Your Classroom</h3>...`;

        fetch('/api/gpt4o', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
            // setActionPlan(generateFallbackActionPlan(pct));
            // setLoading(false);
          });
      }, []);

      function downloadReport() {
        let data = getAssessmentData();
        if (!data) return alert('No saved assessment found to download.');
        const total = data.questions.length * 8;
        const rawScore = data.answers.reduce((s, v) => s + (parseInt(v, 10) || 0), 0);
        const pct = Math.round((rawScore / total) * 100);
        const interpObj = getInterpretation(pct);
        const details = data.answers.map((score, idx) => {
          const q = data.questions[idx];
          const optionIndex = SCORE_MAP.indexOf(parseInt(score, 10));
          return `<div class='dimension'><strong>${idx + 1}. ${q.title}</strong><div style='color:#666'>Selected: ${q.options[optionIndex]?.label || ''} (${score})</div></div>`;
        }).join('');
        const contextHtml = `<div class='summary-grid'>
          <div><p><strong>Teacher Level:</strong> ${interpObj.label}</p></div>
          <div><p><strong>Overall Score:</strong> ${pct}%</p></div>
          <div><p><strong>Teaching Position:</strong> ${getPersonalContextLabel('role', data.context?.role)}</p></div>
          <div><p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p></div>
        </div>`;
        const html = `<!doctype html><html><head><meta charset='utf-8'><title>AI Teacher Report</title><style>@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');body{font-family:'Poppins',sans-serif;line-height:1.7;color:#343a40;margin:0;padding:20px;background:#f5f5f5;}.container{max-width:8.5in;margin:0 auto;background:#fff;padding:40px;border-radius:12px;box-shadow:0 6px 20px rgba(0,0,0,0.08);}.header{text-align:center;padding-bottom:25px;border-bottom:3px solid #1f4e79;margin-bottom:30px;}.header h1{color:#1f4e79;font-size:2.2rem;margin-bottom:8px;font-weight:700;}.header p{color:#6c757d;font-size:1.1rem;margin:0;}.summary-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;background:#f0f9ff;border-left:5px solid #1f4e79;padding:20px;margin-bottom:30px;border-radius:8px;}.summary-grid p{margin:0;font-size:0.95rem;}.summary-grid strong{color:#343a40;}.dimension{display:flex;justify-content:space-between;align-items:center;padding:15px 0;border-bottom:1px solid #dee2e6;}.dimension:last-child{border-bottom:none;}.footer{text-align:center;margin-top:40px;padding-top:20px;border-top:1px solid #e0e0e0;color:#888;}</style></head><body><div class='container'><div class='header'><h1>Your AI Teacher Action Plan</h1><p>A simple, practical roadmap for your professional development.</p></div>${contextHtml}<h2>Assessment Details</h2>${details}<hr/><h3>Action Plan</h3><div>${document.querySelector('.ai-analysis')?.innerHTML || ''}</div><div class='footer'><p>Report generated by <strong>AI4SchoolsHub.com</strong> | ${new Date().toLocaleString()}</p></div></div></body></html>`;
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `AI-Teacher-Report-${new Date().toISOString().slice(0,10)}.html`;
        a.click();
        URL.revokeObjectURL(url);
      }

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
                  <div className="summary-grid" style={{marginBottom:24}}>
                    <div><p><strong>Teacher Level:</strong> {interp.label}</p></div>
                    <div><p><strong>Overall Score:</strong> {percentage}%</p></div>
                    <div><p><strong>Teaching Position:</strong> {getPersonalContextLabel('role', context.role)}</p></div>
                    <div><p><strong>Date:</strong> {new Date().toLocaleDateString()}</p></div>
                  </div>
                  <div style={{ textAlign: 'center', margin: '24px 0' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: interp.color }}>{percentage}%</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 600, color: interp.color }}>{interp.label}</div>
                    <div style={{ margin: '12px 0', color: '#555' }}>{interp.desc}</div>
                  </div>
                  <hr className="assessment-divider" />
                  <div>
                    <h2 style={{ color: '#1f4e79', fontSize: '1.3rem', marginBottom: 8 }}>Your Personalized Action Plan</h2>
                    <div className="ai-analysis" dangerouslySetInnerHTML={{ __html: actionPlan }} />
                    <div style={{ marginTop: 18, display: 'flex', gap: 12 }}>
                      <button className="assessment-nav-btn" onClick={downloadReport}>Download Report</button>
                    </div>
                  </div>
                  <details style={{marginTop:32}}>
                    <summary>Your Full Assessment Details</summary>
                    <div className="details-content">
                      {detailedAnswers.map((ans, idx) => (
                        <div className="dimension" key={idx}>
                          <div>
                            <strong>{ans.question_number}. {ans.question_title}</strong><br/>
                            <span style={{color:'#6c757d', fontSize:'0.9rem'}}>Selected: {ans.selected_option} ({ans.score})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                  <div className="footer" style={{marginTop:40, paddingTop:20, borderTop:'1px solid #e0e0e0', color:'#888'}}>
                    <p>Report generated by <strong>AI4SchoolsHub.com</strong> | {new Date().toLocaleString()}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      );
    }
