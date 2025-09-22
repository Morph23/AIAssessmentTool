import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('Testing Supabase connection and table...')

    // Test 1: Check if we can connect to Supabase
    const { data: testData, error: testError } = await supabase
      .from('assessments')
      .select('count')
      .limit(1)

    if (testError) {
      console.error('Supabase connection/table error:', testError)
      return res.status(500).json({
        error: 'Database connection or table issue',
        details: testError.message,
        code: testError.code,
        hint: testError.hint,
        suggestion: 'Make sure you have created the assessments table in Supabase using the SQL from SUPABASE_SETUP.md'
      })
    }

    // Test 2: Try to insert a test record
    const testRecord = {
      position: 'test',
      experience: 'test',
      subject: 'test',
      ai_knowledge: 'test',
      answers: [1, 2, 3],
      result_percentage: 50,
      created_at: new Date().toISOString()
    }

    const { data: insertData, error: insertError } = await supabase
      .from('assessments')
      .insert([testRecord])
      .select()

    if (insertError) {
      console.error('Insert test failed:', insertError)
      return res.status(500).json({
        error: 'Insert test failed',
        details: insertError.message,
        code: insertError.code,
        hint: insertError.hint
      })
    }

    // Clean up test record
    if (insertData && insertData[0]?.id) {
      await supabase
        .from('assessments')
        .delete()
        .eq('id', insertData[0].id)
    }

    return res.status(200).json({
      success: true,
      message: 'Supabase connection and table working correctly',
      test_record_id: insertData[0]?.id
    })

  } catch (error) {
    console.error('Test endpoint error:', error)
    return res.status(500).json({
      error: 'Unexpected error during testing',
      details: error.message,
      stack: error.stack
    })
  }
}