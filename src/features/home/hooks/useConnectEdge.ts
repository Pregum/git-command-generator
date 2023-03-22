import { Edge, useReactFlow } from 'reactflow'
import utilConnectEdge from '../utils/connectEdge'
import { useToast } from '@chakra-ui/react'
import { RevisionNode } from '../types/revisionNode'

export default function useConnectEdge() {
  const toast = useToast()
  const reactFlowInstance = useReactFlow()

  const connectEdge = (fromNode: RevisionNode, toNode: RevisionNode) => {
    utilConnectEdge(
      fromNode,
      toNode,
      (edge: Edge) => {
        reactFlowInstance.addEdges(edge)
        toast({
          title: 'エッジを追加しました。',
          description: `edge id: ${edge.id}`,
          status: 'info',
          duration: 3000,
          isClosable: true,
        })
      },
      () => {
        toast({
          title: 'エッジ追加に失敗しました。',
          status: 'error',
          isClosable: true,
        })
      }
    )
  }

  return { connectEdge }
}
