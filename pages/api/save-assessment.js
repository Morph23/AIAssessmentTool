import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      // Index page data
      name,
      role,
      organization,
      orgSize,
      aiKnowledge,
      // Assessment data
      answers,
      resultPercentage
    } = req.body

    // Validate required fields
    if (!name || !answers || resultPercentage === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, answers, and resultPercentage' 
      })
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('assessments')
      .insert([
        {
          name: name,
          role: role || null,
          organization: organization || null,
          org_size: orgSize || null,
          ai_knowledge: aiKnowledge || null,
          answers: answers, // JSON array of 20 responses
          result_percentage: resultPercentage,
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: 'Failed to save assessment data' })
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Assessment saved successfully',
      id: data[0].id 
    })

  } catch (error) {
    console.error('Save assessment error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}