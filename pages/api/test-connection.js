import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('Testing Supabase connection...')
    
    // Test 1: Check if client exists
    if (!supabase) {
      return res.status(500).json({ 
        error: 'Supabase client not initialized',
        test: 'client_check'
      })
    }

    // Test 2: Try to list tables (should work even if tables don't exist)
    console.log('Attempting to query Supabase...')
    const { data, error } = await supabase
      .from('assessments')
      .select('count')
      .limit(1)

    if (error) {
      console.error('Supabase query error:', error)
      return res.status(500).json({ 
        error: 'Database connection failed',
        details: error.message,
        code: error.code,
        hint: error.hint,
        test: 'query_test'
      })
    }

    return res.status(200).json({ 
      success: true,
      message: 'Supabase connection successful',
      test: 'all_tests_passed',
      data: data
    })

  } catch (error) {
    console.error('Connection test error:', error)
    return res.status(500).json({ 
      error: 'Connection test failed',
      details: error.message,
      stack: error.stack,
      test: 'catch_block'
    })
  }
}