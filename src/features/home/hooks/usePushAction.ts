import { useReactFlow } from 'reactflow'
import useMyToast from './useMyToast'
import { nodeIdAtom } from '../stores/atom'
import { useAtom } from 'jotai'
import useConnectEdge from './useConnectEdge'
import useMyNode from './useMyNode'
import { NodeKinds } from '../types/nodeKinds'
import { Node } from 'reactflow'
import createRemoteRepositoryNode from '../utils/createRemoteRepositoryNode'
import { REmoteRepositoryRegionNode } from '../types/remoteRepositoryRegionNode'
import { RemoteRepositoryRegion } from '../types/remoteRepositoryRegion'

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
      const newRepositoryNode = createRemoteRepositoryRegion(remoteBranch)
      toast.success({
        title: 'リモートリポジトリを作成しました',
        description: `remoteName: ${remoteBranch}`,
        isClosable: true,
      })

      // あとはローカルブランチをリモートに反映させていく
      pushBranches(newRepositoryNode)
      return
    }


    // 存在する場合はそのままpushする
    pushBranches(foundRemoteRepositoryNode)
  }

  const pushBranches = (newRepositoryNode: Node) => {
    // リモートリポジトリに反映させていく

    const nodes = reactFlowInstance.getNodes()
    const localNodes = nodes.filter((node) => node.extent == undefined)
    const remoteNodes = localNodes.map((localNode) => {
      // ローカルノードを複製してリモートノードにしていく
      const remoteNode = localNode
      remoteNode.id = `${newRepositoryNode.id}-${localNode.id}`
      remoteNode.extent = 'parent'
      remoteNode.parentNode = newRepositoryNode.id
      return remoteNode
    })

    reactFlowInstance.addNodes(remoteNodes)

    // edgeも加えていく
    const edges = reactFlowInstance.getEdges()
    const localEdges = edges.filter((edge) => edge.data?.remoteName != newRepositoryNode.id)
    const remoteEdges = localEdges.map((localEdge) => {
      const remoteEdge = localEdge
      remoteEdge.id = `${newRepositoryNode.id}-${localEdge.id}`
      remoteEdge.source = `${newRepositoryNode.id}-${localEdge.source}`
      remoteEdge.target = `${newRepositoryNode.id}-${localEdge.target}`
      return remoteEdge
    }) 

    reactFlowInstance.addEdges(remoteEdges)

    toast.success({
      title: 'リモートリポジトリへpushしました。',
      // description: `edges: ${JSON.stringify(remoteEdges)}`,
      // description: `first remote branch id: ${JSON.stringify(remoteNodes)}}`,
      isClosable: true,
    })
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
    // TODO: ここのx, yの値は外から渡すか、もしくはこのhooks内部で管理できる様にする
    const region = createRemoteRepositoryNode(remoteName, { x: 200, y: 0 })
    reactFlowInstance.addNodes(region)
    return region
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
