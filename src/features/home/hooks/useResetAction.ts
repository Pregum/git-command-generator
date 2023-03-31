import { useReactFlow } from 'reactflow'

export type GitCommandActionProps = {}

export default function useResetAction({}: GitCommandActionProps) {
  const reactFlowInstance = useReactFlow()

  const resetAction = (hash: string) => {
  }
}
