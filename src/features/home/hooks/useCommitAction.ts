import { useToast } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { Dispatch, SetStateAction } from 'react'
import { useReactFlow, Node } from 'reactflow'
import {
  defaultXAtom,
  defaultYAtom,
  nodeIdAtom,
  separateUnitXAtom,
  separateUnitYAtom,
} from '../stores/atom'
import { Branch } from '../types/branch'
import { RevisionNode } from '../types/revisionNode'
import useConnectEdge from './useConnectEdge'
import useMyNode from './useMyNode'

export type GitCommandActionProps = {
  latestNode: Node
  currentBranch: Branch
  setLatestNode: Dispatch<SetStateAction<Node<any, string | undefined>>>
  setCurrentBranch: Dispatch<SetStateAction<Branch>>
}

export default function useGitCommitAction({
  latestNode,
  currentBranch,
  setLatestNode,
  setCurrentBranch,
}: GitCommandActionProps) {
  const toast = useToast()
  const reactFlowInstance = useReactFlow()

  const [nodeId, setNodeId] = useAtom(nodeIdAtom)
  const [defaultY] = useAtom(defaultYAtom)
  const [defaultX] = useAtom(defaultXAtom)
  const [separateUnitY] = useAtom(separateUnitYAtom)
  const [separateUnitX] = useAtom(separateUnitXAtom)
  const { connectEdge: myConnectEdge } = useConnectEdge()
  const { createNode } = useMyNode()

  const commitAction = (parsedMessage: string) => {
    // 空文字の場合は処理終了
    if (!parsedMessage.length) {
      return
    }

    let lastNode: RevisionNode | undefined = latestNode
    let x = defaultX
    let y = defaultY + nodeId * separateUnitY
    if (lastNode) {
      const branchIndex = currentBranch.no - 1
      x = branchIndex * (lastNode.width ?? 0) + branchIndex * separateUnitX
      y = lastNode.position.y + separateUnitY
    }

    const newId = nodeId + 1
    setNodeId(newId)

    const newNode = createNode({
      id: newId.toFixed(),
      x,
      y,
      label: parsedMessage,
      branchId: currentBranch.branchName,
      parentId: lastNode.id,
      parentHash: lastNode.data?.hash ?? '',
      style: { backgroundColor: 'aqua' },
    })

    const rfiNodes = reactFlowInstance.getNodes()
    const foundPreviousLatestNode = rfiNodes.find(
      (node) => node.id == latestNode.id
    )
    if (foundPreviousLatestNode) {
      foundPreviousLatestNode.style = {
        ...foundPreviousLatestNode.style,
        backgroundColor: 'white',
      }
    }
    reactFlowInstance.setNodes(rfiNodes)

    reactFlowInstance.addNodes(newNode)
    if (lastNode) {
      myConnectEdge(lastNode, newNode)
    }
    // 現在のブランチから初めてのコミットの場合は、ブランチノードから線を伸ばす
    const lastNodeOfCurrentBranch = [...rfiNodes].find(
      (e) => e.data?.branchId == currentBranch.branchName
    )
    const currentBranchNode = [...rfiNodes, newNode].find(
      (e) => e.id == currentBranch.branchName
    )
    if (!lastNodeOfCurrentBranch && currentBranchNode) {
      myConnectEdge(currentBranchNode, newNode)
    }
    reactFlowInstance.fitView({
      minZoom: 0.1,
      nodes: reactFlowInstance.getNodes(),
    })

    setLatestNode(newNode)
    setCurrentBranch((prev) => {
      prev.currentNodeId = newNode.id
      prev.latestNodeId = newNode.id
      return prev
    })

    toast({
      title: 'ノードを追加しました。',
      description: `x: ${x}`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
    toast({
      title: 'ブランチ情報を更新しました。',
      description: `currentBranch: ${JSON.stringify(currentBranch, null, 2)}`,
      status: 'success',
      isClosable: true,
    })
  }

  const parseCommitInput = (inputStr: string): string => {
    const commitRegex =
      /git\s+commit\s+(?:-m\s+)(?<quote>["'])(?<mes>[\w\_\-\s]+)\k<quote>/
    const commandInput = inputStr.match(commitRegex)?.groups?.mes ?? ''
    return commandInput
  }

  const matchCommitPattern = (inputStr: string): boolean => {
    return !!parseCommitInput(inputStr)
  }

  return { commitAction, matchCommitPattern, parseCommitInput }
}
