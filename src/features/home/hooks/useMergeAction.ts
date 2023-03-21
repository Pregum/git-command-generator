import { useToast } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { useReactFlow } from 'reactflow'
import {
  branchesAtom,
  currentBranchAtom,
  nodeIdAtom,
  latestNodeAtom,
  defaultXAtom,
  defaultYAtom,
  separateUnitXAtom,
} from '../stores/atom'
import useConnectEdge from './useConnectEdge'
import useMyNode from './useMyNode'

export default function useMergeAction() {
  const toast = useToast()
  const reactFlowInstance = useReactFlow()

  const [nodeId, setNodeId] = useAtom(nodeIdAtom)
  const [branches, setBranches] = useAtom(branchesAtom)
  const [currentBranch, setCurrentBranch] = useAtom(currentBranchAtom)
  const [latestNode, setLatestNode] = useAtom(latestNodeAtom)
  const [defaultX] = useAtom(defaultXAtom)
  const [defaultY] = useAtom(defaultYAtom)
  const [separateUnitX] = useAtom(separateUnitXAtom)

  const { createNode } = useMyNode()
  const { connectEdge } = useConnectEdge()

  const mergeAction = (anotherBranchName: string) => {
    if (!anotherBranchName.length) {
      toast({
        title: 'ブランチ名が空です',
        status: 'error',
        isClosable: true,
      })
      return
    }

    const foundAnotherBranch = branches.find(
      (branch) => branch.branchName == anotherBranchName
    )
    if (!foundAnotherBranch) {
      toast({
        title: 'マージ対象のブランチが存在しません',
        description: `ブランチ名: ${anotherBranchName}`,
        status: 'error',
        isClosable: true,
      })
      return
    }

    const rfiNodes = reactFlowInstance.getNodes()
    const anotherLatestNode = rfiNodes.find(
      (node) => node.id == foundAnotherBranch.latestNodeId
    )
    if (!anotherLatestNode) {
      toast({
        title: 'マージ対象のリビジョンが存在しません',
        description: `revision id: ${foundAnotherBranch.latestNodeId}`,
        status: 'error',
        isClosable: true,
      })
      return
    }

    const branchNode = rfiNodes.find(
      (node) => node.id == currentBranch.branchName
    )
    if (!branchNode) {
      toast({
        title: '現在のブランチノードが存在しません',
        description: `branch id: ${currentBranch.branchName}`,
        status: 'error',
        isClosable: true,
      })
      return
    }

    // 同じidの場合はマージできないので弾く
    if (latestNode.id == anotherLatestNode.id) {
      toast({
        title: '同一のブランチのマージはできません',
        description: `branch id: ${currentBranch.branchName}, another branch id: ${anotherLatestNode.id}`,
        status: 'error',
        isClosable: true,
      })
      return
    }

    // ここで、対象のブランチの最新リビジョンのノードを取得する
    const newId = nodeId + 1
    setNodeId(newId)
    const sentence = `Merge branch '${anotherBranchName}' into ${currentBranch.branchName}`
    let x = defaultX
    let y = defaultY + nodeId * 100
    if (latestNode) {
      const branchIndex = currentBranch.no - 1
      x = branchIndex * (latestNode.width ?? 0) + branchIndex * separateUnitX
      const maximumY =
        Math.max(latestNode.position.y, anotherLatestNode.position.y) + 100
      y = maximumY
    }

    const mergedNode = createNode({
      id: newId.toFixed(),
      label: sentence,
      x,
      y,
    })

    // ここで色の更新をかける
    latestNode.style = {
      ...latestNode.style,
      backgroundColor: 'white',
    }
    branchNode.style = {
      ...branchNode.style,
      backgroundColor: 'white',
    }

    reactFlowInstance.setNodes(rfiNodes)

    mergedNode.style = {
      ...mergedNode.style,
      backgroundColor: 'aqua',
    }

    reactFlowInstance.addNodes(mergedNode)
    setLatestNode(mergedNode)
    setCurrentBranch((prev) => {
      prev.currentNodeId = mergedNode.id
      prev.latestNodeId = mergedNode.id
      return prev
    })

    connectEdge(latestNode, mergedNode)
    connectEdge(anotherLatestNode, mergedNode)
  }

  const matchMergeAction = (inputStr: string) => {
    return !!parseMergeAction(inputStr)
  }

  const parseMergeAction = (inputStr: string) => {
    const mergeRegex = /git\s+merge\s+(?<branchName>[\w\_\-]+)/
    const branchName = inputStr.match(mergeRegex)?.groups?.branchName ?? ''

    return branchName
  }

  return { mergeAction, matchMergeAction, parseMergeAction }
}
