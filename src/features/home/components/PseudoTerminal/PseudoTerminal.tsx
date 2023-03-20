import { Button, Card, Flex, Grid, Textarea } from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import Terminal, { ColorMode } from 'react-terminal-ui'

export type Props = React.PropsWithChildren<{
  message: string
  onChangedMessage: (newValue: string) => void
  onInput: (str: string) => void
}>

export const PseudoTerminal: React.FC<Props> = ({
  children,
  message,
  onChangedMessage,
  onInput,
}) => {
  const [value, setValue] = useState(message)

  useEffect(() => {
    setValue(message)
  }, [message])

  return (
    // <Textarea
    //   h='100%'
    //   bg='white'
    //   placeholder='git commit -m "hello world!"'
    //   value={value}
    //   onChange={handleInputChange}
    // />
    <Terminal colorMode={ColorMode.Dark} onInput={onInput}>
      {/* {message} */}
    </Terminal>
  )
}
