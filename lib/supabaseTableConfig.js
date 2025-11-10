export const SUPABASE_TABLE_CONFIG = {
  'ai-teacher-readiness': {
    table: 'ai_teacher_readiness_assessments',
    contextColumns: {
      position: 'position',
      experience: 'experience',
      subject: 'subject',
      aiKnowledge: 'ai_knowledge'
    }
  },
  'science-dept': {
    table: 'science_dept_assessments',
    contextColumns: {
      science_subject: 'science_subject',
      lab_experience: 'lab_experience'
    }
  },
  'humanities-dept': {
    table: 'humanities_dept_assessments',
    contextColumns: {
      humanities_subject: 'humanities_subject'
    }
  },
  leadership: {
    table: 'leadership_assessments',
    contextColumns: {
      leadership_role: 'leadership_role'
    }
  }
};

export const getSupabaseTableConfig = (configId) => SUPABASE_TABLE_CONFIG[configId];

export const SUPABASE_TABLES = Object.values(SUPABASE_TABLE_CONFIG).map((entry) => entry.table);
