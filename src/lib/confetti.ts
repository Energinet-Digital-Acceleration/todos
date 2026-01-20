import confetti from 'canvas-confetti'

/**
 * Fires confetti from a given element or mouse event position
 * @param target - HTMLElement or MouseEvent to fire confetti from
 */
export function fireConfetti(target: HTMLElement | MouseEvent): void {
  if (!target) return

  let x: number
  let y: number

  if (target instanceof MouseEvent) {
    // Use event coordinates
    x = target.clientX / window.innerWidth
    y = target.clientY / window.innerHeight
  } else {
    // Use element center coordinates
    const rect = target.getBoundingClientRect()
    x = (rect.left + rect.width / 2) / window.innerWidth
    y = (rect.top + rect.height / 2) / window.innerHeight
  }

  // Festive confetti configuration
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x, y },
    colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
    ticks: 200,
    gravity: 1.2,
    scalar: 1.2,
  })
}
