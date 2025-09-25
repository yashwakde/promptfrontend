import React from 'react'
import Navbar from './components/Navbar'
import Mainroutes from './routes/Mainroutes'

const App = () => {
  return (
    <div className='  bg-linear-to-b from-black via-gray-500 to-yellow-500 text-white min-h-screen font-[gil]'>
      <Navbar/>
      <Mainroutes/>
    </div>
  )
}

export default App
