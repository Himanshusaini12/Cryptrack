import { useState } from 'react'
import './App.css'
import TotalData from './component/TotalData'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <TotalData/>
    </>
  )
}

export default App
