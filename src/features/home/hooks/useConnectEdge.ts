import { useAtom } from 'jotai'
import { Revision } from '../types/revision'
import { Edge, Node, useReactFlow } from 'reactflow'
import utilConnectEdge from '../utils/connectEdge'
import { useToast } from '@chakra-ui/react'

export default function useConnectEdge() {
  const toast = useToast()
  const reactFlowInstance = useReactFlow()

  const connectEdge = (fromNode: Node<Revision>, toNode: Node<Revision>) => {
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
