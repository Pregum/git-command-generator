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
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'first commit' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: 'second commit' } },
]

const initialEdges = [{ id: 'e1-2', source: 'f1', target: 'f2' }]

let nodeId = initialNodes.length

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
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        {/* <Button zIndex={4} onClick={onClick} m={50} bg={'teal.300'}>
          add node
        </Button> */}
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  )
}
