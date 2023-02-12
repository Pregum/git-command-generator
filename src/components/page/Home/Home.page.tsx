import { Suspense } from 'react';
import { Home } from './Home'

export const HomePage = () => {
  return (
    <Suspense fallback={<div> loading... </div>}>
      <Home />
    </Suspense>
  )
};