import { supabase } from '../../lib/supabase'
import { DEFAULT_CONFIG_ID } from '../../lib/assessmentConfigs'
import { SUPABASE_TABLE_CONFIG, SUPABASE_TABLES } from '../../lib/supabaseTableConfig'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('Testing Supabase connection and table...')

    // Test 1: Ensure we can query each configured table
    for (const table of SUPABASE_TABLES) {
      const { error: tableError } = await supabase.from(table).select('count').limit(1)

      if (tableError) {
        console.error(`Supabase table query error for ${table}:`, tableError)
        return res.status(500).json({
          error: 'Database connection or table issue',
          details: tableError.message,
          code: tableError.code,
          hint: tableError.hint,
          table
        })
      }
    }

    // Test 2: Insert a lightweight record into the default config table
    const defaultTable = SUPABASE_TABLE_CONFIG[DEFAULT_CONFIG_ID]?.table

    if (!defaultTable) {
      return res.status(500).json({
        error: 'Default table configuration missing',
        configId: DEFAULT_CONFIG_ID
      })
    }

    const testRecord = {
      config_id: DEFAULT_CONFIG_ID,
      context: {},
      answers: [],
      numeric_scores: [],
      detailed_answers: [],
      result_percentage: 0,
      total_score: 0,
      max_possible_score: 0,
      interpretation_label: 'test',
      interpretation_description: 'test',
      created_at: new Date().toISOString()
    }

    const { data: insertData, error: insertError } = await supabase
      .from(defaultTable)
      .insert([testRecord])
      .select()

    if (insertError) {
      console.error('Insert test failed:', insertError)
      return res.status(500).json({
        error: 'Insert test failed',
        details: insertError.message,
        code: insertError.code,
        hint: insertError.hint,
        table: defaultTable
      })
    }

    if (insertData && insertData[0]?.id) {
      await supabase.from(defaultTable).delete().eq('id', insertData[0].id)
    }

    return res.status(200).json({
      success: true,
      message: 'Supabase connection and schema verified',
      tablesChecked: SUPABASE_TABLES,
      testTable: defaultTable
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