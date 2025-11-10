import { supabase } from '../../lib/supabase'
import { SUPABASE_TABLES } from '../../lib/supabaseTableConfig'

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

    const tableResults = []

    for (const table of SUPABASE_TABLES) {
      console.log(`Attempting to query Supabase table: ${table}`)

      const { error } = await supabase
        .from(table)
        .select('count')
        .limit(1)

      if (error) {
        console.error(`Supabase query error for ${table}:`, error)
        return res.status(500).json({ 
          error: 'Database connection failed',
          details: error.message,
          code: error.code,
          hint: error.hint,
          table,
          test: 'query_test'
        })
      }

      tableResults.push(table)
    }

    return res.status(200).json({ 
      success: true,
      message: 'Supabase connection successful',
      tablesChecked: tableResults,
      test: 'all_tests_passed'
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