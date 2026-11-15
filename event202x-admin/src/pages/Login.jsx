import { Lock } from "lucide-react";

export default function Login(){
    return (
      <>
        <div className="loginPage flex w-screen h-screen">
          <div className="loginForm bg-(--primary-mint)/35 w-[40vw] border-r-4 border-(--sec-high) shadow-2xl ">

            <h2 className="text-center mt-10 text-3xl font-bold text-amber-200">
              Event202X - Admin Page
            </h2>
            <form
              action=""
              className="mainForm flex flex-col gap-4 mt-10 justify-center items-center w-[30vw] min-h-[20vw] m-auto bg-(--sec-high) p-5 border-4 border-(--nav-bg) rounded-xl shadow-md shadow-cyan-300"
            >
                <Lock size={50}/>
              <div className="logItem flex flex-col">
                <label htmlFor="logEmail" className="font-bold">Email: </label>
                <input
                  type="email"
                  name="Email"
                  id="logEmail"
                  className="bg-green-100 w-[23vw] text-xl text-black p-1.5 border-2 border-green-800 rounded-xl outline-0 transition-all transition-duration-100 focus:border-amber-100"
                />
              </div>
              <div className="logItem flex flex-col ">
                <label htmlFor="logPassword" className="font-bold">Password: </label>
                <input
                  type="password"
                  name="Password"
                  id="logPassword"
                  className="bg-green-100 w-[23vw] text-xl text-black p-1.5 border-2 border-green-800 rounded-xl outline-0 transition-all transition-duration-100 focus:border-amber-100"
                />
              </div>
              <input type="submit" value="LOGIN" className="bg-cyan-500 font-bold text-2xl p-3 w-[23vw] cursor-pointer rounded-xl hover:bg-(--primary-mint) hover:scale-110 active:bg-(--nav-bg) transition-all transition-duration-3"/>
            </form>
          </div>
          <div className="imageCont w-[60vw] bg-[url(./assets/bg.webp)] bg-cover bg-no-repeat"></div>
        </div>
      </>
    );
}