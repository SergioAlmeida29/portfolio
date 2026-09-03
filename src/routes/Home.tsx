import { About } from '../components/About'
import { Contact } from '../components/Contact'
import { Contributions } from '../components/Contributions'
import { Education } from '../components/Education'
import { Hero } from '../components/Hero'
import { Internships } from '../components/Internships'
import { Projects } from '../components/Projects'
import { Skills } from '../components/Skills'

export function Home() {
  return (
    <>
      <Hero />
      <Internships />
      <Contributions />
      <Projects />
      <Skills />
      <Education />
      <About />
      <Contact />
    </>
  )
}
