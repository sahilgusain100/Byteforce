import React from 'react'
import Nav from './nav'

const Navbar = () => {
  return (
    <div className='bg-primary h-18  px-12 font-serif text-white flex items-center justify-between'>
      <h1 className='text-3xl font-semibold '>Skillbridge</h1>
      <Nav/>
    </div>
  )
}

export default Navbar