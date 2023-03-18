import { PseudoTerminal } from '@/components/ui/PseudoTerminal'
import { Button, Card, Flex, Grid, Textarea } from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'

export type Props = React.PropsWithChildren<{
  onClickExecute: (message: string) => void
  message: string
  onChangedMessage: (newValue: string) => void
  onInput?: (str: string) => void
}>

export const CommitHistoryLoader: React.FC<Props> = ({
  children,
  onClickExecute,
  message,
  onChangedMessage,
  onInput,
}) => {
  const [value, setValue] = useState(message)
  const onCallback = useCallback(() => {
    onClickExecute(value)
  }, [onClickExecute, value])

  useEffect(() => {
    setValue(message)
  }, [message])

  const handleInputChange = (inputValue: any) => {
    // const inputValue = e.target.value
    setValue(inputValue)
    onChangedMessage(inputValue)
  }

  return (
    <Flex direction='column' bg='gray.200'>
      <Grid h={16} m={2}>
        <Card m={2} p={2}>
          git commandを入力してください
        </Card>
      </Grid>
      {/* <Grid flex={4} m={2} p={2}>
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
      </Grid> */}
      <Grid flex={4} m={2} p={2}>
        <PseudoTerminal
          message={message}
          onChangedMessage={handleInputChange}
          onInput={(str) => {
            const trimmedStr = str.trim()
            console.log('str:', trimmedStr)
            // onInput ? onInput(trimmedStr) : onClickExecute(trimmedStr)
            onClickExecute(trimmedStr)
          }}
          // onInput={onInput}
        />
      </Grid>
    </Flex>
  )
}
