import { useEffect, useState } from 'react'

import type { HTMLAttributes } from 'react'

import { getScores } from '../data'
import { useStore } from '../store'

import type { SavedScore } from '../data'

export function LeaderBoard() {
  const [scores, setScores] = useState<SavedScore[]>([])
  const [leaderboard, set] = useStore((state) => [state.leaderboard, state.set])
  const close = () => set({ leaderboard: false })

  useEffect(() => {
    if (leaderboard) setScores(getScores(10))
  }, [leaderboard])

  return (
    <div className={`leaderboard popup ${leaderboard ? 'open' : ''}`}>
      <button className="popup-close" onClick={close} aria-label="Close leaderboard">
        L
      </button>
      <div className="popup-content">
        <h2 className="panel-title">Best laps</h2>
        <p className="panel-sub">Stored on this device</p>
        {scores.length ? <Scores className="leaderboard-list" scores={scores} /> : <p className="panel-empty">No laps yet. Cross the finish line to set one.</p>}
      </div>
    </div>
  )
}

const standingToImage: Record<1 | 2 | 3, string> = {
  1: 'images/gold.png',
  2: 'images/silver.png',
  3: 'images/bronze.png',
}

export const readableTime = (time: number): string => (time / 1000).toFixed(2)

interface ScoresProps extends HTMLAttributes<HTMLOListElement> {
  scores: SavedScore[]
  highlightId?: string
}

export const Scores = ({ scores, highlightId, className = '', ...props }: ScoresProps) => (
  <ol className={`scores ${className}`} {...props}>
    {scores.map(({ id, name, time }, index) => {
      const standing = index + 1
      return (
        <li className={`score-row${id === highlightId ? ' is-new' : ''}`} key={id}>
          <span className="score-rank">
            {standing === 1 || standing === 2 || standing === 3 ? <img src={standingToImage[standing]} width={13} height={13} alt={`#${standing}`} /> : standing}
          </span>
          <span className="score-name">{name}</span>
          <span className="score-time">{readableTime(time)}s</span>
        </li>
      )
    })}
  </ol>
)
