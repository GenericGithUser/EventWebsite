import { LayoutDashboard } from "lucide-react";
import { QrCode } from "lucide-react";

export default function Toolbar(){
    return (
      <>
        <nav className="toolbar w-[15vw] bg-(--sec-high) h-screen border-r-2 border-amber-200">
          <div className="navCont pt-19">
            <div className="navItem cursor-pointer flex gap-2 p-2 h-[7vh] bg-(--nav-bg) items-center border-t-2  border-cyan-400">
              <LayoutDashboard />{" "}
              <p className="font-medium text-md ">Dashboard</p>
            </div>
            <div className="navItem cursor-pointer flex gap-2 p-2 h-[7vh] bg-(--nav-bg) items-center border-t-2 border-b-2 border-cyan-400">
              <QrCode /> <p className="font-medium text-md ">Scan QR Pass </p>
            </div>
          </div>
        </nav>
      </>
    );
}