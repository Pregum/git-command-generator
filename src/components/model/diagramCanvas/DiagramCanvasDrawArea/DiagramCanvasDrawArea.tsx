export type Props = React.PropsWithChildren<{}>
import React, { useCallback } from 'react'
import ReactFlow, {
  addEdge,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
} from 'reactflow'

import 'reactflow/dist/style.css'

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
]

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }]

export const DiagramCanvasDrawArea: React.FC<Props> = ({ children }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  return (
    <ReactFlow
      nodes={initialNodes}
      edges={initialEdges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
    >
      <Controls />
      <MiniMap />
    </ReactFlow>
  )
}
