import { CSSProperties } from 'react'
import { Revision } from '../types/revision'
import sha1 from './sha1'
import { Node } from 'reactflow'

export default function createNode({
  id,
  x,
  y,
  label,
  style,
  branchId,
  width,
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
  merge1Id?: string
  merge2Id?: string
}) {
  const hashStr = sha1()

  const newNode: Node<Revision, string | undefined> = {
    id: id,
    position: {
      x: x,
      y: y,
    },
    data: {
      label: label,
      branchId,
      hash: hashStr,
      merge1Id,
      merge2Id,
    },
    width,
    style,
  }

  return newNode
}
