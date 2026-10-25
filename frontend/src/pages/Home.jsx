import React from 'react'
import Navbar from '../components/layout/Navbar'
import Hero from '../components/layout/Hero'

const Home = () => {
  return (
    <>
    <section className='bg-background'>
      <Navbar/>
    </section>
    <Hero/>
    </>
  )
}

export default Home