const aiTeacherReadinessQuestions = [
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
    title: 'Integrating AI into Pedagogical Practice',
    prompt: 'How actively are you exploring or using AI tools to enhance your lesson planning, teaching methods, or pupil engagement?',
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
    title: 'Managing AI in School Assessment',
    prompt: 'How confident are you in adapting your assessment methods to account for AI tools while maintaining assessment fairness and capturing true pupil learning?',
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
    prompt: 'How effectively do you guide pupils in understanding appropriate and ethical AI use in their schoolwork and future lives?',
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
    prompt: 'How well do you understand how AI is transforming your subject area and the future skills pupils will need?',
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
    title: 'Updating Curriculum for the AI Era',
    prompt: 'How actively are you revising lesson content and learning objectives to remain relevant in an AI-influenced world?',
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
    title: 'Staying Current with AI Developments',
    prompt: 'How systematically do you monitor AI advances that could affect your subject area and your teaching practice?',
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
    title: 'AI in Classroom & Teacher Workflow',
    prompt: 'How effectively are you exploring or using AI tools to enhance your classroom preparation, data analysis (e.g., pupil progress), or teaching efficiency?',
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
    title: 'Navigating AI Ethics in Schools',
    prompt: 'How well do you address ethical considerations around AI use with pupils, in their schoolwork, and in collaboration with colleagues?',
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
    title: 'School AI Leadership',
    prompt: 'How actively do you share knowledge about AI applications with colleagues and contribute to school AI policies and practices?',
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

const mapOptionsWithScores = (options) =>
  options.map((option, index) => ({
    value: option.value ?? `option-${index + 1}`,
    label: option.label ?? option.text,
    description: option.desc ?? option.description ?? '',
    score: option.score ?? index + 1
  }));

const buildQuestions = (questionSet, prefix) =>
  questionSet.map((question, index) => ({
    id: `${prefix}-${index + 1}`,
    title: question.title ?? `Question ${index + 1}`,
    prompt: question.prompt ?? question.question,
    options: mapOptionsWithScores(question.options)
  }));

const AI_TEACHER_READINESS_ID = 'ai-teacher-readiness';
const SCIENCE_DEPT_ID = 'science-dept';
const HUMANITIES_DEPT_ID = 'humanities-dept';
const LEADERSHIP_ID = 'leadership';

const assessmentConfigs = {
  [AI_TEACHER_READINESS_ID]: {
    id: AI_TEACHER_READINESS_ID,
    name: 'AI Teacher readiness',
    heroTitle: 'Customisable AI Teacher Assessment',
    heroSubtitle:
      'Select a configuration to begin. Tailor the assessment experience to the needs of your role, subject, or department.',
    cardTitle: 'Choose Your Assessment Experience',
    cardSubtitle:
      'Each configuration provides a focused question set, context capture, and personalised insights based on your goals.',
    welcome: {
      title: 'Personalised AI Teacher Assessment',
      description:
        'This assessment evaluates your AI readiness in teaching. Share your teaching context, answer each question, and receive a tailored action plan you can put to work straight away.'
    },
    contextFields: [
      {
        id: 'position',
        label: 'Teaching Position',
        type: 'select',
        options: [
          { value: 'primary', label: 'Teacher (Primary/Elementary)' },
          { value: 'secondary', label: 'Teacher (Secondary/High School)' },
          { value: 'hod', label: 'Head of Department/Subject Lead' },
          { value: 'sen', label: 'SEN Coordinator/Learning Support Teacher' },
          { value: 'admin', label: 'School Leader/Administrator' },
          { value: 'trainee', label: 'Trainee Teacher/Early Career Teacher' }
        ]
      },
      {
        id: 'experience',
        label: 'Teaching Experience',
        type: 'select',
        options: [
          { value: 'new', label: 'New to teaching (0-2 years)' },
          { value: 'developing', label: 'Developing teacher (3-7 years)' },
          { value: 'experienced', label: 'Experienced teacher (8-15 years)' },
          { value: 'seasoned', label: 'Seasoned educator (15+ years)' }
        ]
      },
      {
        id: 'subject',
        label: 'Subject Area',
        type: 'select',
        options: [
          { value: 'primary', label: 'Primary/Elementary Education (General)' },
          { value: 'english', label: 'English/Literacy' },
          { value: 'math', label: 'Mathematics/Numeracy' },
          { value: 'science', label: 'Science' },
          { value: 'humanities', label: 'Humanities (History, Geography, RE)' },
          { value: 'arts', label: 'Arts & Design (Art, Music, Drama)' },
          { value: 'pe', label: 'Physical Education' },
          { value: 'ict', label: 'ICT/Computer Science' },
          { value: 'vocational', label: 'Vocational Subjects' },
          { value: 'sen', label: 'Special Educational Needs (SEN)' }
        ]
      },
      {
        id: 'aiKnowledge',
        label: 'Current AI Knowledge',
        type: 'select',
        options: [
          { value: 'minimal', label: 'Minimal - Limited exposure to AI concepts' },
          { value: 'basic', label: 'Basic - General awareness of AI applications' },
          { value: 'intermediate', label: 'Intermediate - Some hands-on experience with AI tools' },
          { value: 'advanced', label: 'Advanced - Regular use of AI in work/research' }
        ]
      }
    ],
    questions: buildQuestions(aiTeacherReadinessQuestions, 'ai-readiness'),
    scoring: {
      ranges: [
        {
          min: 10,
          max: 15,
          label: 'AI Education Starter',
          description:
            "You're at the beginning of an exciting journey. Start with the basics to build foundational knowledge.",
          color: '#e74c3c'
        },
        {
          min: 16,
          max: 23,
          label: 'Emerging AI Teacher',
          description:
            "You're building awareness and ready to move from theory to practice with hands-on tasks.",
          color: '#f5a623'
        },
        {
          min: 24,
          max: 29,
          label: 'Developing AI Teacher',
          description: 'You have a solid foundation. Build confidence through consistent, practical application.',
          color: '#f5a623'
        },
        {
          min: 30,
          max: 35,
          label: 'Advanced AI Teacher',
          description: 'You have a strong command of AI in education. Refine your advanced skills and share your expertise.',
          color: '#18ab4b'
        },
        {
          min: 36,
          max: 40,
          label: 'AI Education Pioneer',
          description:
            "You're ready to lead and innovate. Focus on scaling your impact and mentoring others.",
          color: '#18ab4b'
        }
      ]
    },
    analysisPrompt:
      'Based on the assessment results and teacher context, provide a concise, practical, and encouraging personalised action plan across short-term, medium-term, and longer-term horizons. Include specific classroom strategies, professional development moves, and leadership opportunities tied to the scores.'
  },
  [SCIENCE_DEPT_ID]: {
    id: SCIENCE_DEPT_ID,
    name: 'Science Department - AI Integration',
    heroTitle: 'Customisable AI Teacher Assessment',
    heroSubtitle:
      'Select a configuration to begin. Tailor the assessment experience to the needs of your role, subject, or department.',
    cardTitle: 'Choose Your Assessment Experience',
    cardSubtitle:
      'Each configuration provides a focused question set, context capture, and personalised insights based on your goals.',
    welcome: {
      title: 'Science Department AI Integration Assessment',
      description:
        'This assessment concentrates on AI adoption within science education – from data analysis and virtual labs to supporting scientific inquiry. Provide your teaching context to unlock targeted recommendations.'
    },
    contextFields: [
      {
        id: 'science_subject',
        label: 'Science Subject Taught',
        type: 'select',
        options: [
          { value: 'biology', label: 'Biology' },
          { value: 'chemistry', label: 'Chemistry' },
          { value: 'physics', label: 'Physics' },
          { value: 'earth_science', label: 'Earth Science' },
          { value: 'general_science', label: 'General Science' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'lab_experience',
        label: 'Laboratory Teaching Experience',
        type: 'select',
        options: [
          { value: 'no_lab', label: 'No lab experience' },
          { value: 'basic_lab', label: 'Basic lab setup' },
          { value: 'regular_lab', label: 'Regular lab sessions' },
          { value: 'advanced_lab', label: 'Advanced lab work' },
          { value: 'lab_coordinator', label: 'Lab coordinator' }
        ]
      }
    ],
    questions: buildQuestions(
      [
        {
          question: 'How familiar are you with AI-powered data analysis tools for scientific data?',
          options: [
            { text: 'Not familiar at all', score: 1 },
            { text: 'Somewhat familiar', score: 2 },
            { text: 'Moderately familiar', score: 3 },
            { text: 'Very familiar', score: 4 },
            { text: 'Expert level', score: 5 }
          ]
        },
        {
          question: 'How do you currently use technology in science demonstrations?',
          options: [
            { text: 'No technology use', score: 1 },
            { text: 'Basic presentations', score: 2 },
            { text: 'Interactive simulations', score: 3 },
            { text: 'Virtual labs', score: 4 },
            { text: 'AI-enhanced simulations', score: 5 }
          ]
        },
        {
          question: 'How prepared are you to guide students through AI-supported scientific inquiry projects?',
          options: [
            { text: 'Not prepared', score: 1 },
            { text: 'Somewhat prepared', score: 2 },
            { text: 'Moderately prepared', score: 3 },
            { text: 'Well prepared', score: 4 },
            { text: 'Highly prepared – I already do this', score: 5 }
          ]
        },
        {
          question: 'How confident are you in evaluating AI-generated data visualisations or lab reports?',
          options: [
            { text: 'Not confident', score: 1 },
            { text: 'Slightly confident', score: 2 },
            { text: 'Moderately confident', score: 3 },
            { text: 'Confident', score: 4 },
            { text: 'Very confident', score: 5 }
          ]
        }
      ],
      'science'
    ),
    scoring: {
      ranges: [
        {
          min: 4,
          max: 9,
          label: 'Science Tech Beginner',
          description: 'Start with foundational digital tools and simple AI demonstrations to build confidence.',
          color: '#f5a623'
        },
        {
          min: 10,
          max: 15,
          label: 'Science Tech Explorer',
          description: 'You are ready to expand into virtual labs, adaptive simulations, and richer data analysis.',
          color: '#18ab4b'
        },
        {
          min: 16,
          max: 20,
          label: 'Science Tech Innovator',
          description: 'Lead AI-enhanced scientific inquiry and mentor colleagues across your department.',
          color: '#18ab4b'
        }
      ]
    },
    analysisPrompt:
      'Provide science-specific AI integration recommendations focusing on virtual laboratories, AI-enabled data analysis, and supporting student scientific inquiry. Include quick wins, medium-term improvements, and longer-term departmental strategy.'
  },
  [HUMANITIES_DEPT_ID]: {
    id: HUMANITIES_DEPT_ID,
    name: 'Humanities - Digital Literacy',
    heroTitle: 'Customisable AI Teacher Assessment',
    heroSubtitle:
      'Select a configuration to begin. Tailor the assessment experience to the needs of your role, subject, or department.',
    cardTitle: 'Choose Your Assessment Experience',
    cardSubtitle:
      'Each configuration provides a focused question set, context capture, and personalised insights based on your goals.',
    welcome: {
      title: 'Humanities Digital & AI Literacy Assessment',
      description:
        'Explore how digital tools and AI can enrich humanities teaching – from writing support and research skills to creative expression. Use the insights to plan meaningful next steps.'
    },
    contextFields: [
      {
        id: 'humanities_subject',
        label: 'Humanities Subject',
        type: 'select',
        options: [
          { value: 'english', label: 'English' },
          { value: 'history', label: 'History' },
          { value: 'literature', label: 'Literature' },
          { value: 'philosophy', label: 'Philosophy' },
          { value: 'arts', label: 'Arts' },
          { value: 'other', label: 'Other' }
        ]
      }
    ],
    questions: buildQuestions(
      [
        {
          question: 'How do you currently use digital tools for writing and research?',
          options: [
            { text: 'Traditional methods only', score: 1 },
            { text: 'Basic word processing', score: 2 },
            { text: 'Online research tools', score: 3 },
            { text: 'Digital collaboration tools', score: 4 },
            { text: 'AI-enhanced writing tools', score: 5 }
          ]
        },
        {
          question: 'How confident are you supporting students to evaluate AI-generated sources for credibility and bias?',
          options: [
            { text: 'Not confident', score: 1 },
            { text: 'Slightly confident', score: 2 },
            { text: 'Moderately confident', score: 3 },
            { text: 'Confident', score: 4 },
            { text: 'Very confident', score: 5 }
          ]
        },
        {
          question: 'How often do you integrate multimedia or creative AI tools (e.g., storytelling, visual arts) into lessons?',
          options: [
            { text: 'Never', score: 1 },
            { text: 'Rarely', score: 2 },
            { text: 'Sometimes', score: 3 },
            { text: 'Often', score: 4 },
            { text: 'Regularly and strategically', score: 5 }
          ]
        }
      ],
      'humanities'
    ),
    scoring: {
      ranges: [
        {
          min: 3,
          max: 6,
          label: 'Digital Humanities Beginner',
          description: 'Start by integrating simple digital research and writing tools before layering in AI.',
          color: '#f5a623'
        },
        {
          min: 7,
          max: 11,
          label: 'Digital Humanities Explorer',
          description: 'Expand into AI writing support, research synthesis, and collaborative tools.',
          color: '#18ab4b'
        },
        {
          min: 12,
          max: 15,
          label: 'Digital Humanities Innovator',
          description: 'Lead creative AI integration, critical literacy, and showcase best practice across your faculty.',
          color: '#18ab4b'
        }
      ]
    },
    analysisPrompt:
      'Provide humanities-specific digital literacy recommendations focusing on writing support, critical evaluation of AI-generated sources, and creative expression. Include actionable classroom ideas and professional development suggestions.'
  },
  [LEADERSHIP_ID]: {
    id: LEADERSHIP_ID,
    name: 'School Leadership - AI Strategy',
    heroTitle: 'Customisable AI Teacher Assessment',
    heroSubtitle:
      'Select a configuration to begin. Tailor the assessment experience to the needs of your role, subject, or department.',
    cardTitle: 'Choose Your Assessment Experience',
    cardSubtitle:
      'Each configuration provides a focused question set, context capture, and personalised insights based on your goals.',
    welcome: {
      title: 'School Leadership AI Strategy Assessment',
      description:
        'Evaluate your readiness to shape an AI strategy for your school. Explore organisational vision, staff development, policy, and ethical leadership considerations.'
    },
    contextFields: [
      {
        id: 'leadership_role',
        label: 'Leadership Role',
        type: 'select',
        options: [
          { value: 'department_head', label: 'Department Head' },
          { value: 'assistant_principal', label: 'Assistant Principal' },
          { value: 'principal', label: 'Principal' },
          { value: 'curriculum_coordinator', label: 'Curriculum Coordinator' },
          { value: 'technology_director', label: 'Technology Director' },
          { value: 'other', label: 'Other' }
        ]
      }
    ],
    questions: buildQuestions(
      [
        {
          question: "How would you rate your understanding of AI's impact on education?",
          options: [
            { text: 'Limited understanding', score: 1 },
            { text: 'Basic awareness', score: 2 },
            { text: 'Moderate understanding', score: 3 },
            { text: 'Good understanding', score: 4 },
            { text: 'Expert understanding', score: 5 }
          ]
        },
        {
          question: 'How prepared is your organisation to support staff in developing AI literacy?',
          options: [
            { text: 'Not prepared', score: 1 },
            { text: 'Slightly prepared', score: 2 },
            { text: 'Moderately prepared', score: 3 },
            { text: 'Well prepared', score: 4 },
            { text: 'Strategically prepared with plans in motion', score: 5 }
          ]
        },
        {
          question: 'How mature are your current policies/guidelines around ethical AI use in the school?',
          options: [
            { text: 'No policies yet', score: 1 },
            { text: 'Initial discussions started', score: 2 },
            { text: 'Draft policies emerging', score: 3 },
            { text: 'Policies in place and being refined', score: 4 },
            { text: 'Policies embedded and regularly reviewed', score: 5 }
          ]
        },
        {
          question: 'To what extent do you have a long-term roadmap for AI integration aligned with school improvement plans?',
          options: [
            { text: 'No roadmap', score: 1 },
            { text: 'Initial ideas only', score: 2 },
            { text: 'Developing roadmap', score: 3 },
            { text: 'Defined roadmap with milestones', score: 4 },
            { text: 'Roadmap implemented and monitored', score: 5 }
          ]
        }
      ],
      'leadership'
    ),
    scoring: {
      ranges: [
        {
          min: 4,
          max: 9,
          label: 'AI Strategy Beginner',
          description: 'Build AI awareness, stakeholder alignment, and initial governance foundations.',
          color: '#f5a623'
        },
        {
          min: 10,
          max: 15,
          label: 'AI Strategy Developer',
          description: 'Formalise strategy, investment, staff development, and ethical guidelines.',
          color: '#18ab4b'
        },
        {
          min: 16,
          max: 20,
          label: 'AI Strategy Leader',
          description: 'Scale impact, monitor implementation, and champion sector-wide innovation.',
          color: '#18ab4b'
        }
      ]
    },
    analysisPrompt:
      'Provide leadership-focused recommendations for AI strategy development, staff enablement, governance, and ethical implementation. Highlight immediate priorities, medium-term plans, and long-term strategic moves.'
  }
};

export const ASSESSMENT_CONFIGS = assessmentConfigs;
export const DEFAULT_CONFIG_ID = AI_TEACHER_READINESS_ID;

export const getAssessmentConfig = (id) =>
  assessmentConfigs[id] ?? assessmentConfigs[DEFAULT_CONFIG_ID];

export const getAllAssessmentConfigs = () => Object.values(assessmentConfigs);

export default assessmentConfigs;
