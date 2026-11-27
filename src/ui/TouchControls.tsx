import { useEffect, useState } from 'react'
import { useStore } from '../store'
import type { Controls } from '../store'

type Control = keyof Controls

// On phones and tablets the game was unplayable: every input was keyboard only.
// These pads drive the same control actions as the keyboard bindings.
const isTouchDevice = () => typeof window !== 'undefined' && (window.matchMedia?.('(pointer: coarse)').matches || 'ontouchstart' in window)

function Pad({ control, label, className = '' }: { control: Control; label: string; className?: string }) {
  const action = useStore((state) => state.actions[control])
  const [active, setActive] = useState(false)
  const press = (value: boolean) => {
    setActive(value)
    action(value)
  }
  return (
    <button
      className={`touch-pad ${className}${active ? ' active' : ''}`}
      aria-label={label}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        press(true)
      }}
      onPointerUp={() => press(false)}
      onPointerCancel={() => press(false)}
      onContextMenu={(e) => e.preventDefault()}
    >
      {label}
    </button>
  )
}

export function TouchControls() {
  const [enabled] = useState(isTouchDevice)
  const [ready, reset, camera] = useStore((state) => [state.ready, state.actions.reset, state.actions.camera])

  useEffect(() => {
    if (!enabled) return
    document.body.classList.add('is-touch')
    return () => document.body.classList.remove('is-touch')
  }, [enabled])

  if (!enabled || !ready) return null

  return (
    <div className="touch-controls">
      <div className="touch-cluster">
        <Pad control="left" label="Left" />
        <Pad control="right" label="Right" />
      </div>
      <div className="touch-utility">
        <button className="touch-small" onClick={reset}>
          Reset
        </button>
        <button className="touch-small" onClick={camera}>
          Cam
        </button>
      </div>
      <div className="touch-cluster">
        <Pad control="boost" label="Boost" className="small" />
        <Pad control="brake" label="Drift" className="small" />
        <Pad control="backward" label="Rev" />
        <Pad control="forward" label="Gas" className="primary" />
      </div>
    </div>
  )
}
