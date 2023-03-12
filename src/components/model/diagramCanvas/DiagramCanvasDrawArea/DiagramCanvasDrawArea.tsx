export type Props = React.PropsWithChildren<{}>
import { Button } from '@chakra-ui/react'
import React, { useCallback } from 'react'
import ReactFlow, {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from 'reactflow'

import 'reactflow/dist/style.css'

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
]

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }]

let nodeId = 0

export const DiagramCanvasDrawArea: React.FC<Props> = ({ children }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const reactFlowInstance = useReactFlow()

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onClick = useCallback(() => {
    const id = `${++nodeId}`
    const newNode = {
      id,
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
      data: {
        label: `Node ${id}`,
      },
    }
    reactFlowInstance.addNodes(newNode)
  }, [reactFlowInstance])

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Button onClick={onClick} m={50} bg={'teal.300'}>
        add node
      </Button>
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
