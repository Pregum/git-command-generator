import { MyHeader } from '@/components/layouts/MyHeader'
import { Box, Flex, Grid } from '@chakra-ui/react'
import { CommitHistoryLoader } from '@/features/home/components/CommitHistoryLoader/CommitHistoryLoader'
import {
  useReactFlow,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  EdgeChange,
  NodeChange,
} from 'reactflow'
import { DiagramCanvasDrawArea } from '@/features/home/components/DiagramCanvasDrawArea'
import { useCallback, useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { Branch } from '../types/branch'
import useConnectEdge from '../hooks/useConnectEdge'
import createBranchNode from '../utils/createBranchNode'
import { BranchNode } from '../types/branchNode'
import useMyNode from '../hooks/useMyNode'
import isNodePositionChange from '../utils/isNodePositionChange'
import useCommitAction from '../hooks/useCommitAction'
import useCheckoutNewAction from '../hooks/useCheckoutNewAction'
import useCheckoutAction from '../hooks/useCheckoutAction'

const NODE_WIDTH = 150
const BRANCH_Y = -100
const BRANCH_WIDTH = 60
const BRANCH_UNIT_LEFT_MARGIN = (NODE_WIDTH - BRANCH_WIDTH) / 2
const SEPARATE_UNIT_X = 25

export type Props = React.PropsWithChildren<{}>

let nodeId = 0

const MAIN_BRANCH_ID = 'main'

const initialNodes: Node<BranchNode>[] = [
  createBranchNode(
    MAIN_BRANCH_ID,
    { x: BRANCH_UNIT_LEFT_MARGIN, y: BRANCH_Y },
    'main'
  ),
  {
    id: 'i1',
    position: { x: 0, y: 0 },
    data: { label: 'first commit', branchId: MAIN_BRANCH_ID },
    width: NODE_WIDTH,
  },
  {
    id: 'i2',
    position: { x: 0, y: 100 },
    data: { label: 'second commit', branchId: MAIN_BRANCH_ID },
    width: NODE_WIDTH,
    style: {
      backgroundColor: 'aqua',
    },
  },
]

const initialBranches: Branch[] = [
  {
    branchName: 'main',
    no: 1,
    rootNodeId: initialNodes[initialNodes.length - 1].id,
    currentNodeId: initialNodes[initialNodes.length - 1].id,
    latestNodeId: initialNodes[initialNodes.length - 1].id,
  },
]

const initialEdges: Edge[] = [
  { id: 'emain-1', source: MAIN_BRANCH_ID, target: 'i1' },
  { id: 'e1-2', source: 'i1', target: 'i2' },
]

export const Home: React.FC<Props> = ({}) => {
  const [message, setMessage] = useState<string>('')
  const [currentBranch, setCurrentBranch] = useState<Branch>(initialBranches[0])
  const [branches, setBranches] = useState<Branch[]>(initialBranches)
  const [latestNode, setLatestNode] = useState<Node>(
    initialNodes[initialNodes.length - 1]
  )
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
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

  const onClickExecute = (message: string) => {
    if (matchCheckoutNewAction(message)) {
      checkoutNewBranchAction(parseCheckoutNewAction(message))
    } else if (matchCheckoutAction(message)) {
      checkoutAction(parseCheckoutAction(message))
    } else if (matchCommitPattern(message)) {
      myCommitAction(parseCommitInput(message))
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
    <Flex direction='column' h='100vh'>
      <MyHeader />

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

        {/* <Grid flex={1} h='100%' borderRadius='100%'>
          <CommitHistoryImportButton />
        </Grid> */}

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
  )
}

export default Home
