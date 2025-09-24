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

// Function to save assessment data to Supabase
async function saveAssessmentData(assessmentData, resultPercentage) {
  try {
    console.log('Preparing to save assessment data...')
    
    // Extract context data from assessment
    const context = assessmentData.context || {}
    
    // Prepare the data payload
    const payload = {
      position: context.position || null,
      experience: context.experience || null,
      subject: context.subject || null,
      aiKnowledge: context.aiKnowledge || null,
      answers: assessmentData.answers || [],
      resultPercentage: resultPercentage
    }
    
    console.log('Sending assessment data:', {
      ...payload,
      answersLength: payload.answers.length
    })
    
    // Call the API endpoint
    const response = await fetch('/api/save-assessment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Failed to save assessment: ${errorData.error || response.statusText}`)
    }
    
    const result = await response.json()
    console.log('Assessment saved successfully:', result.id)
    
    return result
    
  } catch (error) {
    console.error('Error saving assessment data:', error)
    // Don't throw the error to avoid breaking the user experience
    // Just log it for debugging purposes
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
      try {
        // Load assessment data from localStorage
        const data = readAssessmentData()
        if (!data || !Array.isArray(data.answers) || !Array.isArray(data.questions)) {
          setError('No assessment data found. Please complete the assessment first.')
          setLoading(false)
          return
        }

        // Calculate overall score percentage
        const totalScore = data.answers.reduce((sum, value) => sum + (parseInt(value, 10) || 0), 0)
        const maxPossibleScore = data.questions.length * 4 // Max score per question is 4
        const scorePercent = Math.round((totalScore / maxPossibleScore) * 100)
        
        // Set the interpretation first before using it in the prompt
        const currentInterpretation = getInterpretation(scorePercent)
        setAssessmentData(data)
        setPercent(scorePercent)
        setInterpretation(currentInterpretation)

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
- Role: ${roleMap[getContextValue('position')] || getContextValue('position')}
- Experience: ${experienceMap[getContextValue('experience')] || getContextValue('experience')}
- Subject: ${subjectMap[getContextValue('subject')] || getContextValue('subject')}
- Current AI Knowledge: ${aiKnowledgeMap[getContextValue('aiKnowledge')] || getContextValue('aiKnowledge')}

Assessment summary:
Overall percentage: ${scorePercent}%
Overall level: ${currentInterpretation.label}
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
          setActionPlan(content)

          // Save assessment data to Supabase
          await saveAssessmentData(data, scorePercent)
        } catch (err) {
          console.error('Error calling GPT API:', err)
          setError(`Failed to generate action plan: ${err.message || 'Unknown error'}`)
        } finally {
          setLoading(false)
        }
      } catch (outerError) {
        console.error('Error in assessment processing:', outerError)
        setError(`An error occurred: ${outerError.message || 'Unknown error'}`)
        setLoading(false)
      }
    }

    processAssessment()
  }, [])

  // Generate personalized learning path table
  function generateLearningPath() {
    if (!assessmentData) return ''
    
    const context = assessmentData.context || {}
    
    // Map context values to readable format
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
      'minimal': 'Limited AI experience',
      'basic': 'Basic AI awareness',
      'intermediate': 'Some AI experience',
      'advanced': 'Advanced AI experience'
    }

    // Subject-specific level-based learning paths
    const subjectLearningPaths = {
      'english': {
        levels: {
          1: {
            title: 'Level 1 (Starter)',
            courses: ['Intro to AI in Education', 'Using AI for Lesson Planning', 'AI Tools for Grammar/Writing'],
            webinars: ['AI Basics for Language Teachers', 'Practical AI Tools for Literacy'],
            resources: ['UNESCO "AI in Education" Guide', 'British Council AI in English Teaching']
          },
          2: {
            title: 'Level 2 (Intermediate)',
            courses: ['AI for Differentiated Reading', 'Creative Writing with Generative AI', 'AI for Assessment & Feedback'],
            webinars: ['AI Reading Platforms', 'Case Study: AI in Feedback'],
            resources: ['JISC AI in Assessment', 'AI-Supported Lesson Plans (English)']
          },
          3: {
            title: 'Level 3 (Advanced)',
            courses: ['Building Student AI Literacy', 'AI in Literature & Critical Thinking', 'Managing AI Class Projects'],
            webinars: ['AI Ethics & Creative Writing', 'Leading AI Change in English Departments'],
            resources: ['FutureLearn AI in Education Report', 'EdTech Case Studies (English)']
          },
          4: {
            title: 'Level 4 (Expert)',
            courses: ['Designing AI-Enhanced Curricula', 'Research in AI & Language Learning', 'Training Teachers in AI'],
            webinars: ['AI Leadership in English Teaching', 'Innovating English Pedagogy with AI'],
            resources: ['OECD AI in Education Whitepaper', 'Research on AI in Applied Linguistics']
          }
        }
      },
      'math': {
        levels: {
          1: {
            title: 'Level 1 (Starter)',
            courses: ['Intro to AI in Education', 'AI Tools for Math Worksheets', 'Basics of Automated Marking'],
            webinars: ['AI Basics for STEM Teachers', 'Using AI for Practice Problems'],
            resources: ['UNESCO "AI in Education"', 'NCTM (US) resource on AI & Maths']
          },
          2: {
            title: 'Level 2 (Intermediate)',
            courses: ['Adaptive AI Math Platforms', 'AI for Formative Assessment', 'AI-Generated Problem Sets'],
            webinars: ['Personalised Learning with AI in Maths', 'Case Study: AI in Assessment'],
            resources: ['JISC Adaptive Learning Guide', 'Lesson Bank: AI in Maths']
          },
          3: {
            title: 'Level 3 (Advanced)',
            courses: ['AI for Data Analysis Projects', 'Teaching Statistics with AI Tools', 'Student AI Project Design'],
            webinars: ['Ethics of AI in STEM', 'Departmental AI Integration'],
            resources: ['Royal Society AI in STEM', 'FutureLearn AI for Educators']
          },
          4: {
            title: 'Level 4 (Expert)',
            courses: ['Designing AI-Integrated Math Curricula', 'Research in AI & Mathematics', 'Training Colleagues in AI'],
            webinars: ['AI Policy & STEM Leadership', 'Innovating with AI in Maths Pedagogy'],
            resources: ['OECD AI STEM Reports', 'Research Papers on AI in Mathematics']
          }
        }
      },
      'humanities': {
        levels: {
          1: {
            title: 'Level 1 (Starter)',
            courses: ['Intro to AI in Education', 'Using AI for History/Geography Lesson Prep', 'Basics of AI Mapping/Timeline Tools'],
            webinars: ['AI Basics for Humanities', 'AI Tools for Storytelling/Maps'],
            resources: ['UNESCO "AI & Humanities"', 'Historical Association AI resources']
          },
          2: {
            title: 'Level 2 (Intermediate)',
            courses: ['AI for Source Analysis', 'AI-Assisted Essay Feedback', 'AI Tools for Research Skills'],
            webinars: ['AI & Historical Thinking', 'AI in Research Projects'],
            resources: ['JISC AI in Research', 'Humanities Lesson Bank with AI']
          },
          3: {
            title: 'Level 3 (Advanced)',
            courses: ['Teaching Critical AI Literacy', 'AI for Debate & Argument Analysis', 'Project-Based AI in Humanities'],
            webinars: ['Ethics of AI in Social Studies', 'Leading AI Humanities Integration'],
            resources: ['Council of Europe AI & Democracy', 'EdTech Case Studies (Humanities)']
          },
          4: {
            title: 'Level 4 (Expert)',
            courses: ['Designing AI Curricula for Humanities', 'AI Research in Education', 'Training Humanities Teachers'],
            webinars: ['Policy & Ethics in AI Humanities', 'Innovative Teaching with AI Tools'],
            resources: ['OECD AI & Democracy', 'Peer-Reviewed Research on AI in Humanities']
          }
        }
      },
      'arts': {
        levels: {
          1: {
            title: 'Level 1 (Starter)',
            courses: ['Intro to AI in Creative Education', 'Basics of AI Image/Audio Tools', 'Using AI for Classroom Projects'],
            webinars: ['AI Basics for Arts Teachers', 'Creative AI Tools Overview'],
            resources: ['UNESCO AI & Creativity', 'Tate resource on AI in Arts']
          },
          2: {
            title: 'Level 2 (Intermediate)',
            courses: ['AI for Music/Art Creation', 'Using AI for Visual Analysis', 'Generative AI for Student Projects'],
            webinars: ['Case Study: AI in Visual Arts', 'AI in Music & Performance'],
            resources: ['JISC AI & Creativity', 'Lesson Plans for AI Arts']
          },
          3: {
            title: 'Level 3 (Advanced)',
            courses: ['Ethics of AI in Creativity', 'Managing Student AI Art Projects', 'AI for Advanced Multimedia Analysis'],
            webinars: ['Debate: AI & Authenticity in Arts', 'Leading Arts with AI'],
            resources: ['Research: AI & Arts', 'Creative Industries AI Report']
          },
          4: {
            title: 'Level 4 (Expert)',
            courses: ['Designing AI Arts Curricula', 'AI in Creative Research', 'Training in AI & Arts Education'],
            webinars: ['Leadership in AI Arts', 'Innovation in AI Creativity'],
            resources: ['OECD AI & Creative Industries', 'Peer Research: AI in Arts']
          }
        }
      },
      'science': {
        levels: {
          1: {
            title: 'Level 1 (Starter)',
            courses: ['Intro to AI in Education', 'AI Tools for Experiments', 'Basics of AI Simulations'],
            webinars: ['AI Basics in Science', 'Simulations with AI'],
            resources: ['UNESCO AI in STEM', 'Royal Society Teaching AI']
          },
          2: {
            title: 'Level 2 (Intermediate)',
            courses: ['AI for Lab Reports', 'AI Simulations in Physics/Biology', 'AI for Scientific Research Skills'],
            webinars: ['Case Study: AI in Science Labs', 'AI & Inquiry-Based Learning'],
            resources: ['JISC STEM AI', 'Science Lesson Bank with AI']
          },
          3: {
            title: 'Level 3 (Advanced)',
            courses: ['AI for Data Analysis', 'AI in Scientific Ethics', 'Student-Led AI Science Projects'],
            webinars: ['AI in Climate Science', 'Leading AI in Science Departments'],
            resources: ['FutureLearn AI Science', 'Research: AI in STEM']
          },
          4: {
            title: 'Level 4 (Expert)',
            courses: ['Designing AI-Integrated Science Curricula', 'Researching AI in Science Education', 'Training Colleagues'],
            webinars: ['AI in Global Scientific Research', 'Policy for Science AI Integration'],
            resources: ['OECD STEM AI', 'Peer-Reviewed Science AI Studies']
          }
        }
      },
      'primary': {
        levels: {
          1: {
            title: 'Level 1 (Starter)',
            courses: ['Intro to AI in Primary', 'AI Tools for Classroom Organisation', 'Basics of AI Storytelling'],
            webinars: ['AI Basics for Primary', 'Practical AI in Early Learning'],
            resources: ['UNESCO AI in Early Childhood', 'Teacher Primary AI Toolkit']
          },
          2: {
            title: 'Level 2 (Intermediate)',
            courses: ['AI for Differentiation', 'AI Games for Numeracy & Literacy', 'AI in Formative Feedback'],
            webinars: ['Case Study: AI in Primary Literacy', 'AI Play-Based Learning'],
            resources: ['JISC Primary EdTech', 'Lesson Banks for Primary AI']
          },
          3: {
            title: 'Level 3 (Advanced)',
            courses: ['Teaching AI Awareness to Children', 'AI in Cross-Curricular Projects', 'Student Creativity with AI'],
            webinars: ['AI & Safeguarding', 'Leading Primary AI Initiatives'],
            resources: ['UNICEF AI & Children', 'Primary School AI Case Studies']
          },
          4: {
            title: 'Level 4 (Expert)',
            courses: ['Designing AI Curricula for Primary', 'Research on AI in Early Years', 'Training Primary Colleagues'],
            webinars: ['Policy in Primary AI', 'Innovations in Primary Pedagogy'],
            resources: ['OECD AI & Childhood', 'Research on Primary AI Learning']
          }
        }
      },
      'ict': {
        levels: {
          1: {
            title: 'Level 1 (Starter)',
            courses: ['Intro to AI Concepts', 'Basics of AI Coding Platforms', 'Classroom AI Tools'],
            webinars: ['AI Basics for CS Teachers', 'Teaching AI Fundamentals'],
            resources: ['UNESCO AI Literacy', 'Scratch/AI Resources']
          },
          2: {
            title: 'Level 2 (Intermediate)',
            courses: ['Teaching AI Algorithms', 'Using AI APIs in Class', 'AI Project Development'],
            webinars: ['Case Study: AI in Coding Projects', 'AI Ethics in CS'],
            resources: ['JISC Computer Science AI', 'AI Curriculum Kits']
          },
          3: {
            title: 'Level 3 (Advanced)',
            courses: ['Machine Learning for Schools', 'AI Ethics & Bias', 'Designing Student AI Projects'],
            webinars: ['AI Careers for Students', 'Leading CS AI Curriculum'],
            resources: ['Google AI Education', 'MIT AI Literacy']
          },
          4: {
            title: 'Level 4 (Expert)',
            courses: ['Advanced Machine Learning in Education', 'Research in AI Pedagogy', 'Training CS Teachers'],
            webinars: ['AI Policy in Computing', 'Innovation in CS Curricula'],
            resources: ['OECD AI Literacy', 'Peer-Reviewed CS/AI Research']
          }
        }
      },
      'sen': {
        levels: {
          1: {
            title: 'Level 1 (Starter)',
            courses: ['Intro to AI & Inclusion', 'Basics of AI Assistive Tech', 'AI Classroom Tools for SEN'],
            webinars: ['AI Basics in Inclusive Ed', 'AI Tools for Accessibility'],
            resources: ['UNESCO Inclusive AI', 'National Autistic Society AI Tools']
          },
          2: {
            title: 'Level 2 (Intermediate)',
            courses: ['AI for Reading Support', 'AI Speech & Language Tools', 'Differentiated Learning with AI'],
            webinars: ['AI & Dyslexia', 'Case Study: AI in SEN'],
            resources: ['JISC Inclusive EdTech', 'AI SEN Resource Bank']
          },
          3: {
            title: 'Level 3 (Advanced)',
            courses: ['AI for Personalised Learning', 'AI Behaviour Monitoring Tools', 'Student AI Project Adaptations'],
            webinars: ['AI & Safeguarding SEN Students', 'Leading Inclusive AI Use'],
            resources: ['UNICEF AI & Disability', 'Inclusive EdTech Research']
          },
          4: {
            title: 'Level 4 (Expert)',
            courses: ['Designing AI Curricula for SEN', 'Research in AI & Inclusion', 'Training SEN Teachers'],
            webinars: ['Policy in Inclusive AI', 'Innovations in Assistive AI'],
            resources: ['OECD Inclusive AI', 'Peer Research: AI in SEN']
          }
        }
      },
      'pe': {
        levels: {
          1: {
            title: 'Level 1 (Starter)',
            courses: ['Intro to AI in PE', 'AI Tools for Fitness Tracking', 'Basics of AI Games for Movement'],
            webinars: ['AI Basics in PE', 'AI Tools for Coaching'],
            resources: ['UNESCO AI & Health', 'PE Association AI Tools']
          },
          2: {
            title: 'Level 2 (Intermediate)',
            courses: ['AI for Skill Tracking', 'Wearables & AI Analysis', 'Student Progress Monitoring with AI'],
            webinars: ['AI in Sport Training', 'Case Study: AI in PE'],
            resources: ['JISC AI in PE', 'Sport AI EdTech Tools']
          },
          3: {
            title: 'Level 3 (Advanced)',
            courses: ['AI in Biomechanics', 'AI in Team Sports Analysis', 'Student Projects with AI in PE'],
            webinars: ['Ethics of AI in Sport', 'Leading PE with AI Integration'],
            resources: ['Sports Science AI Research', 'PE Case Studies AI']
          },
          4: {
            title: 'Level 4 (Expert)',
            courses: ['Designing AI PE Curricula', 'Researching AI in Sport Education', 'Training PE Colleagues'],
            webinars: ['Policy in Sport & AI', 'Innovations in PE Pedagogy'],
            resources: ['OECD AI in Sport', 'Peer Research in AI & Physical Ed']
          }
        }
      }
    }

    // Determine user level based on assessment score (simplified logic)
    const getUserLevel = (percentage) => {
      if (percentage >= 85) return 4; // Expert
      if (percentage >= 70) return 3; // Advanced  
      if (percentage >= 55) return 2; // Intermediate
      return 1; // Starter
    }

    const role = roleMap[context.position] || context.position || 'Teacher'
    const subject = subjectMap[context.subject] || context.subject || 'General'
    const experience = experienceMap[context.experience] || context.experience || 'Experienced'
    const aiKnowledge = aiKnowledgeMap[context.aiKnowledge] || context.aiKnowledge || 'Limited AI experience'
    
    const userLevel = getUserLevel(percent)
    const subjectPath = subjectLearningPaths[context.subject] || subjectLearningPaths['primary']
    const currentLevel = subjectPath.levels[userLevel]

    return `
    <div class="learning-path">
      <h3>Personalised AI Development Pathway</h3>
      <p><strong>Profile:</strong> ${role} | <strong>Subject:</strong> ${subject} | <strong>Experience:</strong> ${experience} | <strong>AI Knowledge:</strong> ${aiKnowledge}</p>
      <p><strong>Your Current Level:</strong> ${currentLevel.title}</p>
      
      <table class="pathway-table">
        <thead>
          <tr>
            <th>Learning Component</th>
            <th>Your Level Recommendations</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Courses</strong></td>
            <td>
              <ul style="margin: 0; padding-left: 20px;">
                ${currentLevel.courses.map(course => `<li>${course}</li>`).join('')}
              </ul>
            </td>
          </tr>
          <tr>
            <td><strong>Webinars</strong></td>
            <td>
              <ul style="margin: 0; padding-left: 20px;">
                ${currentLevel.webinars.map(webinar => `<li>${webinar}</li>`).join('')}
              </ul>
            </td>
          </tr>
          <tr>
            <td><strong>Resources</strong></td>
            <td>
              <ul style="margin: 0; padding-left: 20px;">
                ${currentLevel.resources.map(resource => `<li>${resource}</li>`).join('')}
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div style="margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px;">
        <h4 style="margin-top: 0; color: #18ab4b;">📈 Your Progress Path</h4>
        <p style="margin-bottom: 5px;"><strong>All Levels Available:</strong></p>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          ${[1,2,3,4].map(level => `
            <span style="padding: 5px 12px; border-radius: 15px; font-size: 0.9rem; ${level === userLevel ? 'background: #18ab4b; color: white; font-weight: bold;' : 'background: rgba(255,255,255,0.1); color: #ccc;'}">
              Level ${level} ${level === userLevel ? '(Current)' : ''}
            </span>
          `).join('')}
        </div>
        <p style="margin-top: 10px; font-size: 0.9rem; color: #ccc;">
          Complete your current level activities and retake the assessment to progress to the next level.
        </p>
      </div>
    </div>
    `
  }

  // Generate downloadable HTML report
  function downloadReport() {
    if (!assessmentData) {
      alert('No assessment data available')
      return
    }

    // Build complete HTML report
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>AI Teacher Assessment Report</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    @font-face {
      font-family: 'TodaySB Regular';
      src: url('/TodaySB-Regular.otf') format('opentype');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
    body {
      font-family: 'TodaySB Regular', Arial, sans-serif;
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
    .comprehensive-analysis {
      background: rgba(255,255,255,0.05);
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 30px;
    }
    .comprehensive-analysis h3 {
      color: #18ab4b;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding-bottom: 10px;
      margin-top: 20px;
    }
    .comprehensive-analysis h4 {
      color: #f5a623;
      margin-top: 25px;
      margin-bottom: 15px;
    }
    .comprehensive-analysis ul {
      padding-left: 20px;
      margin-bottom: 20px;
    }
    .comprehensive-analysis li {
      margin-bottom: 10px;
    }
    .comprehensive-analysis p {
      margin-bottom: 15px;
      text-align: justify;
    }
    .learning-path {
      background: rgba(255,255,255,0.05);
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 30px;
    }
    .learning-path h3 {
      color: #18ab4b;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding-bottom: 10px;
      margin-top: 0;
      margin-bottom: 15px;
    }
    .pathway-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    .pathway-table th,
    .pathway-table td {
      border: 1px solid rgba(255,255,255,0.2);
      padding: 12px;
      text-align: left;
      vertical-align: top;
    }
    .pathway-table th {
      background: rgba(255,255,255,0.1);
      color: #fff;
      font-weight: 600;
    }
    .pathway-table td {
      background: rgba(255,255,255,0.03);
    }
    .pathway-table tr:nth-child(even) td {
      background: rgba(255,255,255,0.08);
    }
    .pathway-table a {
      color: #18ab4b;
      text-decoration: underline;
    }
    .pathway-table a:hover {
      color: #20c55e;
      text-decoration: none;
    }
    .implementation-strategies {
      background: rgba(255,255,255,0.05);
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 30px;
    }
    .implementation-strategies h2 {
      color: #18ab4b;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding-bottom: 10px;
      margin-top: 0;
      margin-bottom: 20px;
    }
    .implementation-strategies h3 {
      color: #f5a623;
      margin-top: 25px;
      margin-bottom: 15px;
    }
    .implementation-strategies ul {
      padding-left: 20px;
      margin-bottom: 20px;
    }
    .implementation-strategies li {
      margin-bottom: 10px;
    }
    .implementation-strategies p {
      margin-bottom: 15px;
      text-align: justify;
    }
    .institutional-framework {
      background: rgba(255,255,255,0.05);
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 30px;
    }
    .institutional-framework h2 {
      color: #18ab4b;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding-bottom: 10px;
      margin-top: 0;
      margin-bottom: 20px;
    }
    .institutional-framework h3 {
      color: #f5a623;
      margin-top: 25px;
      margin-bottom: 15px;
    }
    .institutional-framework ul {
      padding-left: 20px;
      margin-bottom: 20px;
    }
    .institutional-framework li {
      margin-bottom: 10px;
    }
    .institutional-framework p {
      margin-bottom: 15px;
      text-align: justify;
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
  
  <div class="comprehensive-analysis">
    <h2>Comprehensive Development Analysis</h2>
    
    <h3>AI Readiness Assessment</h3>
    
    <h4>🎯 Current Position Analysis</h4>
    <p>Most educational institutions today find themselves at a critical juncture regarding AI integration, typically operating at a "Digital Foundation" level where basic technology infrastructure exists but systematic AI implementation remains underdeveloped. Schools generally possess standard hardware, internet connectivity, and some educational software, yet lack comprehensive AI literacy among faculty and structured policies for AI tool deployment.</p>
    
    <p>The current landscape reveals a significant opportunity gap where teachers are increasingly curious about AI applications but often lack formal training, institutional support, and clear guidelines for ethical implementation. This creates an environment ripe for strategic development, where early adopters can establish competitive advantages in educational outcomes while contributing to institutional AI maturity.</p>
    
    <ul>
      <li>Basic technology infrastructure in place but limited AI-specific tools or training programs</li>
      <li>Growing teacher interest in AI applications with minimal formal professional development support</li>
      <li>Absence of comprehensive AI policies and ethical guidelines for classroom implementation</li>
    </ul>
    
    <h4>🏆 Pedagogical Strengths & Capabilities</h4>
    <p>Experienced educators bring invaluable foundational strengths that position them excellently for AI integration success. Their deep understanding of learning theories, classroom management expertise, and ability to differentiate instruction provide the pedagogical framework necessary for meaningful AI application. These professionals already excel at identifying individual student needs, adapting content delivery, and creating engaging learning experiences – skills that become amplified rather than replaced by AI tools.</p>
    
    <p>Additionally, seasoned teachers possess critical thinking abilities and professional judgment that enable them to evaluate AI-generated content for accuracy, appropriateness, and educational value. Their established relationships with students and understanding of developmental psychology ensure that AI integration maintains the human-centered approach essential for effective education.</p>
    
    <ul>
      <li>Strong pedagogical foundation in learning theories and differentiated instruction strategies</li>
      <li>Established classroom management skills and ability to build meaningful student relationships</li>
      <li>Professional judgment and critical thinking capabilities for evaluating AI tool effectiveness</li>
    </ul>
    
    <h4>🚀 Priority Development Areas</h4>
    <p>The most critical development area involves building comprehensive AI literacy, encompassing both technical understanding of how AI tools function and practical knowledge of their educational applications. Teachers need systematic exposure to prompt engineering, understanding of AI limitations and biases, and hands-on experience with various AI platforms relevant to their subject areas.</p>
    
    <p>Equally important is developing skills in AI-assisted curriculum design and assessment creation, learning to leverage AI for personalized learning pathways while maintaining pedagogical rigor. This includes understanding how to effectively integrate AI tools without compromising critical thinking development or creating over-dependence among students.</p>
    
    <ul>
      <li>Fundamental AI literacy including prompt engineering and understanding tool limitations</li>
      <li>AI-assisted curriculum design and personalized learning pathway creation</li>
      <li>Ethical AI implementation strategies that maintain educational integrity and student agency</li>
    </ul>
  </div>
  
  ${generateLearningPath()}
  
  <div class="implementation-strategies">
    <h2>Practical Implementation Strategies</h2>
    
    <h3>📝 AI-Enhanced Lesson Planning</h3>
    <p>Transform your lesson planning process by leveraging AI as a collaborative partner rather than a replacement for professional judgment. Begin each planning session by using AI to generate initial content frameworks, activity suggestions, and differentiation strategies, then apply your pedagogical expertise to refine and customize these outputs for your specific students and learning objectives.</p>
    
    <p>Develop a systematic approach to AI-assisted planning that includes prompt templates for different lesson components, quality evaluation criteria for AI-generated content, and integration checkpoints to ensure alignment with curriculum standards and student needs. This structured methodology ensures consistency while maximizing the efficiency gains that AI tools provide.</p>
    
    <ul>
      <li>Create standardized prompt templates for lesson objectives, activities, and assessment creation</li>
      <li>Establish quality evaluation criteria for reviewing and refining AI-generated educational content</li>
      <li>Implement systematic integration checkpoints to ensure curriculum alignment and student appropriateness</li>
    </ul>
    
    <h3>📊 Student Assessment & Feedback Systems</h3>
    <p>Revolutionize your assessment practices by implementing AI-powered feedback systems that provide immediate, personalized responses to student work while maintaining the depth and nuance that only human insight can provide. Use AI to generate initial feedback drafts, identify common error patterns, and suggest intervention strategies, then enhance these outputs with your professional observations and relationship knowledge.</p>
    
    <p>Develop competency in creating AI-assisted rubrics, automated progress tracking systems, and adaptive assessment tools that respond to individual learning trajectories. This approach enables more frequent, meaningful feedback while reducing administrative burden, allowing greater focus on high-impact instructional activities.</p>
    
    <ul>
      <li>Implement AI-powered initial feedback generation systems enhanced by professional judgment</li>
      <li>Create adaptive assessment tools that respond to individual student learning patterns</li>
      <li>Develop automated progress tracking with human oversight for meaningful intervention planning</li>
    </ul>
    
    <h3>🤝 Collaborative Learning Facilitation</h3>
    <p>Enhance collaborative learning experiences by using AI to create dynamic group formations, generate discussion prompts that spark meaningful dialogue, and provide real-time facilitation support during collaborative activities. AI tools can analyze student interaction patterns, suggest optimal grouping strategies, and offer conversation starters tailored to specific learning objectives and student interests.</p>
    
    <p>Master the art of AI-assisted project management for student collaborations, including timeline generation, role assignment optimization, and progress monitoring systems that help students develop both academic content knowledge and essential 21st-century collaboration skills.</p>
    
    <ul>
      <li>Utilize AI for dynamic group formation based on learning styles and complementary skills</li>
      <li>Generate targeted discussion prompts and conversation starters for meaningful student dialogue</li>
      <li>Implement AI-assisted project management systems that develop student collaboration competencies</li>
    </ul>
  </div>
  
  <div class="institutional-framework">
    <h2>🏛️ Institutional Integration Framework</h2>
    
    <h3>👥 Stakeholder Engagement Strategy</h3>
    <p>Develop a comprehensive stakeholder engagement plan that addresses the concerns and interests of administrators, parents, students, and fellow educators regarding AI integration in the classroom. Create clear communication materials that explain the pedagogical rationale for AI use, demonstrate alignment with educational standards, and address common concerns about technology dependence or academic integrity.</p>
    
    <p>Position yourself as a bridge between innovation and tradition by emphasizing how AI tools enhance rather than replace fundamental educational values. Prepare presentations and demonstration materials that showcase concrete benefits while acknowledging limitations and maintaining transparency about AI tool capabilities and constraints.</p>
    
    <ul>
      <li>Develop clear communication materials explaining pedagogical rationale and educational standards alignment</li>
      <li>Create demonstration showcases highlighting concrete benefits while acknowledging limitations</li>
      <li>Establish regular feedback mechanisms with all stakeholder groups for continuous improvement</li>
    </ul>
    
    <h3>📜 Policy Development & Compliance</h3>
    <p>Contribute to institutional AI policy development by documenting best practices, ethical considerations, and practical implementation guidelines based on your classroom experience. Help establish clear boundaries for appropriate AI use while maintaining flexibility for innovation and adaptation as technology evolves.</p>
    
    <p>Ensure compliance with existing educational technology policies, data privacy requirements, and academic integrity standards.</p>
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
              <h2>There was an error generating your results</h2>
              <p>{error}</p>
              <div style={{ marginTop: '30px' }}>
                <button className="assessment-btn" onClick={startNewAssessment}>Start New Assessment</button>
              </div>
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
          font-family: 'TodaySB Regular', Arial, sans-serif;
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
