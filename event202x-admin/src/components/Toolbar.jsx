import { LayoutDashboard } from "lucide-react";
import { QrCode } from "lucide-react";
import { NavLink } from "react-router-dom";


export default function Toolbar(){
    return (
      <>
        <nav className="toolbar w-[15vw] bg-(--sec-high) h-screen border-r-2 border-amber-200">
          <div className="navCont pt-19">
            <NavLink
              to={"home"}
              className={({ isActive }) =>
                `${isActive ? "bg-(--sec-high)" : "bg-(--nav-bg)"}
                  navItem cursor-pointer flex gap-2 p-2 h-[7vh] items-center border-t-2  border-cyan-400`
              }
            >
              <LayoutDashboard />{" "}
              <p className="font-medium text-md ">Dashboard</p>
            </NavLink>
            <NavLink
            to={"scan"}
              className={({ isActive }) =>
                `${isActive ? "bg-(--sec-high)" : "bg-(--nav-bg)"}
                  navItem cursor-pointer flex gap-2 p-2 h-[7vh] items-center border-t-2 border-b-2 border-cyan-400`
              }
            >
              <QrCode /> <p className="font-medium text-md ">Scan QR Pass </p>
            </NavLink>
          </div>
        </nav>
      </>
    );
}