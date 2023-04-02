import { useToast } from '@chakra-ui/react'
import { Dispatch, SetStateAction } from 'react'
import { useReactFlow, Node } from 'reactflow'
import { Branch } from '../types/branch'
import { setStyle } from '../utils/setStyle'
import { RevisionNode } from '../types/revisionNode'

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

  const checkoutAction = (branchNameOrHash: string) => {
    if (!branchNameOrHash.length) {
      toast({
        title: 'ブランチ名が空です',
        status: 'error',
        isClosable: true,
      })
      return
    }

    let foundBranch = branches.find(
      (branch) => branch.branchName == branchNameOrHash
    )

    let foundTargetNode: Node | undefined = undefined
    if (!foundBranch) {
      // ここでhash値の検索を行う。
      foundTargetNode = searchHashNode(branchNameOrHash)
      if (!foundTargetNode) {
        toast({
          title: '該当するリビジョンが存在しません',
          description: `hash: ${branchNameOrHash}`,
          status: 'error',
          isClosable: true,
        })
        return
      }

      // 見つかった場合はbranchIdからbranch名を取得する
      foundBranch = branches.find(
        (branch) => branch.branchName == foundTargetNode!.data.branchId
      )
      if (!foundBranch) {
        toast({
          title: '該当するブランチが存在しません',
          description: `branchName: ${branchNameOrHash}`,
          status: 'error',
          isClosable: true,
        })
        return
      }
    }

    // 対象のnodeの色を替える

    setCurrentBranch(foundBranch)
    const rfiNodes = reactFlowInstance.getNodes()
    const foundPreviousLatestNode = rfiNodes.find(
      (node) => node.id == latestNode.id
    )
    if (foundPreviousLatestNode) {
      setStyle(foundPreviousLatestNode, {
        backgroundColor: 'white',
      })
    }
    let foundNextLatestNode = rfiNodes.find(
      (node) => node.id == foundBranch!.currentNodeId
    )
    if (foundTargetNode) {
      foundNextLatestNode = rfiNodes.find(
        (node) => node.id == foundTargetNode!.id
      )
    }
    if (foundNextLatestNode) {
      setStyle(foundNextLatestNode, {
        backgroundColor: 'aqua',
      })
      setLatestNode(foundNextLatestNode)
    }
    const branchNodes = rfiNodes.filter((e) =>
      branches.some((branch) => branch.branchName == e.id)
    )
    branchNodes.forEach((branchNode) => {
      if (branchNode.id == foundBranch?.branchName) {
        setStyle(branchNode, {
          backgroundColor: 'aqua',
        })
      } else {
        setStyle(branchNode, {
          backgroundColor: 'white',
        })
      }
    })

    reactFlowInstance.setNodes(rfiNodes)

    toast({
      title: 'ブランチをcheckoutしました',
      description: `ブランチ名: ${branchNameOrHash}, latestNode: ${foundNextLatestNode?.id}`,
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

  const searchHashNode = (hash: string) => {
    const rfiNodes = reactFlowInstance.getNodes()
    const revisionNodes = rfiNodes.filter((node) => {
      return isRevisionNode(node)
    })
    const foundRevisionNode = revisionNodes.find((node) => {
      const rNode = node as RevisionNode
      return (rNode.data?.hash ?? '').startsWith(hash)
    })
    return foundRevisionNode
  }

  const isRevisionNode = (node: Node): node is RevisionNode => {
    return node.data?.hash !== undefined
  }

  return { checkoutAction, matchCheckoutAction, parseCheckoutAction }
}
