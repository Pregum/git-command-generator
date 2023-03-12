import { Button, Card, Center, Flex, Grid, Textarea } from '@chakra-ui/react'

export type Props = React.PropsWithChildren<{}>

export const CommitHistoryLoader: React.FC<Props> = ({ children }) => {
  return (
    <Flex direction='column' bg='gray.200'>
      <Grid h={16} m={2}>
        <Card m={2} p={2}>
          git commandを入力してください
        </Card>
      </Grid>
      <Grid flex={4} m={2} p={2}>
        <Textarea h='100%' bg='white' placeholder='git commit -m "hello world!"' />
      </Grid>
      <Grid m={2} maxH={20} p='0 0.5rem 0.5rem 0.5rem'>
        <Button bg='teal.300' >execute!</Button>
      </Grid>
    </Flex>
  )
}
