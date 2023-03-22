import { Edge, Node } from 'reactflow'
import { BranchNode } from '../types/branchNode'
import createBranchNode from '../utils/createBranchNode'
import { Branch } from '../types/branch'
import createNode from '../utils/createNode'
import { Revision } from '../types/revision'

export const NODE_WIDTH = 150
export const NODE_HEIGHT = 75
export const BRANCH_Y = -100
export const BRANCH_WIDTH = 60
export const BRANCH_UNIT_LEFT_MARGIN = (NODE_WIDTH - BRANCH_WIDTH) / 2
export const SEPARATE_UNIT_X = 25
export const SEPARATE_UNIT_Y = 150
export const MAIN_BRANCH_ID = 'main'

export const initialNodes: Node<Revision>[] = [
  createBranchNode(
    MAIN_BRANCH_ID,
    { x: BRANCH_UNIT_LEFT_MARGIN, y: BRANCH_Y },
    'main'
  ),
  createNode({
    id: 'i1',
    x: 0,
    y: 0,
    label: 'first commit',
    branchId: MAIN_BRANCH_ID,
    parentId: '',
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
  }),
  createNode({
    id: 'i2',
    x: 0,
    y: SEPARATE_UNIT_Y,
    label: 'second commit',
    branchId: MAIN_BRANCH_ID,
    parentId: 'i1',
    width: NODE_WIDTH,
    style: {
      backgroundColor: 'aqua',
    },
  }),
]

export const initialBranches: Branch[] = [
  {
    branchName: 'main',
    no: 1,
    rootNodeId: initialNodes[initialNodes.length - 1].id,
    currentNodeId: initialNodes[initialNodes.length - 1].id,
    latestNodeId: initialNodes[initialNodes.length - 1].id,
  },
]

export const initialEdges: Edge[] = [
  { id: 'emain-1', source: MAIN_BRANCH_ID, target: 'i1' },
  { id: 'e1-2', source: 'i1', target: 'i2' },
]
