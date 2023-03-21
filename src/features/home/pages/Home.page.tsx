import { Suspense } from 'react'
import { ReactFlowProvider } from 'reactflow'
import { Home } from './Home'

export const HomePage = () => {
  return (
    <Suspense fallback={<div> loading... </div>}>
      <ReactFlowProvider>
        <Home />
      </ReactFlowProvider>
    </Suspense>
  )
}
