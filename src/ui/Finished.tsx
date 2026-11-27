import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { getDriverName, getScores, insertScore, MIN_VALID_TIME, setDriverName } from '../data'
import { readableTime, Scores } from './LeaderBoard'
import type { SavedScore } from '../data'

export const Finished = () => {
  const [reset, time] = useStore(({ actions: { reset }, finished }) => [reset, finished])
  const [name, setName] = useState(getDriverName)
  const [saved, setSaved] = useState<{ id: string; rank: number } | null>(null)
  const [scores, setScores] = useState<SavedScore[]>(() => getScores(10))
  const previousBest = scores[0]?.time

  useEffect(() => {
    setSaved(null)
    setScores(getScores(10))
  }, [time])

  const save = () => {
    if (saved) return
    setDriverName(name)
    const { score, rank } = insertScore(name, time)
    setSaved({ id: score.id, rank })
    setScores(getScores(10))
  }

  const isRecord = time > MIN_VALID_TIME && (previousBest === undefined || time < previousBest)

  return (
    <div className="finished">
      <div className="finished-panel glass hud-corners">
        <p className="eyebrow">Lap complete</p>
        <h1 className="finished-time">
          {readableTime(time)}
          <small>s</small>
        </h1>
        {!saved && isRecord && <p className="finished-record">New best on this device</p>}
        {saved ? (
          <p className="finished-rank">{saved.rank ? `Saved. You are #${saved.rank} on this device.` : 'Saved.'}</p>
        ) : (
          <form
            className="finished-form"
            onSubmit={(e) => {
              e.preventDefault()
              save()
            }}
          >
            <input className="driver-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Driver name" maxLength={16} aria-label="Driver name" />
            <button type="submit" className="btn btn-primary">
              Save lap
            </button>
          </form>
        )}
        {scores.length > 0 && <Scores className="finished-scores" scores={scores} highlightId={saved?.id} />}
        <button className="btn btn-ghost" onClick={reset}>
          Race again
        </button>
      </div>
    </div>
  )
}
