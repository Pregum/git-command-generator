import { Position } from 'reactflow'
import { RevisionNode } from '../types/revisionNode'
import sha1 from './sha1'

export default function createBranchNode(
  id: string,
  position: { x: number; y: number },
  label: string,
  hash?: string
): RevisionNode {
  const hashStr = hash ? hash : sha1()
  const node = {
    id,
    position,
    data: {
      label,
      hash: hashStr,
      parentId: '',
      parentHash: '',
    },
    style: {
      borderRadius: '50%',
      width: '60px',
      height: '60px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 700,
    },
    sourcePosition: undefined,
    targetPosition: Position.Bottom,
  }
  return node
}
