import './App.css'
import FilterSection from './components/FilterSection'
import Launches from './components/Launches'
import Navbar from './components/Navbar'
import { LaunchStatusProvider } from './utils/LaunchContext'

function App() {
  

  return (
    <LaunchStatusProvider>
     <Navbar />
     <FilterSection />
     <Launches />
    </LaunchStatusProvider>
  )
}

export default App
