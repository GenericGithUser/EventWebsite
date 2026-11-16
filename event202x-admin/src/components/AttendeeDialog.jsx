import { useRef, useState, useEffect } from "react";
import { CheckCircle2, XCircle, User, Calendar, Mail, XSquare } from "lucide-react";
import { updateAttendance } from "../lib/helpers";


export default function AttendeeDialog({ isOpen, close, data }) {
  const dialogRef = useRef(null);
  


  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;
    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen, data]);

  // Ensure the component still renders when `isOpen` is true so the
  // `dialogRef` can attach and `showModal()` can be called even if the
  // `data` prop arrives slightly after `isOpen` (state updates are async).
//   if (!data && !isOpen) return null;
  if (!isOpen) return null;

  const markAs = async (attendance) =>{
    const result = updateAttendance(attendance, data?.Email);

    if (result === "success") {
      close("Successfully Marked as Attended");
    } else {
      close(result);
    }
    close();
  }

  return (
    <>
      <dialog
        className="w-[30vw] h-[25vw] bg-(--bg-spruce) border-2 border-(--sec-high) text-(--text-white) m-auto rounded-lg p-6 shadow-md shadow-cyan-400"
        ref={dialogRef}
      >
        <XSquare className="ml-auto cursor-pointer" onClick={() => close()} />
        <h2 className="text-center text-2xl font-bold">Attendee Details</h2>

        <div className="moreDetails flex gap-2 justify-center mt-3">
          <p className="flex gap-2 text-xs items-center bg-(--sec-high) p-1 rounded-xl">
            <CheckCircle2 size={15} /> Email Sent
          </p>
          {data?.hasAttended === false ? (
            <p className="flex gap-2 text-xs items-center bg-(--text-sec) p-1 rounded-xl">
              <XCircle size={15} /> Attended
            </p>
          ) : (
            <p className="flex gap-2 text-xs items-center bg-(--primary-mint) p-1 rounded-xl">
              <CheckCircle2 size={15} /> Attended
            </p>
          )}
        </div>
        <div className="attendeeDetails bg-(--sec-high) mt-4 p-3 rounded ">
          <p className="flex gap-2 items-center pb-2">
            <User />
            <span>Name: </span>
            <span className="font-semibold text-amber-200">{data?.Name}</span>
          </p>
          <p className="flex gap-2 items-center pb-2">
            <Calendar />
            <span>Age: </span>
            <span className="font-semibold text-amber-200">{data?.Age}</span>
          </p>
          <p className="flex gap-2 items-center pb-2">
            <Mail />
            <span>Email: </span>
            <span className="font-semibold text-amber-200">{data?.Email}</span>
          </p>
        </div>
        <div className="btnCont flex mt-5 justify-center gap-3">
          {data.hasAttended === false ? (
            <button
              type="button"
              onClick={() => markAs(true)}
              className="text-base p-1 bg-(--primary-mint) cursor-pointer rounded-xl border-2 border-(--text-white) transition-all transition-duration-3 hover:bg-cyan-400 hover:scale-105 active:bg-(--bg-spruce)"
            >
              Mark as Attended
            </button>
          ) : (
            <button
              type="button"
              onClick={() => markAs(false)}
              className="text-base p-1 bg-red-400 cursor-pointer rounded-xl border-2 border-(--text-white) transition-all transition-duration-3 hover:bg-orange-300 hover:scale-105 active:bg-(--bg-spruce)"
            >
              Mark as Absent
            </button>
          )}
        </div>
      </dialog>
      
    </>
  );
}