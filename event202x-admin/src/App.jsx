import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Landing from "./pages/Landing"
import Scanner from "./pages/Scanner"
import Home from "./pages/Home"
import PrivateRoute from "./components/PrivateRoute"
import PublicRoute from "./components/PublicRoute"
function App() {
  

  return (
    <>
      <div className="cont bg-(--bg-spruce) font-(--font-display) text-(--text-white) w-screen h-screen overflow-x-hidden">
        <Routes>
          <Route element={<PrivateRoute/>}>
            <Route path="/" element={<Landing />}>
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<Home />} />
              <Route path="scan" element={<Scanner />} />
            </Route>
          </Route>

          <Route element={<PublicRoute/> }>
            <Route path="/login" element={<Login/>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace/>} />
        </Routes>
      </div>
    </>
  );
}

export default App
