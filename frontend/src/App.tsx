import DashBoard from "./pages/DashBoard"
import Signin from "./pages/SignIn"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Signup from "./pages/Signup"

const App = () => {
  return (
  <BrowserRouter>
  <Routes>
     <Route path="/signin" element={<Signin />}/>
     <Route path="/signup" element={<Signup />}/>
     <Route path="/dashboard" element={<DashBoard />}/>
  </Routes>
  </BrowserRouter>
  )
}

export default App
