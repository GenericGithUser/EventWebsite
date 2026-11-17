import { Lock } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

export default function Login(){
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");


    const handleSubmit = async (e) =>{
      e.preventDefault();
      try {
        setError("");
        await login(email, password);

      } catch (err) {
        setError("Failed to Login " + err);
      }
    }

    return (
      <>
        <div className="loginPage flex w-screen h-screen">
          <div className="loginForm bg-(--primary-mint)/35 w-[40vw] border-r-4 border-(--sec-high) shadow-2xl max-[800px]:w-[60vw]  max-[600px]:w-screen max-[600px]:bg-[url(./assets/bg.webp)] bg-cover bg-no-repeat ">
            <h2 className="text-center mt-10 text-3xl font-bold text-amber-200 max-[450px]:text-2xl ">
              Event202X - Admin Page
            </h2>
            <form
              onSubmit={handleSubmit}
              className="mainForm flex flex-col gap-4 mt-10 justify-center items-center w-[30vw] max-[800px]:w-[50vw] max-[600px]:w-[70vw] max-[450px]:w-[80vw] max-[400px]:w-[90vw] min-h-[20vw] m-auto bg-(--sec-high) p-5 border-4 border-(--nav-bg) rounded-xl shadow-md shadow-cyan-300 "
            >
              <Lock size={50} />
              <div className="logItem flex flex-col">
                <label htmlFor="logEmail" className="font-bold">
                  Email:{" "}
                </label>
                <input
                  type="email"
                  name="Email"
                  id="logEmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-green-100 w-[23vw] max-[800px]:w-[40vw] max-[600px]:w-[60vw] max-[400px]:w-[80vw] text-xl text-black p-1.5 border-2 border-green-800 rounded-xl outline-0 transition-all transition-duration-100 focus:border-amber-100"
                  required
                />
              </div>
              <div className="logItem flex flex-col ">
                <label htmlFor="logPassword" className="font-bold">
                  Password:{" "}
                </label>
                <input
                  type="password"
                  name="Password"
                  id="logPassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-green-100 w-[23vw] max-[800px]:w-[40vw] max-[600px]:w-[60vw] max-[400px]:w-[80vw] text-xl text-black p-1.5 border-2 border-green-800 rounded-xl outline-0 transition-all transition-duration-100 focus:border-amber-100"
                  required
                />
              </div>
              <input
                type="submit"
                value="LOGIN"
                className="bg-cyan-500 font-bold text-2xl p-3 w-[23vw] max-[800px]:w-[40vw] max-[600px]:w-[60vw] max-[400px]:w-[80vw] cursor-pointer rounded-xl hover:bg-(--primary-mint) hover:scale-110 active:bg-(--nav-bg) transition-all transition-duration-3"
              />
            </form>
          </div>
          <div className="imageCont w-[60vw] bg-[url(./assets/bg.webp)] bg-cover bg-no-repeat max-[800px]:w-[40vw] max-[800px]:bg-center max-[600px]:hidden"></div>
        </div>
      </>
    );
}