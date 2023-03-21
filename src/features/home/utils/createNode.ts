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
  width
}: {
  id: string
  x: number
  y: number
  label: string
  branchId?: string
  style?: CSSProperties
  width: number
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
    },
    width,
    style,
  }

  return newNode
}
