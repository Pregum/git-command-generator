import { Edge, ReactFlowInstance, Node } from 'reactflow'
import { Revision } from '../types/revision'

export default function connectEdge(
  fromNode: Node<Revision>,
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
