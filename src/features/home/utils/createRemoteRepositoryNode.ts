import { Position } from 'reactflow'
import { NodeKinds } from '../types/nodeKinds'
import { RemoteRepositoryRegion } from '../types/remoteRepositoryRegion'

export default function createRemoteRepositoryNode(
  id: string,
  position: { x: number; y: number }
) {
  const node = {
    id,
    position,
    type: NodeKinds.Group,
    data: {
      label: null,
    },
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
    },
  }
  return node
}
