import { CommitHistoryImportButton } from '@/components/model/commitHistory/CommitHistoryImportButton'
import { MyHeader } from '@/components/ui/MyHeader'
import { Box, Center, Flex, Grid } from '@chakra-ui/react'
import { CommitHistoryLoader } from '../../model/commitHistory/CommitHistoryLoader/CommitHistoryLoader'
import ReactFlow, {
  ReactFlowProvider,
  useReactFlow,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  EdgeChange,
  NodeChange,
} from 'reactflow'
import { DiagramCanvasDrawArea } from '@/components/model/diagramCanvas/DiagramCanvasDrawArea'
import { useCustomKeybinding as useCustomKeybinding } from '@/components/ui/CustomKeybinding'
import { CSSProperties, useCallback, useState } from 'react'
import { useToast } from '@chakra-ui/react'

export type Props = React.PropsWithChildren<{}>

type Branch = {
  branchName: string
  no: number
  rootNodeId: string
  currentNodeId: string
  latestNodeId: string
}

let nodeId = 0

const initialNodes: Node[] = [
  {
    id: 'i1',
    position: { x: 0, y: 0 },
    data: { label: 'first commit' },
    width: 200,
  },
  {
    id: 'i2',
    position: { x: 0, y: 100 },
    data: { label: 'second commit' },
    width: 200,
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

const initialEdges: Edge[] = [{ id: 'e1-2', source: 'i1', target: 'i2' }]

export const Home: React.FC<Props> = ({ children }) => {
  const [message, setMessage] = useState<string>('')
  const [currentBranch, setCurrentBranch] = useState<Branch>(initialBranches[0])
  const [branches, setBranches] = useState<Branch[]>(initialBranches)
  const [latestNode, setLatestNode] = useState<Node>(
    initialNodes[initialNodes.length - 1]
  )
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const reactFlowInstance = useReactFlow()
  // ref: https://blog.stin.ink/articles/react-hooks-keybind
  // mac???
  useCustomKeybinding({
    key: 'Enter',
    metaKey: true,
    onKeyDown: () => {
      onClickExecute(message)
      setMessage('')
    },
  })

  // windows???
  useCustomKeybinding({
    key: 'Enter',
    altKey: true,
    onKeyDown: () => {
      onClickExecute(message)
      setMessage('')
    },
  })

  const toast = useToast()

  const defaultY = 100
  const defaultX = 0

  const onClickExecute = (message: String) => {
    let parsedMessage = ''
    // const commitRegex = /git\s+commit\s+(?:(?:-m)?\s+)?[\"\'](?<mes>[\w\_\-]+)[\"\']/
    const commitRegex =
      /git\s+commit\s+(?:-m\s+)(?<quote>["'])(?<mes>[\w\_\-\s]+)\k<quote>/
    const checkoutNewBranchRegex =
      /git\s+checkout\s+-b\s+(?<branchName>[\w\_\-]+)/
    const checkoutRegex = /git\s+checkout\s+(?<branchName>[\w\_\-]+)/

    if (message.match(checkoutNewBranchRegex)) {
      const branchName =
        message.match(checkoutNewBranchRegex)?.groups?.branchName ?? ''
      checkoutNewBranchAction(branchName)
    } else if (message.match(checkoutRegex)) {
      const branchName = message.match(checkoutRegex)?.groups?.branchName ?? ''
      checkoutAction(branchName)
    } else if (message.match(commitRegex)) {
      parsedMessage = message.match(commitRegex)?.groups?.mes ?? ''
      commitAction(parsedMessage)
    } else {
      toast({
        title: '???????????????????????????',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }
  }

  const connectEdge = (fromNode: Node, toNode: Node) => {
    const edge: Edge = {
      id: `e${fromNode.id}-${toNode.id}`,
      source: fromNode.id,
      target: toNode.id,
    }
    reactFlowInstance.addEdges(edge)

    toast({
      title: '?????????????????????????????????',
      description: `edge id: ${edge.id}`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
  }

  const commitAction = (parsedMessage: string) => {
    // ?????????????????????????????????
    if (!parsedMessage.length) {
      return
    }

    let lastNode: Node | undefined = latestNode
    let x = defaultX
    let y = defaultY + nodeId * 100
    if (lastNode) {
      // lastNode = nodes[nodes.length - 1]
      // x =
      //   lastNode.position.x +
      //   (currentBranch.no - 1) * ((lastNode.width ?? 0) + 25)
      x = (currentBranch.no - 1) * ((lastNode.width ?? 0) + 25)
      y = lastNode.position.y + 100
    }

    const id = `${++nodeId}`
    const newNode = generateNewNode({
      id,
      x,
      y,
      label: parsedMessage,
      style: { backgroundColor: 'aqua' },
    })

    const rfiNodes = reactFlowInstance.getNodes()
    const foundPreviousLatestNode = rfiNodes.find(
      (node) => node.id == latestNode.id
    )
    if (foundPreviousLatestNode) {
      foundPreviousLatestNode.style = {
        backgroundColor: 'white',
      }
    }
    reactFlowInstance.setNodes(rfiNodes)

    reactFlowInstance.addNodes(newNode)
    if (lastNode) {
      connectEdge(lastNode, newNode)
    }
    reactFlowInstance.fitView({
      minZoom: 0.1,
      nodes: reactFlowInstance.getNodes(),
    })

    setLatestNode(newNode)
    setCurrentBranch((prev) => {
      prev.currentNodeId = newNode.id
      prev.latestNodeId = newNode.id
      return prev
    })
    toast({
      title: '?????????????????????????????????',
      // description: `node id: ${newNode.id}, nodes.length: ${nodes.length}`,
      description: `x: ${x}`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
    toast({
      title: '??????????????????????????????????????????',
      description: `currentBranch: ${JSON.stringify(currentBranch, null, 2)}`,
      status: 'success',
      isClosable: true,
    })
  }

  const checkoutAction = (branchName: string) => {
    if (!branchName.length) {
      toast({
        title: '???????????????????????????',
        status: 'error',
        isClosable: true,
      })
      return
    }

    const foundBranch = branches.find(
      (branch) => branch.branchName == branchName
    )
    if (!foundBranch) {
      toast({
        title: '?????????????????????????????????????????????',
        description: `branchName: ${branchName}`,
        status: 'error',
        isClosable: true,
      })
      return
    }

    // ?????????node??????????????????

    setCurrentBranch(foundBranch)
    const rfiNodes = reactFlowInstance.getNodes()
    const foundPreviousLatestNode = rfiNodes.find(
      (node) => node.id == latestNode.id
    )
    if (foundPreviousLatestNode) {
      foundPreviousLatestNode.style = {
        backgroundColor: 'white',
      }
    }
    const foundNextLatestNode = rfiNodes.find(
      (node) => node.id == foundBranch.currentNodeId
    )
    if (foundNextLatestNode) {
      foundNextLatestNode.style = {
        backgroundColor: 'aqua',
      }
      setLatestNode(foundNextLatestNode)
    }
    reactFlowInstance.setNodes(rfiNodes)

    toast({
      title: '???????????????checkout????????????',
      description: `???????????????: ${branchName}, latestNode: ${foundNextLatestNode?.id}`,
      status: 'success',
      isClosable: true,
    })
  }

  const checkoutNewBranchAction = (branchName: string) => {
    // ?????????????????????????????????
    if (!branchName.length) {
      toast({
        title: '???????????????????????????',
        status: 'error',
        isClosable: true,
      })
      return
    }

    const foundBranch = branches.find(
      (branch) => branch.branchName == branchName
    )
    if (foundBranch) {
      toast({
        title: '?????????????????????????????????????????????',
        description: `branchName: ${branchName}`,
        status: 'error',
        isClosable: true,
      })
      return
    }

    // ??????????????????????????????????????????node??????????????????????????????
    let lastNode: Partial<Node> = latestNode
    if (!lastNode) {
      toast({
        title: '???????????????????????????????????????????????????',
        status: 'error',
        isClosable: true,
      })
      return
    }

    // ????????????????????????
    const newBranch: Branch = {
      branchName: branchName,
      no: branches.length + 1,
      rootNodeId: latestNode.id,
      currentNodeId: latestNode.id,
      latestNodeId: latestNode.id,
    }

    setBranches((prev) => {
      prev.push(newBranch)
      return prev
    })

    setCurrentBranch(newBranch)

    toast({
      title: '???????????????checkout????????????',
      description: `????????????????????????: ${branchName}`,
      status: 'success',
      isClosable: true,
    })
  }

  const generateNewNode = ({
    id,
    x,
    y,
    label,
    style,
  }: {
    id?: string
    x: number
    y: number
    label: string
    style?: CSSProperties
  }) => {
    const newNode: Node<any, string | undefined> = {
      id: id ?? `${++nodeId}`,
      position: {
        x: x,
        y: y,
      },
      data: {
        label: label,
      },
      width: 200,
      style,
    }

    return newNode
  }

  return (
    <Flex direction='column' h='100vh'>
      <MyHeader />

      <Flex direction='row' h='100%'>
        <Grid flex={2} maxW='300px' h='100%'>
          <CommitHistoryLoader
            onClickExecute={onClickExecute}
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
              onEdgesChange={onEdgesChange}
              onNodesChange={onNodesChange}
            />
          </Box>
        </Grid>
      </Flex>
    </Flex>
  )
}

export default Home
