import { CommitHistoryImportButton } from '@/components/model/commitHistory/CommitHistoryImportButton'
import { MyHeader } from '@/components/ui/MyHeader'
import { Box, Center, Flex, Grid } from '@chakra-ui/react'
import { CommitHistoryLoader } from '../../model/commitHistory/CommitHistoryLoader/CommitHistoryLoader'
import ReactFlow, { ReactFlowProvider, useReactFlow, Node } from 'reactflow'
import { DiagramCanvasDrawArea } from '@/components/model/diagramCanvas/DiagramCanvasDrawArea'
import { useCustomKeybinding as useCustomKeybinding } from '@/components/ui/CustomKeybinding'
import { useState } from 'react'

export type Props = React.PropsWithChildren<{}>

let nodeId = 0

export const Home: React.FC<Props> = ({ children }) => {
  const [message, setMessage] = useState<string>('')
  const reactFlowInstance = useReactFlow()
  // ref: https://blog.stin.ink/articles/react-hooks-keybind
  useCustomKeybinding({
    key: 'Enter',
    metaKey: true,
    onKeyDown: () => {
      onClickExecute(message)
      setMessage('')
    },
  })

  useCustomKeybinding({
    key: 'Enter',
    altKey: true,
    onKeyDown: () => {
      onClickExecute(message)
      setMessage('')
    },
  })

  const defaultY = 100
  const defaultX = 0

  const onClickExecute = (message: String) => {
    // 空文字の場合は処理終了
    if (!message.length) {
      return
    }

    const id = `${++nodeId}`
    const newNode: Node<any, string | undefined> = {
      id,
      position: {
        x: defaultX,
        y: defaultY + nodeId * 100,
      },
      data: {
        label: message,
      },
    }
    reactFlowInstance.addNodes(newNode)
  }

  return (
    <Flex direction='column' h='100vh'>
      <MyHeader />

      <Flex direction='row' h='100%'>
        <Grid flex={2} maxW='300px' h='100%'>
          <CommitHistoryLoader
            onClickExecute={onClickExecute}
            message={message}
            onChangedMessage={(newMessage) => setMessage(newMessage)}
          />
        </Grid>

        {/* <Grid flex={1} h='100%' borderRadius='100%'>
          <CommitHistoryImportButton />
        </Grid> */}

        <Grid flex={4}>
          <Box bg='orange.50' h='100%'>
            <DiagramCanvasDrawArea reactFlowInstance={reactFlowInstance} />
          </Box>
        </Grid>
      </Flex>
    </Flex>
  )
}

export default Home
