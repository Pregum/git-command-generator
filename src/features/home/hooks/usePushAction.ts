import { useReactFlow } from 'reactflow'
import useMyToast from './useMyToast'
import { nodeIdAtom } from '../stores/atom'
import { useAtom } from 'jotai'
import useConnectEdge from './useConnectEdge'
import useMyNode from './useMyNode'
import { NodeKinds } from '../types/nodeKinds'
import { Node } from 'reactflow'
import createRemoteRepositoryNode from '../utils/createRemoteRepositoryNode'

export default function usePushAction() {
  const toast = useMyToast()
  const reactFlowInstance = useReactFlow()

  const [nodeId, setNodeId] = useAtom(nodeIdAtom)
  const { connectEdge } = useConnectEdge()
  const { createNode } = useMyNode()

  const pushAction = (remoteBranch: string) => {
    if (!remoteBranch) {
      toast.error({
        title: '追跡ブランチ名が空です',
      })

      return
    }

    // push アクションを行うと、右側にブロックを記載する
    const remoteParentNode = ''

    // とりあえず試しに枠を作成する。
    const foundRemoteRepositoryNode = findRemoteRepositoryRegion(remoteBranch)
    if (!foundRemoteRepositoryNode) {
      createRemoteRepositoryRegion(remoteBranch)
      toast.success({
        title: 'リモートリポジトリを作成しました',
        description: `remoteName: ${remoteBranch}`,
        isClosable: true
      })
    }
  }

  const findRemoteRepositoryRegion = (
    remoteName: string
  ): Node<any, string | undefined> | undefined => {
    const branches = reactFlowInstance.getNodes()
    const foundRemoteNode = branches.find(
      (branch) => branch.type == NodeKinds.Group
    )
    return foundRemoteNode
  }

  const createRemoteRepositoryRegion = (remoteName: string) => {
    // remoteNameがすでに存在していればこれは無視する
    const region = createRemoteRepositoryNode(remoteName, { x: 200, y: 0})
    reactFlowInstance.addNodes(region)
  }

  const matchPushAction = (inputStr: string) => {
    return !!prasePushAction(inputStr)
  }

  const prasePushAction = (inputStr: string) => {
    const pushRegex = /git\s+push\s+(?<remoteName>[\w\_\-]+)/
    const remoteName = inputStr.match(pushRegex)?.groups?.remoteName ?? ''

    return remoteName
  }

  return { pushAction, matchPushAction, prasePushAction }
}
