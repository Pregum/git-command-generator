import { useAtom } from 'jotai'
import { CSSProperties } from 'react'
import { nodeIdAtom, nodeWidthAtom } from '../stores/atom'
import utilCreateNode from '../utils/createNode'

export default function useMyNode() {
  const [nodeId, setNodeId] = useAtom(nodeIdAtom)
  const [nodeWidth] = useAtom(nodeWidthAtom)

  const createNode = ({
    id,
    x,
    y,
    label,
    style,
    branchId,
    width,
  }: {
    id?: string
    x: number
    y: number
    label: string
    branchId?: string
    style?: CSSProperties
    width?: number
  }) => {
    let newNodeIdStr = id
    if (newNodeIdStr === undefined) {
      const newNodeId = nodeId + 1
      newNodeIdStr = newNodeId.toFixed()
      setNodeId(newNodeId)
    }

    const validatedWidth = width ? width : nodeWidth

    return utilCreateNode({
      id: newNodeIdStr,
      x,
      y,
      label,
      style,
      branchId,
      width: validatedWidth,
    })
  }

  return { createNode }
}
