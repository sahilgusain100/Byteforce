import React from 'react'
import Navbar from '../components/layout/Navbar'
import Hero from '../components/layout/Hero'
import Footer from '../components/layout/Footer'
import {
  FairOpportunitiesSection,
  FinalCtaSection,
  HowItWorksSection,
  MissionSection,
  RolesSection,
  SkillsSection,
} from '../components/home/HomeSections'

const Home = () => {
  return (
    <>
        <Navbar />
      <main>
        <Hero />
        <RolesSection />
        <SkillsSection />
        <HowItWorksSection />
        <FairOpportunitiesSection />
        <MissionSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </>
  )
}

export default Home