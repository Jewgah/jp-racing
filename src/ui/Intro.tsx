import { Suspense, useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'

import type { ReactNode } from 'react'

import { useStore } from '../store'
import { getBestTime } from '../data'
import { readableTime } from './LeaderBoard'
import { Keys } from './Keys'
import { Credit } from './Credit'

export function Intro({ children }: { children: ReactNode }) {
  const [clicked, setClicked] = useState(false)
  const [loading, setLoading] = useState(true)
  const { progress } = useProgress()
  const set = useStore((state) => state.set)
  const [best] = useState(getBestTime)

  useEffect(() => {
    if (clicked && !loading) set({ ready: true })
  }, [clicked, loading])

  useEffect(() => {
    if (progress === 100) setLoading(false)
  }, [progress])

  return (
    <>
      <Suspense fallback={null}>{children}</Suspense>
      <div className={`fullscreen bg ${loading ? 'loading' : 'loaded'} ${clicked ? 'clicked' : ''}`}>
        <div className="intro">
          <div className="intro-brand">
            <p className="eyebrow">
              <span className="dot" /> A React Three Fiber driving showcase
            </p>
            <h1 className="intro-title">
              JP <span>Racing</span>
            </h1>
            <p className="intro-sub">
              By <a href="https://jordanperez.dev">Jordan Perez</a>. Rebuilt on React 19, R3F 9 and three r187.
            </p>
            {best !== null && <p className="intro-best">Your best lap: {readableTime(best)}s</p>}
            <button className="btn btn-primary start-link" disabled={loading} onClick={() => setClicked(true)}>
              {loading ? `Loading ${progress.toFixed()}%` : 'Start engine'}
            </button>
          </div>
          <div className="intro-keys glass hud-corners">
            <p className="panel-title">Controls</p>
            <Keys />
          </div>
        </div>
        <Credit />
      </div>
    </>
  )
}
