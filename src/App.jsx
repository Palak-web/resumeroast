import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Analyzer from './pages/Analyzer'
import Result from './pages/Result'

export default function App() {
  return (
 <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyze" element={<Analyzer />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </BrowserRouter>
  )
}