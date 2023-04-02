import { useToast } from '@chakra-ui/react'

export default function useMyToast() {
  const toast = useToast()

  function error({
    title,
    description = '',
    isClosable = true,
  }: {
    title: string
    description?: string
    isClosable?: boolean
  }) {
    toast({ title, description, status: 'error', isClosable })
  }

  function success({
    title,
    description = '',
    isClosable = true,
  }: {
    title: string
    description?: string
    isClosable?: boolean
  }) {
    toast({ title, description, status: 'success', isClosable })
  }

  return { error, success }
}
