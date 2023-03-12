import { CommitHistoryImportButton } from '@/components/model/commitHistory/CommitHistoryImportButton'
import { MyHeader } from '@/components/ui/MyHeader'
import { Box, Center, Flex, Grid } from '@chakra-ui/react'
import { CommitHistoryLoader } from '../../model/commitHistory/CommitHistoryLoader/CommitHistoryLoader'
import ReactFlow, { ReactFlowProvider } from 'reactflow'
import { DiagramCanvasDrawArea } from '@/components/model/diagramCanvas/DiagramCanvasDrawArea'

export type Props = React.PropsWithChildren<{}>

export const Home: React.FC<Props> = ({ children }) => {
  return (
    <Flex direction='column' h='100vh'>
      <MyHeader />

      <Flex direction='row' h='100%'>
        <Grid flex={2} maxW='300px' h='100%'>
          <CommitHistoryLoader />
        </Grid>

        {/* <Grid flex={1} h='100%' borderRadius='100%'>
          <CommitHistoryImportButton />
        </Grid> */}

        <Grid flex={4}>
          <Box bg='orange.50' h='100%'>
            <ReactFlowProvider>
              <DiagramCanvasDrawArea />
            </ReactFlowProvider>
          </Box>
        </Grid>
      </Flex>
    </Flex>
  )
}
