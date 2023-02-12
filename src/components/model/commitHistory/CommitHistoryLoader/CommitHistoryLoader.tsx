import { Card, Flex, Grid, Textarea } from '@chakra-ui/react'

export type Props = React.PropsWithChildren<{}>

export const CommitHistoryLoader: React.FC<Props> = ({ children }) => {
  return (
    <Flex direction='column' bg='gray.200'>
      <Grid h={16} m={2}>
        <Card m={2} p={2}>
          読み込ませたいGit logの出力を貼り付けてください。 
        </Card>
      </Grid>
      <Grid flex={4} m={2} p={2}>
        <Textarea h='100%' bg='white' />
      </Grid>
    </Flex>
  )
}
