import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Log environment variables (without exposing keys)
    console.log('Supabase URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    const {
      position,
      experience,
      subject,
      aiKnowledge,
      answers,
      resultPercentage
    } = req.body

    // Log the incoming data
    console.log('Received data:', { position, experience, subject, aiKnowledge, answersLength: answers?.length, resultPercentage })

    // Validate required fields
    if (!answers || resultPercentage === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields: answers and resultPercentage' 
      })
    }

    // Test Supabase connection first
    console.log('Testing Supabase connection...')
    
    // Insert into Supabase
    const { data, error } = await supabase
      .from('assessments')
      .insert([
        {
          position,
          experience,
          subject,
          ai_knowledge: aiKnowledge,
          answers,
          result_percentage: resultPercentage,
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ 
        error: 'Failed to save assessment data', 
        details: error.message,
        code: error.code,
        hint: error.hint
      })
    }

    console.log('Successfully saved to Supabase:', data[0]?.id)
    
    return res.status(200).json({ 
      success: true, 
      message: 'Assessment saved successfully',
      id: data[0].id 
    })

  } catch (error) {
    console.error('Save assessment error:', error)
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message,
      stack: error.stack
    })
  }
}