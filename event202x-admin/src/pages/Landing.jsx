import { LogOut } from "lucide-react";
import Toolbar from "../components/Toolbar";
import { Outlet } from "react-router-dom";

export default function Landing(){
    return (
      <>
        <div className="header flex justify-between p-3 bg-(--nav-bg) items-center border-b-4 border-amber-200 absolute w-screen">
          <h2 className="font-bold text-xl ">Event 202X - Admin Page</h2>
          <LogOut
            size={40}
            className="bg-red-400 p-2 rounded-xl cursor-pointer"
          />
        </div>
        <div className="mainCont flex">
          <Toolbar />
          <Outlet />
        </div>
      </>
    );
}