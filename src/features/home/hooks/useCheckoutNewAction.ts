import { useToast } from '@chakra-ui/react'
import { Dispatch, SetStateAction } from 'react'
import { Branch } from '../types/branch'
import { Node, useReactFlow } from 'reactflow'
import {
  branchUnitLeftMarginAtom,
  branchYAtom,
  nodeWidthAtom,
  separateUnitXAtom,
} from '../stores/atom'
import { useAtom } from 'jotai'
import createBranchNode from '../utils/createBranchNode'

export type CheckoutNewActionProps = {
  branches: Branch[]
  setBranches: Dispatch<SetStateAction<Branch[]>>
  latestNode: Node<Branch>
  setCurrentBranch: Dispatch<SetStateAction<Branch>>
}

export default function useCheckoutNewAction({
  branches,
  setBranches,
  latestNode,
  setCurrentBranch,
}: CheckoutNewActionProps) {
  const toast = useToast()
  const reactFlowInstance = useReactFlow()

  const [nodeWidth] = useAtom(nodeWidthAtom)
  const [separateUnitX] = useAtom(separateUnitXAtom)
  const [branchUnitLeftMargin] = useAtom(branchUnitLeftMarginAtom)
  const [branchY] = useAtom(branchYAtom)

  const checkoutNewBranchAction = (branchName: string) => {
    // 空文字の場合は処理終了
    if (!branchName.length) {
      toast({
        title: 'ブランチ名が空です',
        status: 'error',
        isClosable: true,
      })
      return
    }

    const foundBranch = branches.find(
      (branch) => branch.branchName == branchName
    )
    if (foundBranch) {
      toast({
        title: '同名のブランチが存在しています',
        description: `branchName: ${branchName}`,
        status: 'error',
        isClosable: true,
      })
      return
    }

    // 新しいブランチの場合は右側にnodeを作成する処理を実装
    let lastNode: Partial<Node> = latestNode
    if (!lastNode) {
      toast({
        title: 'コミット情報が取得できませんでした',
        status: 'error',
        isClosable: true,
      })
      return
    }

    const branchLengthWithoutNewBranch = branches.length

    // ここで横にずらす
    const newBranch: Branch = {
      branchName: branchName,
      no: branches.length + 1,
      rootNodeId: latestNode.id,
      currentNodeId: latestNode.id,
      latestNodeId: latestNode.id,
    }

    setBranches((prev) => {
      prev.push(newBranch)
      return prev
    })

    setCurrentBranch(newBranch)

    // ここでbranchのnodeを作成する。
    const position = {
      x:
        branchLengthWithoutNewBranch * nodeWidth +
        branchLengthWithoutNewBranch * separateUnitX +
        branchUnitLeftMargin,
      y: branchY,
    }
    const newBranchNode = createBranchNode(
      newBranch.branchName,
      position,
      branchName
    )
    newBranchNode.style = {
      ...newBranchNode.style,
      backgroundColor: 'aqua',
    }
    reactFlowInstance.addNodes(newBranchNode)

    // ブランチの色を変える
    const rfiNodes = reactFlowInstance.getNodes()
    const foundBranchNodes = rfiNodes.filter((node) =>
      branches.some((b) => b.branchName == node.id)
    )
    foundBranchNodes.forEach((branch) => {
      branch.style = {
        ...branch.style,
        backgroundColor: 'white',
      }
    })
    reactFlowInstance.setNodes(rfiNodes)
    reactFlowInstance.addNodes(newBranchNode)

    toast({
      title: 'ブランチをcheckoutしました',
      description: `新しいブランチ名: ${branchName}`,
      status: 'success',
      isClosable: true,
    })
  }

  const matchCheckoutNewAction = (inputStr: string) => {
    return !!parseCheckoutNewAction(inputStr)
  }

  const parseCheckoutNewAction = (inputStr: string) => {
    const checkoutNewBranchRegex =
      /git\s+checkout\s+-b\s+(?<branchName>[\w\_\-]+)/
    const commandInput =
      inputStr.match(checkoutNewBranchRegex)?.groups?.branchName ?? ''
    return commandInput
  }

  return {
    checkoutNewBranchAction,
    matchCheckoutNewAction,
    parseCheckoutNewAction,
  }
}
