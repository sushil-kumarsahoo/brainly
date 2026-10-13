import { Button } from './components/ui/Button'
import PlusIcon from './icons/PlusIcon'
import ShareIcon from './icons/ShareIcon'

function App() {
  return (
    <>
      <Button startIcon={<PlusIcon size='md'/>} variant="primary" size="sm" text="Share" onClick={() => console.log("primary clicked")} />
      <Button startIcon={<ShareIcon/>} variant="secondary" size="md" text="Share" onClick={() => console.log("secondary clicked")} />
      <Button variant="primary" size="lg" text="Share" onClick={() => console.log("secondary clicked")} />
    </>
  )
}

export default App