import { NodePositionChange } from 'reactflow'

export default function isNodePositionChange(
  arg: any
): arg is NodePositionChange {
  return arg.position !== undefined
}
