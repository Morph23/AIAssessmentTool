import { supabase } from '../../lib/supabase'
import { DEFAULT_CONFIG_ID } from '../../lib/assessmentConfigs'
import { getSupabaseTableConfig } from '../../lib/supabaseTableConfig'

const normaliseNumber = (value) => {
  if (value === null || value === undefined) {
    return null
  }
  const numericValue = Number(value)
  return Number.isFinite(numericValue) ? numericValue : null
}

const normaliseText = (value) => {
  if (value === undefined || value === null) {
    return null
  }
  const trimmed = typeof value === 'string' ? value.trim() : value
  return trimmed === '' ? null : trimmed
}

const asArray = (value) => (Array.isArray(value) ? value : [])

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('Supabase URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    const {
      configId,
      context,
      answers,
      numericScores,
      detailedAnswers,
      totalScore,
      maxPossibleScore,
      resultPercentage,
      interpretationLabel,
      interpretationDescription
    } = req.body

    const resolvedConfigId = configId || DEFAULT_CONFIG_ID
    const tableConfig = getSupabaseTableConfig(resolvedConfigId)

    if (!tableConfig) {
      return res.status(400).json({
        error: `Unsupported assessment configuration: ${resolvedConfigId}`
      })
    }

    // Basic validation
    if (resultPercentage === undefined) {
      return res.status(400).json({
        error: 'Missing required field: resultPercentage'
      })
    }

    const contextPayload = context && typeof context === 'object' ? context : {}

    const row = {
      config_id: resolvedConfigId,
      context: contextPayload,
      answers: asArray(answers),
      numeric_scores: asArray(numericScores),
      detailed_answers: asArray(detailedAnswers),
      total_score: normaliseNumber(totalScore),
      max_possible_score: normaliseNumber(maxPossibleScore),
      result_percentage: normaliseNumber(resultPercentage),
      interpretation_label: normaliseText(interpretationLabel),
      interpretation_description: normaliseText(interpretationDescription),
      created_at: new Date().toISOString()
    }

    Object.entries(tableConfig.contextColumns || {}).forEach(([contextKey, columnName]) => {
      row[columnName] = normaliseText(contextPayload[contextKey])
    })

    console.log('Saving assessment to Supabase', {
      table: tableConfig.table,
      configId: resolvedConfigId,
      answersCount: row.answers.length,
      numericScoresCount: row.numeric_scores.length
    })

    const { data, error } = await supabase.from(tableConfig.table).insert([row]).select()

    if (error) {
      console.error('Supabase insert error:', error)
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
      id: data[0]?.id || null,
      table: tableConfig.table
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