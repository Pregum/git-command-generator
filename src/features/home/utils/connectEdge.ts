import { Edge, ReactFlowInstance, Node } from 'reactflow'
import { Revision } from '../types/revision'
import { RevisionNode } from '../types/revisionNode'

export default function connectEdge(
  fromNode: RevisionNode,
  toNode: Node,
  onSuccess?: (edge: Edge) => void,
  onFailed?: () => void
) {
  const edge: Edge = {
    id: `e${fromNode.id}-${toNode.id}`,
    source: fromNode.id,
    target: toNode.id,
  }

  if (onSuccess) {
    onSuccess(edge)
  }
}
