import React from 'react'
import { Button } from '../ui/Button'
import { Link } from 'react-router-dom'


const Nav = ({ variant = 'home' }) => {
  if (variant === 'marketplace') {
    return (
      <nav
        aria-label="Marketplace navigation"
        className="flex flex-wrap items-center gap-x-5 gap-y-3 font-sans text-sm"
      >
        <a
          className="rounded-sm text-white/85 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          href="#products"
        >
          Browse products
        </a>
        <Link
          className="rounded-sm text-white/85 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          to="/#roles"
        >
          For artisans
        </Link>
        <Link
          className="rounded-lg border border-white/60 px-4 py-2 font-semibold text-white transition hover:bg-white hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          to="/"
        >
          Back to home
        </Link>
      </nav>
    )
  }

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