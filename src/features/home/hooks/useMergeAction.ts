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
  separateUnitYAtom,
} from '../stores/atom'
import useConnectEdge from './useConnectEdge'
import useMyNode from './useMyNode'

export default function useMergeAction() {
  const toast = useToast()
  const reactFlowInstance = useReactFlow()

  const [nodeId, setNodeId] = useAtom(nodeIdAtom)
  const [branches] = useAtom(branchesAtom)
  const [currentBranch, setCurrentBranch] = useAtom(currentBranchAtom)
  const [latestNode, setLatestNode] = useAtom(latestNodeAtom)
  const [defaultX] = useAtom(defaultXAtom)
  const [defaultY] = useAtom(defaultYAtom)
  const [separateUnitX] = useAtom(separateUnitXAtom)
  const [separateUnitY] = useAtom(separateUnitYAtom)

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

    if (currentBranch.branchName == anotherBranchName) {
      toast({
        title: '同一ブランチはマージ対象にできません',
        description: `現ブランチ名: ${currentBranch.branchName}, マージ対象ブランチ名: ${anotherBranchName}`,
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

    // 別のコミット挟むとマージできてしまうので今のブランチに含まれるコミット全てのmerge2Idを検索する
    const currentBranchNodes = rfiNodes.filter(
      (node) => node.data?.branchId == currentBranch.branchName
    )
    const hasBeenMerged = currentBranchNodes.find(
      (node) => node.data?.merge2Id == anotherLatestNode.id
    )

    // 同じidの場合はマージできないので弾く
    if (hasBeenMerged || latestNode.data.merge2Id == anotherLatestNode.id) {
      toast({
        title: '既にマージ済みです',
        description: `latest id: ${latestNode.id}, another latest id: ${anotherLatestNode.id}`,
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
    let y = defaultY + nodeId * separateUnitY
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
      branchId: currentBranch.branchName,
      parentId: latestNode.id,
      merge1Id: latestNode.id,
      merge2Id: anotherLatestNode.id,
    })

    const foundLatestNode = rfiNodes.find((node) => node.id == latestNode.id)
    if (foundLatestNode) {
      foundLatestNode.style = {
        ...foundLatestNode.style,
        backgroundColor: 'white',
      }
    }

    // ここで色の更新をかける
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
