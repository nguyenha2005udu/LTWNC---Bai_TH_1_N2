import { create } from 'zustand'
interface PinState {
  pinnedIds: string[]
  togglePin: (id: string) => void
  isPinned: (id: string) => boolean
}
export const usePinStore = create<PinState>((set, get) => ({
  pinnedIds: [],
  togglePin: (id) => set(({ pinnedIds }) => ({ pinnedIds: pinnedIds.includes(id) ? pinnedIds.filter(value => value !== id) : [...pinnedIds, id] })),
  isPinned: (id) => get().pinnedIds.includes(id),
}))
