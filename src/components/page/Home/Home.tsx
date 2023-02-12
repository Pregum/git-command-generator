import { MyHeader } from '@/components/ui/MyHeader'
import { Box, Flex } from '@chakra-ui/react'

export type Props = React.PropsWithChildren<{}>

export const Home: React.FC<Props> = ({ children }) => {
  return (
    <Flex direction='column' h='100vh'>
      <MyHeader />
      <Box bg='orange.50' h='100%'>
        hoge
      </Box>
    </Flex>
  )
}
