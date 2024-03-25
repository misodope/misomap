import { Suspense } from 'react'
import { myStyle } from './app.css'
import { Map } from '@/components/Map/Map'

export default function Home() {
  return (
    <main className={myStyle}>
      <Suspense fallback={<div>Loading...</div>}>
        <Map />
      </Suspense>
    </main>
  )
}
