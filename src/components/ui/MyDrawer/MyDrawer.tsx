import { useDisclosure, Button, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Input, DrawerFooter } from "@chakra-ui/react";

export type Props = React.PropsWithChildren<{ isOpen: boolean; onClose: () => void; }>;

export const MyDrawer: React.FC<Props> = ({ isOpen, onClose, children }) => {

  return (
    <>
      <Drawer isOpen={isOpen} placement='left' onClose={onClose} > 
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>メニュー</DrawerHeader>

          <DrawerBody>
            <Input placeholder='検索ワードを入力...' />
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