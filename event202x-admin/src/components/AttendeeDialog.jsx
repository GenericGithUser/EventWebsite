import { useRef, useState, useEffect } from "react";

export default function AttendeeDialog({ isOpen, close, data}){
    const dialogRef = useRef(null);



    return(
        <>
            <dialog className="w-[30vw] h-[20vw] bg-(--bg-spruce) border-2 border-(--sec-high) text-(--text-white) m-auto rounded-lg p-6 shadow-xl" open>
                Hello
            </dialog>
        </>
    );
}