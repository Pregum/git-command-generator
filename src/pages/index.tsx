import { HomePage } from '@/features/home/pages/Home.page'
import { Provider } from 'jotai'

export const App = () => {
  return (
    <Provider>
      <HomePage />
    </Provider>
  )
}

export default App
