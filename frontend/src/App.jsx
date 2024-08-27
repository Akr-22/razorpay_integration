import { useState } from 'react'
import './App.css'
import RazorpayPayment from './components/RazorpayPayment'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <RazorpayPayment/>
    </>
  )
}

export default App
