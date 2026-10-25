import React from 'react'
import Navbar from '../components/layout/Navbar'
import Hero from '../components/layout/Hero'
import {
  FairOpportunitiesSection,
  FinalCtaSection,
  Footer,
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