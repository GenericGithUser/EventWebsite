import { useEffect, useRef, useState } from "react";
import QRScanner from "qr-scanner";


export default function QrReader({ onResult }){
    const videoRef = useRef(null);
    const onResultRef = useRef(null);
    onResultRef.current = onResult;
    const [error, setError] = useState(null);

    useEffect(()=>{
        const video = videoRef.current;
        if (!video) return;

        const scanner = new QRScanner(
          video,
          (result) => {
            scanner.stop();
            const data = result?.data;
            if (!data) return;
            onResultRef.current(data);
          }, // result = { data, cornerPoints }
          {
            preferredCamera: "environment", // rear camera on mobile
            highlightScanRegion: true, // drawn overlay, no CSS import needed
            highlightCodeOutline: true,
            maxScansPerSecond: 10,
            onDecodeError: () => {},
          },
        );

        scanner.start().catch((e)=> setError(e?.message ?? String(e)));

        return () =>{
            scanner.stop();
            scanner.destroy();

        }

    }, []);

    return (
      <video
        ref={videoRef}
        className="w-[40vw] max-[700px]:w-[80vw] max-[500px]:w-[95vw]"
      />
    );
}