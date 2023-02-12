import { MyHeader } from '@/components/ui/MyHeader'

export type Props = React.PropsWithChildren<{}>

export const Home: React.FC<Props> = ({ children }) => {
  return <MyHeader />
}
