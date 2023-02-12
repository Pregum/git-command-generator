import { MyHeader } from '@/components/ui/MyHeader'
import { Box, Flex, Grid, HStack } from '@chakra-ui/react'
import { CommitHistoryLoader } from '../../model/commitHistory/CommitHistoryLoader/CommitHistoryLoader'

export type Props = React.PropsWithChildren<{}>

export const Home: React.FC<Props> = ({ children }) => {
  return (
    <Flex direction='column' h='100vh'>
      <MyHeader />

      <Flex direction='row' h='100%'>
        <Grid w={80} h='100%'>
          <CommitHistoryLoader />
        </Grid>

        <Grid flex={4}>
          <Box bg='orange.50' h='100%'>
            hoge
          </Box>
        </Grid>
      </Flex>
    </Flex>
  )
}
