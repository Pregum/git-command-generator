import { atom, PrimitiveAtom } from 'jotai'
import {
  BRANCH_WIDTH,
  BRANCH_Y,
  initialBranches,
  initialNodes,
  NODE_WIDTH,
  SEPARATE_UNIT_X,
  SEPARATE_UNIT_Y,
} from '../const/constants'
import { Branch } from '../types/branch'
import { Node } from 'reactflow'

export const nodeWidthAtom = atom((_) => NODE_WIDTH)
export const branchYAtom = atom((_) => BRANCH_Y)
export const branchWidthAtom = atom((_) => BRANCH_WIDTH)
export const branchUnitLeftMarginAtom = atom(
  (get) => (get(nodeWidthAtom) - get(branchWidthAtom)) / 2
)
export const separateUnitXAtom = atom((_) => SEPARATE_UNIT_X)
export const separateUnitYAtom = atom(() => SEPARATE_UNIT_Y)
export const nodeIdAtom = atom(0)

export const defaultYAtom = atom(() => 100)
export const defaultXAtom = atom(() => 0)

export const branchesAtom: PrimitiveAtom<Branch[]> = atom(initialBranches)
export const currentBranchAtom: PrimitiveAtom<Branch> = atom(initialBranches[0])
export const latestNodeAtom: PrimitiveAtom<Node> = atom(
  initialNodes[initialNodes.length - 1]
)
