import { useToast } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { useReactFlow } from 'reactflow'
import { latestNodeAtom } from '../stores/atom'
import { Revision } from '../types/revision'
import useMyToast from './useMyToast'
import { Node } from 'reactflow'
import { setStyle } from '../utils/setStyle'

export type GitCommandActionProps = {}

export default function useResetAction({}: GitCommandActionProps) {
  const reactFlowInstance = useReactFlow<Revision, any>()
  // const toast= useToast()
  const { error, success } = useMyToast()
  const [latestNode, setLatestNode] = useAtom(latestNodeAtom)

  const resetAction = (hashOrHead: string) => {
    if (!hashOrHead) {
      error({
        title: 'ハッシュ値が空です',
      })
      return
    }

    // 特定のリビジョンまで戻る
    // 既に他のリビジョンがresetより先に存在する場合はリビジョンを保持する。
    const rfiNodes = reactFlowInstance.getNodes()
    const currentRevision = rfiNodes.find((node) => {
      return node.id == latestNode.id
    })
    if (!currentRevision) {
      error({
        title: '現在のリビジョンが見つかりませんでした。',
      })
      return
    }

    const resetApplyingNodes: Node<Revision>[] = []

    // 分岐
    // 1. 同じブランチの場合はそこまでリビジョンを削除する。
    // 2. ブランチを切ったところより前（＝カレントブランチ独自のリビジョンがない場合）
    // 複数ブランチが存在する場合もあるので、最新ブランチのparent_idで再起処理を行う
    const targetId = convertToTargetHash(hashOrHead)
    const targetNode = searchCommitRecursively(
      (node) => node.data.hash?.startsWith(targetId) ?? false,
      (node) => {
        resetApplyingNodes.push(node)
      },
      currentRevision
    )
    if (!targetNode) {
      error({
        title: '対象のリビジョンが見つかりませんでした。',
      })
      return
    }

    setLatestNode(targetNode)
    setStyle(targetNode, {
      backgroundColor: 'aqua',
    })

    // 見つかったので、先頭から消していく
    const newNodes = filterRemovingNode(resetApplyingNodes)
    reactFlowInstance.setNodes(newNodes)
    const newEdges = filterConnectedEdge(resetApplyingNodes)
    reactFlowInstance.setEdges(newEdges)

    success({
      title: '対象のrevisionまでresetしました',
      description: `削除したrevision: ${resetApplyingNodes.map((s) => s.id)}`,
    })
  }

  const matchResetAction = (inputStr: string) => {
    return !!parseResetAction(inputStr)
  }

  const parseResetAction = (inputStr: string) => {
    const resetRegex = /git\s+reset\s+(?<hash>[\w^@~])/
    const hashOrHead = inputStr.match(resetRegex)?.groups?.hash ?? ''
    return hashOrHead
  }

  const filterConnectedEdge = (removingNodes: Node<Revision>[]) => {
    const rfiEdges = reactFlowInstance.getEdges()
    const nextStateEdges = rfiEdges.filter(
      (edge) =>
        !removingNodes.some((s) => edge.source == s.id || edge.target == s.id)
    )

    console.log(
      `after edges: ${nextStateEdges.map((e) => {
        return JSON.stringify({ target: e.target, source: e.source }, null, 2)
      })}`
    )

    return nextStateEdges
  }

  const filterRemovingNode = (removingNodes: Node<Revision>[]) => {
    const rfiNodes = reactFlowInstance.getNodes()

    const removedRfiNodes = rfiNodes.filter(
      (node) => !removingNodes.some((s) => s.id == node.id)
    )
    return removedRfiNodes
  }

  const convertToTargetHash = (hashOrHead: string) => {
    // TODO: ここで、hashではない場合、HEAD^^^などの文を解析してcommitのhashに変換する
    return hashOrHead
  }

  const searchCommitRecursively = (
    predicate: (node: Node<Revision>) => boolean,
    cb: (node: Node<Revision>) => void,
    currentNode: Node<Revision> | undefined
  ): Node | undefined => {
    if (!currentNode) {
      return undefined
    }

    // から以外の場合はループ
    // if (currentNode.id == targetId) {
    //   return currentNode
    // }
    if (predicate(currentNode)) {
      return currentNode
    }

    cb(currentNode)

    const parentNode = reactFlowInstance
      .getNodes()
      .find((node) => (node.id ?? '') == currentNode.data.parentId)

    return searchCommitRecursively(predicate, cb, parentNode)
  }

  return { resetAction, matchResetAction, parseResetAction }
}
