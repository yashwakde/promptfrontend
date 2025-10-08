import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Profile from '../pages/Profile'
import Allprompts from '../pages/Allprompts'
import Create from '../pages/Create'
import Myprompt from '../pages/Myprompt'

const Mainroutes = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
    <Route path='/register' element={<Register/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/allprompts' element={<Allprompts/>}/>
        <Route path='/create' element={<Create/>}/>
        <Route path='/myprompts' element={<Myprompt/>}/>
      </Routes>
    </div>
  )
}

export default Mainroutes
