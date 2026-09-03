import { About } from '../components/About'
import { Contact } from '../components/Contact'
import { Contributions } from '../components/Contributions'
import { Education } from '../components/Education'
import { Hero } from '../components/Hero'
import { Internships } from '../components/Internships'
import { Projects } from '../components/Projects'
import { Proof } from '../components/Proof'
import { Skills } from '../components/Skills'

/* Ordem por importância: estágios, contribuições, projetos, depois o resto. */
export function Home() {
  return (
    <>
      <Hero />
      <Proof />
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
