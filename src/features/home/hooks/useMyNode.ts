import { useAtom } from 'jotai'
import { CSSProperties } from 'react'
import { nodeHeightAtom, nodeIdAtom, nodeWidthAtom } from '../stores/atom'
import utilCreateNode from '../utils/createNode'

export default function useMyNode() {
  const [nodeId, setNodeId] = useAtom(nodeIdAtom)
  const [nodeWidth] = useAtom(nodeWidthAtom)
  const [nodeHeight] = useAtom(nodeHeightAtom)

  const createNode = ({
    id,
    x,
    y,
    label,
    style,
    branchId,
    width,
    height,
    parentId,
    merge1Id,
    merge2Id,
  }: {
    id?: string
    x: number
    y: number
    label: string
    branchId?: string
    style?: CSSProperties
    width?: number
    height?: number
    parentId: string
    merge1Id?: string
    merge2Id?: string
  }) => {
    let newNodeIdStr = id
    if (newNodeIdStr === undefined) {
      const newNodeId = nodeId + 1
      newNodeIdStr = newNodeId.toFixed()
      setNodeId(newNodeId)
    }

    const validatedWidth = width ? width : nodeWidth
    const validatedHeight = height ? height : nodeHeight

    return utilCreateNode({
      id: newNodeIdStr,
      x,
      y,
      label,
      style,
      branchId,
      parentId,
      width: validatedWidth,
      height: validatedHeight,
      merge1Id,
      merge2Id,
    })
  }

  return { createNode }
}
