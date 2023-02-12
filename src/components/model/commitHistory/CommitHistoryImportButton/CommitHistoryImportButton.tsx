import { ArrowRightIcon } from '@chakra-ui/icons'
import { Center, VStack, IconButton } from '@chakra-ui/react'

export type Props = React.PropsWithChildren<{}>

export const CommitHistoryImportButton: React.FC<Props> = ({ children }) => {
  return (
    <Center>
      <VStack>
        <text>Import</text>
        <IconButton
          aria-label={'import button'}
          icon={<ArrowRightIcon />}
          onClick={() => {}}
        />
      </VStack>
    </Center>
  )
}

