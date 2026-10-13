// Opt-in counter for the reproducible benchmark; dormant in normal use.
export function recordCardRender() {
  const target = globalThis as typeof globalThis & { __cardRenderCount?: number }
  if (target.__cardRenderCount !== undefined) target.__cardRenderCount++
}
