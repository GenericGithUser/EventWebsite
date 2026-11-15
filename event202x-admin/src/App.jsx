import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Landing from "./pages/Landing"
import Home from "./pages/Home"
function App() {
  

  return (
    <>
      <div className="cont bg-(--bg-spruce) font-(--font-display) text-(--text-white) w-screen h-screen overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Landing/>}>
            <Route index element={<Navigate to="home" replace/>}/>
            <Route path="home" element={<Home/>}/>
          </Route>
          
        </Routes>
      </div>
    </>
  )
}

export default App
