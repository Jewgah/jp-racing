export function Credit({ compact = false }: { compact?: boolean }) {
  return (
    <p className={`credit${compact ? ' compact' : ''}`}>
      <a href="https://jordanperez.dev">Jordan Perez</a>
      <span aria-hidden="true"> / </span>
      adapted from <a href="https://github.com/pmndrs/racing-game">pmndrs/racing-game</a> (MIT)
    </p>
  )
}
