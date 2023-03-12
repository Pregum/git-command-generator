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
import { useCallback, useState } from 'react'
import { useToast } from '@chakra-ui/react'

export type Props = React.PropsWithChildren<{}>

let nodeId = 0

const initialNodes: Node[] = [
  { id: 'i1', position: { x: 0, y: 0 }, data: { label: 'first commit' } },
  { id: 'i2', position: { x: 0, y: 100 }, data: { label: 'second commit' } },
]

const initialEdges: Edge[] = [{ id: 'e1-2', source: 'i1', target: 'i2' }]

export const Home: React.FC<Props> = ({ children }) => {
  const [message, setMessage] = useState<string>('')
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
  // mac用
  useCustomKeybinding({
    key: 'Enter',
    metaKey: true,
    onKeyDown: () => {
      onClickExecute(message)
      setMessage('')
    },
  })

  // windows用
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
    const commitRegex = /git\s+commit\s+(?:-m\s+)(?<quote>["'])(?<mes>[\w\_\-\s]+)\k<quote>/
    const checkoutRegex = /git\s+checkout\s+(?<branchName>[\w\_\-]+)/
    // if(message.startsWith('git commit -m')) {

    if (message.match(checkoutRegex)) {
      // TODO: checkoutを実行できる処理を記述する
    } else if (message.match(commitRegex)) {
      parsedMessage = message.match(commitRegex)?.groups?.mes ?? ''
    } else {
      toast({
        title: 'コマンドが不正です',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    // 空文字の場合は処理終了
    if (!parsedMessage.length) {
      return
    }

    // const nodes = reactFlowInstance.getNodes()
    // console.log(` nodes: ${JSON.stringify(nodes, undefined, 2)}`)
    // console.log(`nodes[0]: ${JSON.stringify(nodes[0], undefined, 2)}`)

    let lastNode: Node | undefined = latestNode
    let x = defaultX
    let y = defaultY + nodeId * 100
    if (lastNode) {
      // lastNode = nodes[nodes.length - 1]
      x = lastNode.position.x
      y = lastNode.position.y + 100
    }

    const id = `${++nodeId}`
    const newNode: Node<any, string | undefined> = {
      id,
      position: {
        x: x,
        y: y,
      },
      data: {
        label: parsedMessage,
      },
    }
    reactFlowInstance.addNodes(newNode)
    // setNodes((prev) => {
    //   prev.push(newNode)
    //   return prev
    // })
    if (lastNode) {
      connectEdge(lastNode, newNode)
    }
    reactFlowInstance.fitView({ minZoom: 0.5, nodes: nodes })

    setLatestNode(newNode)
    toast({
      title: 'ノードを追加しました。',
      description: `node id: ${newNode.id}, nodes.length: ${nodes.length}`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
  }

  const connectEdge = (fromNode: Node, toNode: Node) => {
    const edge: Edge = {
      id: `e${fromNode.id}-${toNode.id}`,
      source: fromNode.id,
      target: toNode.id,
    }
    reactFlowInstance.addEdges(edge)
    // setEdges((prev) => {
    //   prev.push(edge)
    //   return prev
    // })

    toast({
      title: 'エッジを追加しました。',
      description: `edge id: ${edge.id}`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
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
