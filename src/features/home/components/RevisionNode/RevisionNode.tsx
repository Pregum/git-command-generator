import { Box, Center, Text, VStack } from '@chakra-ui/react'
import { Handle, Position } from 'reactflow'

export type Props = React.ComponentProps<any>
export const RevisionNode: React.FC<Props> = ({ id, data, style }) => {
  return (
    <>
      <Handle type='target' position={Position.Top} />
      <Box style={{ ...style }} h={'100%'}>
        <VStack h={'100%'} justify='center'>
          {/* <Text>id: {id}</Text> */}
          <Text fontSize={8}>
            short hash: {data.hash.slice(0, 8) ?? 'no hash'}
          </Text>
          <Text fontSize={10}>message: {data.label}</Text>
        </VStack>
      </Box>
      <Handle type='source' position={Position.Bottom} id='a' />
    </>
  )
}
