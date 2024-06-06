import React from 'react'
import logo from '../assets/logo.png'
function Navbar() {
  return (
    <header className='flex justify-center shadow-lg'>
        <img src={logo} alt='logo'/>
    </header>
  )
}

export default Navbar