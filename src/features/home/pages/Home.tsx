import { MyHeader } from '@/components/layouts/MyHeader'
import { Box, Flex, Grid, useDisclosure } from '@chakra-ui/react'
import { CommitHistoryLoader } from '@/features/home/components/CommitHistoryLoader/CommitHistoryLoader'
import {
  useReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  EdgeChange,
  NodeChange,
} from 'reactflow'
import { DiagramCanvasDrawArea } from '@/features/home/components/DiagramCanvasDrawArea'
import { useCallback, useState } from 'react'
import { useToast } from '@chakra-ui/react'
import isNodePositionChange from '../utils/isNodePositionChange'
import useCommitAction from '../hooks/useCommitAction'
import useCheckoutNewAction from '../hooks/useCheckoutNewAction'
import useCheckoutAction from '../hooks/useCheckoutAction'
import { branchesAtom, currentBranchAtom, latestNodeAtom } from '../stores/atom'
import { useAtom } from 'jotai'
import { initialEdges, initialNodes } from '../const/constants'
import useMergeAction from '../hooks/useMergeAction'
import { useCustomKeybinding } from '../../../components/layouts/CustomKeybinding/CustomKeybinding'
import { CommandHelpModal } from '../components/CommandHelpModal'
import useResetAction from '../hooks/useResetAction'
import usePushAction from '../hooks/usePushAction'

export type Props = React.PropsWithChildren<{}>

export const Home: React.FC<Props> = ({}) => {
  const [message, setMessage] = useState<string>('')
  const [currentBranch, setCurrentBranch] = useAtom(currentBranchAtom)
  const [branches, setBranches] = useAtom(branchesAtom)
  const [latestNode, setLatestNode] = useAtom(latestNodeAtom)
  const [nodes, _, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    commitAction: myCommitAction,
    matchCommitPattern,
    parseCommitInput,
  } = useCommitAction({
    latestNode,
    setLatestNode,
    currentBranch,
    setCurrentBranch,
  })
  const {
    checkoutNewBranchAction,
    matchCheckoutNewAction,
    parseCheckoutNewAction,
  } = useCheckoutNewAction({
    branches,
    setBranches,
    latestNode,
    setCurrentBranch,
  })
  const { checkoutAction, matchCheckoutAction, parseCheckoutAction } =
    useCheckoutAction({
      branches,
      setCurrentBranch,
      latestNode,
      setLatestNode,
    })

  const { mergeAction, matchMergeAction, parseMergeAction } = useMergeAction()
  const { resetAction, matchResetAction, parseResetAction } = useResetAction({})
  const { pushAction, matchPushAction, prasePushAction } = usePushAction()

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const reactFlowInstance = useReactFlow()
  // ref: https://blog.stin.ink/articles/react-hooks-keybind
  // // mac用
  // useCustomKeybinding({
  //   key: 'Enter',
  //   metaKey: true,
  //   onKeyDown: () => {
  //     onClickExecute(message)
  //     setMessage('')
  //   },
  // })

  // // windows用
  // useCustomKeybinding({
  //   key: 'Enter',
  //   altKey: true,
  //   onKeyDown: () => {
  //     onClickExecute(message)
  //     setMessage('')
  //   },
  // // })

  const toast = useToast()

  useCustomKeybinding({
    key: '/',
    metaKey: true,
    onKeyDown: onOpen, // () => { toast({ title: 'show help!', }) },
  })

  useCustomKeybinding({
    key: '/',
    altKey: true,
    onKeyDown: onOpen, // () => { toast({ title: 'show help!', }) },
  })

  const onClickExecute = (message: string) => {
    if (matchCheckoutNewAction(message)) {
      checkoutNewBranchAction(parseCheckoutNewAction(message))
    } else if (matchCheckoutAction(message)) {
      checkoutAction(parseCheckoutAction(message))
    } else if (matchCommitPattern(message)) {
      myCommitAction(parseCommitInput(message))
    } else if (matchMergeAction(message)) {
      mergeAction(parseMergeAction(message))
    } else if (matchResetAction(message)) {
      resetAction(parseResetAction(message))
    } else if (matchPushAction(message)) {
      pushAction(prasePushAction(message))
    } else {
      toast({
        title: 'コマンドが不正です',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }
  }

  return (
    <>
      <CommandHelpModal isOpen={isOpen} onClose={onClose} />
      <Flex direction='column' h='100vh'>
        <MyHeader onClickHelpButton={onOpen} />

        <Flex direction='row' h='100%'>
          <Grid flex={3} maxW='600px' h='100%'>
            <CommitHistoryLoader
              onClickExecute={(str) => {
                onClickExecute(str)
                setMessage('')
              }}
              message={message}
              onChangedMessage={(newMessage) => setMessage(newMessage)}
            />
          </Grid>

          <Grid flex={4}>
            <Box bg='orange.50' h='100%'>
              <DiagramCanvasDrawArea
                reactFlowInstance={reactFlowInstance}
                edges={edges}
                nodes={nodes}
                onConnect={onConnect}
                onEdgesChange={(e: EdgeChange[]) => onEdgesChange(e)}
                onNodesChange={(e: NodeChange[]) => {
                  const ret = e.filter((node) => !isNodePositionChange(node))
                  onNodesChange(ret)
                }}
              />
            </Box>
          </Grid>
        </Flex>
      </Flex>
    </>
  )
}

export default Home
