import { useToast } from '@chakra-ui/react'
import { Dispatch, SetStateAction } from 'react'
import { useReactFlow, Node } from 'reactflow'
import { Branch } from '../types/branch'

export type CheckoutActionProps = {
  branches: Branch[]
  setCurrentBranch: Dispatch<SetStateAction<Branch>>
  latestNode: Node<Branch>
  setLatestNode: Dispatch<SetStateAction<Node<Branch>>>
}

export default function useCheckoutAction({
  branches,
  setCurrentBranch,
  latestNode,
  setLatestNode,
}: CheckoutActionProps) {
  const toast = useToast()
  const reactFlowInstance = useReactFlow()

  const checkoutAction = (branchName: string) => {
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
    if (!foundBranch) {
      toast({
        title: '該当するブランチが存在しません',
        description: `branchName: ${branchName}`,
        status: 'error',
        isClosable: true,
      })
      return
    }

    // 対象のnodeの色を替える

    setCurrentBranch(foundBranch)
    const rfiNodes = reactFlowInstance.getNodes()
    const foundPreviousLatestNode = rfiNodes.find(
      (node) => node.id == latestNode.id
    )
    if (foundPreviousLatestNode) {
      foundPreviousLatestNode.style = {
        backgroundColor: 'white',
      }
    }
    const foundNextLatestNode = rfiNodes.find(
      (node) => node.id == foundBranch.currentNodeId
    )
    if (foundNextLatestNode) {
      foundNextLatestNode.style = {
        backgroundColor: 'aqua',
      }
      setLatestNode(foundNextLatestNode)
    }
    const branchNodes = rfiNodes.filter((e) =>
      branches.some((branch) => branch.branchName == e.id)
    )
    branchNodes.forEach((branchNode) => {
      if (branchNode.id == branchName) {
        branchNode.style = {
          ...branchNode.style,
          backgroundColor: 'aqua',
        }
      } else {
        branchNode.style = {
          ...branchNode.style,
          backgroundColor: 'white',
        }
      }
    })

    reactFlowInstance.setNodes(rfiNodes)

    toast({
      title: 'ブランチをcheckoutしました',
      description: `ブランチ名: ${branchName}, latestNode: ${foundNextLatestNode?.id}`,
      status: 'success',
      isClosable: true,
    })
  }
  const matchCheckoutAction = (inputStr: string) => {
    return !!parseCheckoutAction(inputStr)
  }

  const parseCheckoutAction = (inputStr: string) => {
    const checkoutRegex = /git\s+checkout\s+(?<branchName>[\w\_\-]+)/
    const branchName = inputStr.match(checkoutRegex)?.groups?.branchName ?? ''

    return branchName
  }

  return { checkoutAction, matchCheckoutAction, parseCheckoutAction }
}
