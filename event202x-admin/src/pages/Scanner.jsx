import AttendeeDialog from "../components/AttendeeDialog";
import { useState } from "react";
import QrReader from "../components/QrReader";
import { QrCode, Home } from "lucide-react";
import { checkInFromQr } from "../lib/helpers";
import toast, {Toaster} from "react-hot-toast"
import { Link } from "react-router-dom";

export default function Scanner(){
    const [data, setData] = useState(null);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState(null);
    const [dialogMess, setDialogMess] = useState("");

     const openDialog = (data) => {
       setDialogData(data);
       setIsDialogOpen(true);
     };

     const closeDialog = (message) => {
       setIsDialogOpen(false);
       setDialogData(null);
       
       if (message) {
         toast.success("Successfully Marked");
       }
     };

    const handleResult = async (qrData) =>{
        setData(qrData);
        const actualData = await checkInFromQr(qrData);

        openDialog(actualData);
        setReady(false);
        
    }

    return (
      <>
        <div className="scan mt-15 p-4 w-[85vw] max-[700px]:w-screen max-[400px]:p-0">
          <h1 className="text-3xl font-bold text-center text-amber-100 mb-2">
            Scan QR Passes
          </h1>

          <div className="scannerCont flex justify-center">
            {ready === false ? (
              <>
                <div className="qrNotReady mt-10 flex flex-col items-center justify-center">
                  <div className="qrPlaceholder w-50 h-50 bg-amber-200 flex items-center justify-center rounded">
                    <QrCode size={150} className="text-amber-950" />
                  </div>
                  <p className="mt-10 mb-10">
                    When Ready, press the Scan Button to initiate a Scan
                  </p>
                  <button
                    type="button"
                    className="p-1 text-4xl bg-(--primary-mint) w-50 font-bold rounded-xl cursor-pointer transition-all transition-duration-3 hover:bg-amber-200 hover:scale-105"
                    onClick={() => setReady(true)}
                  >
                    Scan
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="qrReady mt-10 flex flex-col items-center justify-center">
                  <QrReader onResult={handleResult} />
                  <p className="mb-10">Point Directly at QR Code Pass</p>
                  <button
                    type="button"
                    className="p-1 text-4xl bg-red-400 w-50 font-bold rounded-xl cursor-pointer transition-all transition-duration-3 hover:bg-amber-200 hover:scale-105"
                    onClick={() => setReady(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
          <Link
            to={"/home"}
            className="scanBtn absolute bottom-5 right-5 bg-amber-900 p-1 rounded-4xl min-[700px]:hidden "
            replace
          >
            <Home size={40} />
          </Link>
        </div>
        <AttendeeDialog
          isOpen={isDialogOpen}
          close={closeDialog}
          data={dialogData}
        />
        <Toaster
          toastOptions={{
            style: {
              background: "#91baa6",
              color: "#ECFDF5",
            },
          }}
        />
      </>
    );
}