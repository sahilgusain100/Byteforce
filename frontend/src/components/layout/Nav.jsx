import React from 'react'
import { Button } from '../ui/Button'


const Nav = () => {
  return (
    <>
    <nav className='bg-primary h-18 text-white flex items-center justify-center gap-5 font-sans'>

        <a>Find Artisans</a>
        <a>Story of Art</a>
        <a>Learn Skills</a>
        <a>About Us</a>
        <label htmlFor="language">Language:</label>
        <select name="language" id="language" className='bg-primary text-white border-none outline-none'>
          <option defaultChecked value="en">English</option>
          <option value="pun">Punjabi</option>
          <option value="hin">Hindi</option>
        </select>
        <Button >Signup</Button>
        <Button >login</Button>
</nav>
    </>
  )
}

export default Nav