import { CSSProperties } from 'react'
import { Revision } from '../types/revision'
import sha1 from './sha1'
import { Node } from 'reactflow'
import { NODE_HEIGHT, NODE_WIDTH } from '../const/constants'

export default function createNode({
  id,
  x,
  y,
  label,
  style,
  branchId,
  width,
  height,
  parentId,
  parentHash,
  merge1Id,
  merge2Id,
}: {
  id: string
  x: number
  y: number
  label: string
  branchId?: string
  style?: CSSProperties
  width: number
  height?: number
  parentId: string
  parentHash: string
  merge1Id?: string
  merge2Id?: string
}) {
  const hashStr = sha1()
  const defaultStyle: CSSProperties = {
    backgroundColor: 'white',
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
  }

  const newNode: Node<Revision, string | undefined> = {
    id: id,
    position: {
      x: x,
      y: y,
    },
    type: 'revisionNode',
    data: {
      label: label,
      branchId,
      parentId,
      hash: hashStr,
      parentHash,
      merge1Id,
      merge2Id,
    },
    width,
    height,
    style: { ...defaultStyle, ...style, width, height },
  }

  return newNode
}
