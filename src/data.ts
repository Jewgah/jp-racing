// Local best-lap leaderboard. The upstream game used a hosted Supabase table with
// OAuth sign-in; this fork keeps every lap in the browser so it works offline,
// needs no account and ships no keys.

export interface SavedScore {
  id: string
  name: string
  time: number
  date: number
}

const SCORES_KEY = 'jp-racing:scores'
const NAME_KEY = 'jp-racing:driver'
const MAX_SCORES = 50
// Laps faster than this are physically impossible on this track (upstream used the same floor).
export const MIN_VALID_TIME = 1337

const isScore = (v: unknown): v is SavedScore => {
  if (!v || typeof v !== 'object') return false
  const s = v as Record<string, unknown>
  return typeof s.id === 'string' && typeof s.name === 'string' && typeof s.time === 'number' && Number.isFinite(s.time) && typeof s.date === 'number'
}

const read = (): SavedScore[] => {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(SCORES_KEY) || '[]')
    return Array.isArray(parsed) ? parsed.filter(isScore) : []
  } catch {
    return []
  }
}

const write = (scores: SavedScore[]) => {
  try {
    localStorage.setItem(SCORES_KEY, JSON.stringify(scores))
  } catch {
    // Private mode or quota exceeded: the lap still shows on screen, it just is not kept.
  }
}

const sortScores = (scores: SavedScore[]) => [...scores].sort((a, b) => a.time - b.time)

export const getScores = (limit = MAX_SCORES): SavedScore[] =>
  sortScores(read())
    .filter((s) => s.time > MIN_VALID_TIME)
    .slice(0, limit)

export const getBestTime = (): number | null => getScores(1)[0]?.time ?? null

/** Saves a lap and returns it together with its 1-based rank, or rank 0 if it fell off the board. */
export const insertScore = (name: string, time: number): { score: SavedScore; rank: number } => {
  const score: SavedScore = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    name: sanitizeName(name),
    time,
    date: Date.now(),
  }
  const scores = sortScores([...read(), score]).slice(0, MAX_SCORES)
  write(scores)
  const rank = getScores().findIndex((s) => s.id === score.id) + 1
  return { score, rank }
}

export const sanitizeName = (name: string): string => name.replace(/\s+/g, ' ').trim().slice(0, 16) || 'Driver'

export const getDriverName = (): string => {
  try {
    return localStorage.getItem(NAME_KEY) || ''
  } catch {
    return ''
  }
}

export const setDriverName = (name: string) => {
  try {
    localStorage.setItem(NAME_KEY, sanitizeName(name))
  } catch {
    // ignore, see write()
  }
}
