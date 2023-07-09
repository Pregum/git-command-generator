import { useReactFlow } from 'reactflow'
import useMyToast from './useMyToast'
import { nodeIdAtom } from '../stores/atom'
import { useAtom } from 'jotai'
import useConnectEdge from './useConnectEdge'
import useMyNode from './useMyNode'

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
  }
}
