import {
  HamburgerIcon,
  InfoIcon,
  QuestionIcon,
  RepeatClockIcon,
  SettingsIcon,
  SunIcon,
} from '@chakra-ui/icons'
import {
  Box,
  Button,
  Center,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Input,
  MenuIcon,
  Spacer,
  Square,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { MyDrawer } from '../MyDrawer'

export type Props = React.PropsWithChildren<{}>

export const MyHeader: React.FC<Props> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Flex direction='column' h='100vh'>
      <Box bg='blackAlpha.100' w='100%' h='40px' color='white'>
        <HStack spacing={0}>
          <Square size={'40px'}>
            <>
              <IconButton
                borderRadius={0}
                colorScheme='teal'
                aria-label='menu'
                size='md'
                icon={<HamburgerIcon />}
                onClick={onOpen}
              />
              <MyDrawer isOpen={isOpen} onClose={onClose} />
            </>
          </Square>
          <Square size={'40px'}>
            <IconButton
              borderRadius={0}
              colorScheme='teal'
              aria-label='menu'
              size='md'
              icon={<SunIcon />}
            />
          </Square>
          <Square size={'40px'}>
            <IconButton
              borderRadius={0}
              colorScheme='teal'
              aria-label='menu'
              size='md'
              icon={<QuestionIcon />}
            />
          </Square>
          <Square size={'40px'}>
            <IconButton
              borderRadius={0}
              colorScheme='teal'
              aria-label='menu'
              size='md'
              icon={<RepeatClockIcon />}
            />
          </Square>
          <Spacer />
          <Square size={'40px'}>
            <IconButton
              borderRadius={0}
              colorScheme='teal'
              aria-label='menu'
              size='md'
              icon={<SettingsIcon />}
            />
          </Square>
        </HStack>
      </Box>
      <Box bg='orange.50' h='100%'>
        hoge
      </Box>
    </Flex>
  )
}
