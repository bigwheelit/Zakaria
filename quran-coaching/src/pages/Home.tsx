import { Hero } from '../components/marketing/Hero'
import { HowItWorks } from '../components/marketing/HowItWorks'
import { ProgramOverview } from '../components/marketing/ProgramOverview'
import { TutorBio } from '../components/marketing/TutorBio'
import { FAQ } from '../components/marketing/FAQ'

export function Home() {
    return (
        <div>
            <Hero />
            <HowItWorks />
            <ProgramOverview />
            <TutorBio />
            <FAQ />
        </div>
    )
}
