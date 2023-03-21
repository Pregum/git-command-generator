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
  NodePositionChange,
} from 'reactflow'
import { DiagramCanvasDrawArea } from '@/features/home/components/DiagramCanvasDrawArea'
import { CSSProperties, useCallback, useState } from 'react'
import { useToast } from '@chakra-ui/react'
import * as crypto from 'crypto'
import { Revision } from '../types/revision'
import { Branch } from '../types/branch'
import useConnectEdge from '../hooks/useConnectEdge'
import createBranchNode from '../utils/createBranchNode'
import { BranchNode } from '../types/branchNode'
import sha1 from '../utils/sha1'
import useMyNode from '../hooks/useMyNode'

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

function isNodePositionChange(arg: any): arg is NodePositionChange {
  return arg.position !== undefined
}

export const Home: React.FC<Props> = ({ children }) => {
  const [message, setMessage] = useState<string>('')
  const [currentBranch, setCurrentBranch] = useState<Branch>(initialBranches[0])
  const [branches, setBranches] = useState<Branch[]>(initialBranches)
  const [latestNode, setLatestNode] = useState<Node>(
    initialNodes[initialNodes.length - 1]
  )
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const { connectEdge: myConnectEdge } = useConnectEdge()
  const { createNode } = useMyNode()

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
        title: 'コマンドが不正です',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }
  }

  const commitAction = (parsedMessage: string) => {
    // 空文字の場合は処理終了
    if (!parsedMessage.length) {
      return
    }

    let lastNode: Node | undefined = latestNode
    let x = defaultX
    let y = defaultY + nodeId * 100
    if (lastNode) {
      const branchIndex = currentBranch.no - 1
      x = branchIndex * (lastNode.width ?? 0) + branchIndex * 25
      y = lastNode.position.y + 100
    }

    const id = `${++nodeId}`
    const newNode = createNode({
      id,
      x,
      y,
      label: parsedMessage,
      branchId: currentBranch.branchName,
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
      myConnectEdge(lastNode, newNode)
    }
    // 現在のブランチから初めてのコミットの場合は、ブランチノードから線を伸ばす
    const lastNodeOfCurrentBranch = [...rfiNodes].find(
      (e) => e.data?.branchId == currentBranch.branchName
    )
    const currentBranchNode = [...rfiNodes, newNode].find(
      (e) => e.id == currentBranch.branchName
    )
    if (!lastNodeOfCurrentBranch && currentBranchNode) {
      myConnectEdge(currentBranchNode, newNode)
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
      title: 'ノードを追加しました。',
      description: `x: ${x}`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
    toast({
      title: 'ブランチ情報を更新しました。',
      description: `currentBranch: ${JSON.stringify(currentBranch, null, 2)}`,
      status: 'success',
      isClosable: true,
    })
  }

  const checkoutAction = (branchName: string) => {
    if (!branchName.length) {
      toast({
        title: 'ブランチ名が空です',
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
        title: '該当するブランチが存在しません',
        description: `branchName: ${branchName}`,
        status: 'error',
        isClosable: true,
      })
      return
    }

    // 対象のnodeの色を替える

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
    const branchNodes = rfiNodes.filter((e) =>
      branches.some((branch) => branch.branchName == e.id)
    )
    branchNodes.forEach((branchNode) => {
      if (branchNode.id == branchName) {
        branchNode.style = {
          ...branchNode.style,
          backgroundColor: 'aqua',
        }
      } else {
        branchNode.style = {
          ...branchNode.style,
          backgroundColor: 'white',
        }
      }
    })

    reactFlowInstance.setNodes(rfiNodes)

    toast({
      title: 'ブランチをcheckoutしました',
      description: `ブランチ名: ${branchName}, latestNode: ${foundNextLatestNode?.id}`,
      status: 'success',
      isClosable: true,
    })
  }

  const checkoutNewBranchAction = (branchName: string) => {
    // 空文字の場合は処理終了
    if (!branchName.length) {
      toast({
        title: 'ブランチ名が空です',
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
        title: '同名のブランチが存在しています',
        description: `branchName: ${branchName}`,
        status: 'error',
        isClosable: true,
      })
      return
    }

    // 新しいブランチの場合は右側にnodeを作成する処理を実装
    let lastNode: Partial<Node> = latestNode
    if (!lastNode) {
      toast({
        title: 'コミット情報が取得できませんでした',
        status: 'error',
        isClosable: true,
      })
      return
    }

    const branchLengthWithoutNewBranch = branches.length

    // ここで横にずらす
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

    // ここでbranchのnodeを作成する。
    const position = {
      x:
        branchLengthWithoutNewBranch * NODE_WIDTH +
        BRANCH_UNIT_LEFT_MARGIN +
        branchLengthWithoutNewBranch * SEPARATE_UNIT_X,
      y: BRANCH_Y,
    }
    const newBranchNode = createBranchNode(
      newBranch.branchName,
      position,
      branchName
    )
    newBranchNode.style = {
      ...newBranchNode.style,
      backgroundColor: 'aqua',
    }
    reactFlowInstance.addNodes(newBranchNode)

    // ブランチの色を変える
    const rfiNodes = reactFlowInstance.getNodes()
    const foundBranchNodes = rfiNodes.filter((node) =>
      branches.some((b) => b.branchName == node.id)
    )
    foundBranchNodes.forEach((branch) => {
      branch.style = {
        ...branch.style,
        backgroundColor: 'white',
      }
    })
    reactFlowInstance.setNodes(rfiNodes)
    reactFlowInstance.addNodes(newBranchNode)

    toast({
      title: 'ブランチをcheckoutしました',
      description: `新しいブランチ名: ${branchName}`,
      status: 'success',
      isClosable: true,
    })
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
