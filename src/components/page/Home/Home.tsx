import { MyDrawer } from '@/components/ui/MyDrawer'

export type Props = React.PropsWithChildren<{}>

export const Home: React.FC<Props> = ({ children }) => {
  return <div>{<MyDrawer />}</div>
}
