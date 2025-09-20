import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// Helper to safely read assessment data from localStorage
function readAssessmentData() {
  if (typeof window === 'undefined') return null
  try {
    const results = JSON.parse(localStorage.getItem('assessmentResults'))
    return results || null
  } catch (error) {
    console.error('Error reading assessment data:', error)
    return null
  }
}

// Map percentage score to interpretation
function getInterpretation(percent) {
  if (percent >= 90) return { 
    label: '🌟 AI Education Pioneer', 
    color: '#18ab4b', 
    desc: "You're ready to lead and innovate. Focus on scaling your impact and mentoring others."
  }
  if (percent >= 75) return { 
    label: '🚀 Advanced AI Teacher', 
    color: '#18ab4b', 
    desc: 'You have a strong command of AI in education. Refine your advanced skills and share your expertise.'
  }
  if (percent >= 60) return { 
    label: '💡 Developing AI Teacher', 
    color: '#f5a623', 
    desc: 'You have a solid foundation. Build confidence through consistent, practical application.'
  }
  if (percent >= 40) return { 
    label: '🌱 Emerging AI Teacher', 
    color: '#f5a623', 
    desc: "You're building awareness and ready to move from theory to practice with hands-on tasks."
  }
  return { 
    label: '🎯 AI Education Starter', 
    color: '#e74c3c', 
    desc: "You're at the beginning of an exciting journey. Start with the basics to build foundational knowledge."
  }
}

