import { atom } from 'jotai'

export const nodeWidthAtom = atom((_) => 150)
export const branchYAtom = atom((_) => -100)
export const branchWidthAtom = atom((_) => 60)
export const branchUnitLeftMarginAtom = atom(
  (get) => (get(nodeWidthAtom) - get(branchWidthAtom)) / 2
)
export const separateUnitXAtom = atom((_) => 25)
export const nodeIdAtom = atom(0)

export const defaultYAtom = atom(() => 100)
export const defaultXAtom = atom(() => 0)
