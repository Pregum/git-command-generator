import { CheckCircleIcon } from '@chakra-ui/icons'
import {
  Code,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'

type CommandExplanation = {
  command: string
  description: string
}

const helpTextList: CommandExplanation[] = [
  {
    command: 'git checkout ${branchName}:',
    description: 'branchNameへチェックアウトします',
  },
  {
    command: 'git commit ${commitMessage}:',
    description: 'commitMessageというメッセージコミットします',
  },
]

export type Props = React.PropsWithChildren<{
  isOpen: boolean
  onClose: () => void
}>

export function CommandHelpModal({ isOpen, onClose }: Props) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={'3xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>使用可能コマンド一覧</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <List spacing={3}>
              {helpTextList.map((helpText) => (
                <ListItem
                  key={[helpText.command, helpText.description].join('-')}
                >
                  <ListIcon as={CheckCircleIcon} color='teal.300' />
                  <Code>{helpText.command}</Code>
                  {helpText.description}
                </ListItem>
              ))}
            </List>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
