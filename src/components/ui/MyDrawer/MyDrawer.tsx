import { useDisclosure, Button, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Input, DrawerFooter } from "@chakra-ui/react";

export type Props = React.PropsWithChildren<{}>;

export const MyDrawer: React.FC<Props> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  // const btnRef = React.useRef()

  return (
    <>
      <Button colorScheme='teal' onClick={onOpen}>
        Open
      </Button>
      <Drawer isOpen={isOpen} placement='left' onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody>
            <Input placeholder='Type here...' />
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue'>Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
};