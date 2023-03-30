import { CSSProperties } from 'react'
import { Node } from 'reactflow'

export function setStyle(reactFlowNode: Node, style: CSSProperties): Node {
  reactFlowNode.style = {
    ...reactFlowNode.style,
    ...style,
  }

  return reactFlowNode
}
