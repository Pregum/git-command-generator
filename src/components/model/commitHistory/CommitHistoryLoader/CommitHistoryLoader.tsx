import { Button, Card, Flex, Grid, Textarea } from '@chakra-ui/react'
import { useCallback, useState } from 'react'

export type Props = React.PropsWithChildren<{
  onClickExecute: (message: String) => void
}>

export const CommitHistoryLoader: React.FC<Props> = ({
  children,
  onClickExecute,
}) => {
  const [value, setValue] = useState('')
  const handleInputChange = (e: any) => {
    const inputValue = e.target.value
    setValue(inputValue)
  }

  const onCallback = useCallback(() => {
    onClickExecute(value)
  }, [onClickExecute, value])
  return (
    <Flex direction='column' bg='gray.200'>
      <Grid h={16} m={2}>
        <Card m={2} p={2}>
          git commandを入力してください
        </Card>
      </Grid>
      <Grid flex={4} m={2} p={2}>
        <Textarea
          h='100%'
          bg='white'
          placeholder='git commit -m "hello world!"'
          value={value}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid m={2} maxH={20} p='0 0.5rem 0.5rem 0.5rem'>
        <Button bg='teal.300' onClick={onCallback}>
          execute!
        </Button>
      </Grid>
    </Flex>
  )
}
