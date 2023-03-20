export type Props = React.PropsWithChildren<{
  reactFlowInstance: ReactFlowInstance
  nodes: Node[]
  edges: Edge[]
  onConnect: (params: any) => void
  onEdgesChange: OnEdgesChange
  onNodesChange: OnNodesChange
}>
import React from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlowInstance,
  Node,
  Edge,
  OnEdgesChange,
  OnNodesChange,
} from 'reactflow'

import 'reactflow/dist/style.css'

export const DiagramCanvasDrawArea: React.FC<Props> = ({
  nodes,
  edges,
  onConnect,
  onEdgesChange,
  onNodesChange,
}) => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  )
}
