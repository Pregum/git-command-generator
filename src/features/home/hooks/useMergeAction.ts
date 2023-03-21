import { useToast } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { useReactFlow } from 'reactflow'

export default function useMergeAction() {
  const toast = useToast()
  const reactFlowInstance = useReactFlow()
  const [ branches, setBranches ] = useAtom(branchesAtom)

  const mergeAction = (anotherBranchName: string) => {
    // TODO: ここで対象ブランチが存在しているかチェック

    if (!anotherBranchName.length) {
      toast({
        title: 'ブランチ名が空です',
        status: 'error',
        isClosable: true,
      })
      return
    }

    const foundBranch = branches.find
  }
}
