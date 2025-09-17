


import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [form, setForm] = useState({
    position: '',
    experience: '',
    subject: '',
    aiKnowledge: ''
  });
  const router = useRouter();
  const isComplete = form.position && form.experience && form.subject && form.aiKnowledge;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isComplete) {
      router.push('/next');
    }
  };

  return (
    <>
      <Head>
        <title>Personalised AI Teacher Assessment</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Helvetica:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      <div className="assessment-bg">
        <div className="assessment-header">
          <img src="/defatoed.png" alt="DEfactoED Logo" className="defactoed-logo" />
        </div>
        <div className="assessment-card">
          <h1 className="assessment-title">Personalised AI Teacher Assessment</h1>
          <p className="assessment-subtitle">Evaluate your readiness to incorporate AI into teaching activities.</p>
          <hr className="assessment-divider" />
          <div className="assessment-welcome">
            <h2 className="assessment-welcome-title">Welcome!</h2>
            <p className="assessment-welcome-para">This assessment evaluates your AI readiness in teaching, providing a personalized development plan. Please tell us about your teaching background to customize your analysis.</p>
          </div>
          <form className="assessment-form" onSubmit={handleSubmit} autoComplete="off">
            <div className="assessment-field">
              <label htmlFor="position">Teaching Position</label>
              <select id="position" name="position" value={form.position} onChange={handleChange} required>
                <option value="" disabled>Select your position...</option>
                <option value="primary">Teacher (Primary/Elementary)</option>
                <option value="secondary">Teacher (Secondary/High School)</option>
                <option value="hod">Head of Department/Subject Lead</option>
                <option value="sen">SEN Coordinator/Learning Support Teacher</option>
                <option value="admin">School Leader/Administrator (e.g., Headteacher, Deputy Head)</option>
                <option value="trainee">Trainee Teacher/Early Career Teacher</option>
              </select>
            </div>
            <div className="assessment-field">
              <label htmlFor="experience">Teaching Experience</label>
              <select id="experience" name="experience" value={form.experience} onChange={handleChange} required>
                <option value="" disabled>Select experience...</option>
                <option value="new">New to teaching (0-2 years)</option>
                <option value="developing">Developing teacher (3-7 years)</option>
                <option value="experienced">Experienced teacher (8-15 years)</option>
                <option value="seasoned">Seasoned educator (15+ years)</option>
              </select>
            </div>
            <div className="assessment-field">
              <label htmlFor="subject">Subject Area</label>
              <select id="subject" name="subject" value={form.subject} onChange={handleChange} required>
                <option value="" disabled>Select subject area...</option>
                <option value="primary">Primary/Elementary Education (General)</option>
                <option value="english">English/Literacy</option>
                <option value="math">Mathematics/Numeracy</option>
                <option value="science">Science</option>
                <option value="humanities">Humanities (History, Geography, RE)</option>
                <option value="arts">Arts & Design (Art, Music, Drama)</option>
                <option value="pe">Physical Education</option>
                <option value="ict">ICT/Computer Science</option>
                <option value="vocational">Vocational Subjects</option>
                <option value="sen">Special Educational Needs (SEN)</option>
              </select>
            </div>
            <div className="assessment-field">
              <label htmlFor="aiKnowledge">Current AI Knowledge</label>
              <select id="aiKnowledge" name="aiKnowledge" value={form.aiKnowledge} onChange={handleChange} required>
                <option value="" disabled>Select your current AI knowledge level...</option>
                <option value="minimal">Minimal - Limited exposure to AI concepts</option>
                <option value="basic">Basic - General awareness of AI applications</option>
                <option value="intermediate">Intermediate - Some hands-on experience with AI tools</option>
                <option value="advanced">Advanced - Regular use of AI in work/research</option>
              </select>
            </div>
            <button
              type="submit"
              className="assessment-btn"
              disabled={!isComplete}
            >
              Start AI Teacher Assessment
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
