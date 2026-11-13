import Landing from "./pages/Landing";
import Form from "./pages/Form";
import Details from "./pages/Details";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
      <div className="cont bg-(--bg-spruce) font-(--font-display) text-(--text-white) w-screen h-screen overflow-x-hidden">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing/>}/>
            <Route path="/sign-up" element={<Form/>}/>
            <Route path="/details" element={<Details/>}/>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App