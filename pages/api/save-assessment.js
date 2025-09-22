import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      // Assessment data (anonymous)
      profileResponses, // Array of profile questions/answers
      assessmentResponses, // Array of 20 questions with full details
      resultPercentage
    } = req.body

    // Validate required fields
    if (!assessmentResponses || resultPercentage === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields: assessmentResponses and resultPercentage' 
      })
    }

    // Prepare single record with all data
    const assessmentRecord = {
      result_percentage: resultPercentage,
      created_at: new Date().toISOString()
    }

    // Add profile responses to main record
    if (profileResponses && profileResponses.length > 0) {
      profileResponses.forEach(response => {
        const fieldName = response.questionType
        assessmentRecord[fieldName] = response.selectedValue
        assessmentRecord[`${fieldName}_label`] = response.selectedLabel
      })
    }

    // Add assessment responses (Q1-Q20) to main record
    if (assessmentResponses && assessmentResponses.length > 0) {
      assessmentResponses.forEach((response, index) => {
        const qNum = index + 1
        assessmentRecord[`q${qNum}_value`] = response.selectedValue
        assessmentRecord[`q${qNum}_label`] = response.selectedLabel
      })
    }

    // Insert single record into Supabase
    const { data, error } = await supabase
      .from('assessments')
      .insert([assessmentRecord])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: 'Failed to save assessment data' })
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Assessment saved successfully',
      assessmentId: data[0].id 
    })

  } catch (error) {
    console.error('Save assessment error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}