export default function ResultsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [assessmentData, setAssessmentData] = useState(null)
  const [percent, setPercent] = useState(0)
  const [interpretation, setInterpretation] = useState(null)
  const [actionPlan, setActionPlan] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function processAssessment() {
      // Load assessment data from localStorage
      const data = readAssessmentData()
      if (!data || !Array.isArray(data.answers) || !Array.isArray(data.questions)) {
        setError('No assessment data found. Please complete the assessment first.')
        setLoading(false)
        return
      }

      // Calculate overall score percentage
      const totalScore = data.answers.reduce((sum, value) => sum + (parseInt(value, 10) || 0), 0)
      const maxPossibleScore = data.questions.length * 8 // Max score per question is 8
      const scorePercent = Math.round((totalScore / maxPossibleScore) * 100)
      
      setAssessmentData(data)
      setPercent(scorePercent)
      setInterpretation(getInterpretation(scorePercent))

      // Prepare detailed answers for the prompt
      const detailedAnswers = data.answers.map((score, index) => {
        const question = data.questions[index] || { title: `Question ${index + 1}`, options: [] }
        const selectedOption = question.options && question.options[Math.max(0, parseInt(score/2.1))] // Map the numeric score back to option index
        
        return {
          question_number: index + 1,
          question_title: question.title || `Question ${index + 1}`,
          score: Number(score),
          selected_option: selectedOption?.label || `Option ${score}`
        }
      })

      // Get teacher context
      const context = data.context || {}
      const getContextValue = (key) => (context[key] || '-')

      // Map context values to more readable format
      const roleMap = {
        'primary': 'Primary/Elementary Teacher',
        'secondary': 'Secondary/High School Teacher',
        'hod': 'Head of Department/Subject Lead',
        'sen': 'SEN Coordinator/Learning Support Teacher',
        'admin': 'School Leader/Administrator',
        'trainee': 'Trainee Teacher/Early Career Teacher'
      }

      const experienceMap = {
        'new': '0-2 years experience',
        'developing': '3-7 years experience',
        'experienced': '8-15 years experience',
        'seasoned': '15+ years experience'
      }

      const subjectMap = {
        'primary': 'Primary/Elementary (General)',
        'english': 'English/Literacy',
        'math': 'Mathematics/Numeracy',
        'science': 'Science',
        'humanities': 'Humanities',
        'arts': 'Arts & Design',
        'pe': 'Physical Education',
        'ict': 'ICT/Computer Science',
        'vocational': 'Vocational Subjects',
        'sen': 'Special Educational Needs'
      }

      const aiKnowledgeMap = {
        'minimal': 'Minimal - Limited exposure',
        'basic': 'Basic - General awareness',
        'intermediate': 'Intermediate - Some hands-on experience',
        'advanced': 'Advanced - Regular use'
      }

      // Build the prompt for GPT
      const prompt = `You are an expert AI Teaching Coach. Produce a concise, practical, and encouraging personalised action plan for a teacher. Use HTML headings and lists as in the structure below. Tone: supportive, jargon-free.

Teacher context:
- Role: ${roleMap[getContextValue('role')] || getContextValue('role')}
- Experience: ${experienceMap[getContextValue('experience')] || getContextValue('experience')}
- Subject: ${subjectMap[getContextValue('industry')] || getContextValue('industry')}
- Current AI Knowledge: ${aiKnowledgeMap[getContextValue('orgsize')] || getContextValue('orgsize')}

Assessment summary:
Overall percentage: ${scorePercent}%
Overall level: ${interpretation.label}
Detailed answers:
${JSON.stringify(detailedAnswers, null, 2)}

Respond only with HTML content (no surrounding commentary) using this structure exactly:
<h3>🎯 Now (The Next 2-4 Weeks): Quick Wins for Your Classroom</h3>
<p>A very short intro sentence (1-2 lines).</p>
<ul>
  <li><strong>Title for suggestion 1:</strong> <br>What to do: Brief practical step. <br>Why it helps: Brief benefit explanation.</li>
  <li><strong>Title for suggestion 2:</strong> <br>What to do: Brief practical step. <br>Why it helps: Brief benefit explanation.</li>
  <li><strong>Title for suggestion 3:</strong> <br>What to do: Brief practical step. <br>Why it helps: Brief benefit explanation.</li>
</ul>

<h3>🌱 Next (This Term): Build Your Skills</h3>
<p>Short intro.</p>
<ul>
  <li><strong>Title for suggestion 1:</strong> <br>What to do: Brief practical step. <br>Why it helps: Brief benefit explanation.</li>
  <li><strong>Title for suggestion 2:</strong> <br>What to do: Brief practical step. <br>Why it helps: Brief benefit explanation.</li>
  <li><strong>Title for suggestion 3:</strong> <br>What to do: Brief practical step. <br>Why it helps: Brief benefit explanation.</li>
</ul>

<h3>🔭 Later (Next Term & Beyond): Think Strategically</h3>
<p>Short intro.</p>
<ul>
  <li><strong>Title for suggestion 1:</strong> <br>What to do: Brief practical step. <br>Why it helps: Brief benefit explanation.</li>
  <li><strong>Title for suggestion 2:</strong> <br>What to do: Brief practical step. <br>Why it helps: Brief benefit explanation.</li>
  <li><strong>Title for suggestion 3:</strong> <br>What to do: Brief practical step. <br>Why it helps: Brief benefit explanation.</li>
</ul>

Each list item should include a short title, "What to do:" and "Why it helps:". Keep content actionable and specific to the teacher's context and the provided detailed answers.`

      try {
        // Call the GPT-4o API through the backend proxy
        const response = await fetch('/api/gpt4o', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'You are an expert AI Teaching Coach.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 1000
          })
        })
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }
        
        const result = await response.json()
        const content = result.choices?.[0]?.message?.content || ''
        setActionPlan(content || '<p>No action plan could be generated. Please try again later.</p>')
      } catch (err) {
        console.error('Error calling GPT API:', err)
        setError(`Failed to generate action plan: ${err.message || 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    }

    processAssessment()
  }, [])

  // Generate downloadable HTML report
  function downloadReport() {
    if (!assessmentData) {
      alert('No assessment data available')
      return
    }
    
    // Generate question-by-question breakdown
    const questionsBreakdown = assessmentData.questions.map((question, index) => {
      const score = assessmentData.answers[index]
      const maxScore = 8
      const percentScore = Math.round((score / maxScore) * 100)
      const selectedOption = question.options && question.options[Math.max(0, parseInt(score/2.1))]
      
      // Determine color based on score percentage
      let color = '#e74c3c' // red for low scores
      if (percentScore >= 75) color = '#18ab4b' // green for high scores
      else if (percentScore >= 50) color = '#f5a623' // orange for mid scores
      
      return `<div style="margin-bottom: 15px; padding: 15px; border-radius: 8px; background: rgba(255,255,255,0.08);">
        <h4 style="margin-top: 0; margin-bottom: 5px;">${question.title}</h4>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
          <div style="color: #e0e0e0; font-size: 14px;">Selected: ${selectedOption?.label || `Option (Score: ${score})`}</div>
          <div style="font-weight: bold; color: ${color};">${percentScore}%</div>
        </div>
      </div>`
    }).join('')

    // Build complete HTML report
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>AI Teacher Assessment Report</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: 'Inter', Arial, sans-serif;
      background-color: #171717;
      color: #e0e0e0;
      line-height: 1.6;
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    h1, h2, h3, h4 {
      color: #fff;
      margin-top: 1.5em;
    }
    .report-header {
      text-align: center;
      margin-bottom: 30px;
      padding: 20px;
      background: rgba(255,255,255,0.05);
      border-radius: 10px;
    }
    .score-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255,255,255,0.05);
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 30px;
    }
    .score-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: conic-gradient(${interpretation.color} ${percent * 3.6}deg, #333 ${percent * 3.6}deg);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .score-inner {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: #171717;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: bold;
      color: ${interpretation.color};
    }
    .interpretation {
      flex: 1;
      padding-left: 30px;
    }
    .action-plan {
      background: rgba(255,255,255,0.05);
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 30px;
    }
    .action-plan h3 {
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding-bottom: 10px;
    }
    .action-plan ul {
      padding-left: 20px;
    }
    .action-plan li {
      margin-bottom: 15px;
    }
    .questions-breakdown {
      background: rgba(255,255,255,0.05);
      padding: 20px;
      border-radius: 10px;
    }
    .footer {
      text-align: center;
      margin-top: 50px;
      color: #999;
      font-size: 14px;
    }
    @media print {
      body {
        background: white;
        color: black;
      }
      .score-circle, .action-plan, .questions-breakdown, .score-section, .report-header {
        break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="report-header">
    <h1>AI Teacher Assessment Report</h1>
    <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
  </div>
  
  <div class="score-section">
    <div class="score-circle">
      <div class="score-inner">${percent}%</div>
    </div>
    <div class="interpretation">
      <h2>${interpretation.label}</h2>
      <p>${interpretation.desc}</p>
    </div>
  </div>
  
  <div class="action-plan">
    <h2>Your Personalised Action Plan</h2>
    ${actionPlan}
  </div>
  
  <div class="questions-breakdown">
    <h2>Question-by-Question Breakdown</h2>
    ${questionsBreakdown}
  </div>
  
  <div class="footer">
    <p>AI Teacher Assessment Tool</p>
    <p>Your journey toward AI integration in education begins here.</p>
  </div>
</body>
</html>`

    // Create a downloadable file
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-teacher-assessment-report-${new Date().toISOString().slice(0, 10)}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Go back to assessment
  function goBackToAssessment() {
    router.push('/assessment')
  }

  // Start a new assessment
  function startNewAssessment() {
    router.push('/')
  }

  return (
    <>
      <Head>
        <title>Assessment Results - AI Teacher Assessment</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Helvetica:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      
      <div className="assessment-bg">
        <div className="assessment-header">
          <img src="/defatoed.png" alt="DEfactoED Logo" className="defactoed-logo" />
        </div>
        
        <div className="assessment-card results-card">
          <h1 className="assessment-title">Your AI Teacher Assessment Results</h1>
          <p className="assessment-subtitle">Your personalised analysis and action plan.</p>
          <hr className="assessment-divider" />
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Generating your personalised action plan...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <h2>Error</h2>
              <p>{error}</p>
              <button className="assessment-btn" onClick={startNewAssessment}>Start New Assessment</button>
            </div>
          ) : (
            <div className="results-container">
              {/* Score Circle */}
              <div className="score-container">
                <div 
                  className="score-circle" 
                  style={{ 
                    background: `conic-gradient(${interpretation.color} ${percent * 3.6}deg, rgba(255,255,255,0.08) ${percent * 3.6}deg)` 
                  }}
                >
                  <div className="score-inner">
                    <span className="score-percent">{percent}%</span>
                  </div>
                </div>
              </div>
              
              {/* Interpretation */}
              <div className="interpretation-container">
                <h2 style={{ color: interpretation.color }}>{interpretation.label}</h2>
                <p>{interpretation.desc}</p>
              </div>
              
              {/* Action Plan */}
              <div className="action-plan-container">
                <h2>Your Personalised Action Plan</h2>
                <div 
                  className="action-plan-content"
                  dangerouslySetInnerHTML={{ __html: actionPlan }}
                />
              </div>
              
              {/* Action Buttons */}
              <div className="results-actions">
                <button className="assessment-btn secondary" onClick={goBackToAssessment}>
                  Review My Answers
                </button>
                <button className="assessment-btn" onClick={downloadReport}>
                  Download Full Report
                </button>
                <button className="assessment-btn secondary" onClick={startNewAssessment}>
                  Start New Assessment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .results-card {
          max-width: 800px;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 0;
        }
        
        .loading-spinner {
          border: 4px solid rgba(255,255,255,0.1);
          border-radius: 50%;
          border-top: 4px solid #18ab4b;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-container {
          text-align: center;
          padding: 40px 0;
        }
        
        .results-container {
          padding: 20px 0;
        }
        
        .score-container {
          display: flex;
          justify-content: center;
          margin: 30px 0;
        }
        
        .score-circle {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(0,0,0,0.3);
        }
        
        .score-inner {
          width: 170px;
          height: 170px;
          border-radius: 50%;
          background: #222;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .score-percent {
          font-size: 3.5rem;
          font-weight: 800;
          color: #fff;
        }
        
        .interpretation-container {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .interpretation-container h2 {
          font-size: 2rem;
          margin-bottom: 10px;
        }
        
        .action-plan-container {
          background: rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 40px;
        }
        
        .action-plan-container h2 {
          text-align: center;
          margin-top: 0;
          margin-bottom: 20px;
          color: #fff;
        }
        
        .action-plan-content {
          color: #e0e0e0;
          text-align: left;
        }
        
        .action-plan-content h3 {
          color: #fff;
          font-size: 1.3rem;
          margin: 25px 0 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 10px;
        }
        
        .action-plan-content p {
          margin-bottom: 15px;
        }
        
        .action-plan-content ul {
          padding-left: 20px;
        }
        
        .action-plan-content li {
          margin-bottom: 15px;
        }
        
        .action-plan-content strong {
          color: #fff;
        }
        
        .results-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 15px;
          margin-top: 30px;
        }
        
        .assessment-btn.secondary {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }
        
        @media (max-width: 600px) {
          .score-circle {
            width: 150px;
            height: 150px;
          }
          
          .score-inner {
            width: 130px;
            height: 130px;
          }
          
          .score-percent {
            font-size: 2.5rem;
          }
          
          .results-actions {
            flex-direction: column;
          }
        }
      `}</style>
      
      <style jsx global>{`
        body {
          margin: 0;
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .assessment-bg {
          min-height: 100vh;
          background-color: #171717;
          padding: 40px 20px;
        }
        
        .assessment-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .defactoed-logo {
          height: 60px;
          margin: 0 auto;
        }
        
        .assessment-card {
          background-color: #222;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
          max-width: 800px;
          margin: 0 auto;
        }
        
        .assessment-title {
          color: #fff;
          font-size: 2.2rem;
          font-weight: 800;
          margin: 0 0 10px 0;
          text-align: center;
        }
        
        .assessment-subtitle {
          color: #e0e0e0;
          font-size: 1.1rem;
          margin-top: 0;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .assessment-divider {
          border: 0;
          height: 1px;
          background: rgba(255,255,255,0.1);
          margin: 20px 0;
        }
        
        .assessment-btn {
          background: #18ab4b;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 14px 24px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
          display: inline-block;
          text-align: center;
        }
        
        .assessment-btn:hover {
          background: #139b41;
        }
        
        .assessment-btn:disabled {
          background: rgba(24, 171, 75, 0.5);
          cursor: not-allowed;
        }
        
        @media (max-width: 600px) {
          .assessment-card {
            padding: 30px 20px;
          }
          
          .assessment-title {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </>
  )
}
