
import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { buildQrPayload, downloadQrPassCard, uploadQrPassCard } from "../lib/qr";
import {
  CalendarDays,
  Check,
  Copy,
  Download,
  Mail,
  QrCode,
  User,
  X,
} from "lucide-react";
import {
  doc,
  getDoc
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

const EVENT_NAME = "Event 202X";

function RegisDiag({ open, close, emailID }) {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!emailID) {
        if (isMounted) setFormData(null);
        return;
      }

      try {
        const snap = await getDoc(doc(db, "EventSignUps", emailID));

        if (!isMounted) return;

        if (snap.exists()) {
          setFormData(snap.data());
        } else {
          console.error("No document found for:", emailID);
          setFormData(null);
        }
      } catch (error) {
        console.error("Failed to fetch form data:", error);
        if (isMounted) setFormData(null);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [emailID]);

  const isOpen = open && formData && typeof formData === "object";

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") close?.();
    };

    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="registration-dialog-title"
    >
      <div
        className="absolute inset-0 animate-overlay-in bg-(--bg-spruce)/80 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />
      <PassContent
        key={formData.RegistrationID ?? "registration"}
        registrant={formData}
        close={close}
      />
    </div>
  );
}

function PassContent({ registrant, close }) {
  const closeRef = useRef(null);
  const qrWrapRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [qrSaved, setQrSaved] = useState(false);
  const navigate = useNavigate();

  const onClickClose = () =>{
    close;
    navigate("/");
  }
  
  // Move focus into the dialog on mount, restore it on unmount (close)
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeRef.current?.focus();
    return () => previouslyFocused?.focus?.();
  }, []);


  // upload QR Pass
  useEffect(()=>{
    const timer = setTimeout(()=>{
      const svg = qrWrapRef.current?.querySelector("svg");
      if (!svg) return;
      const uploadImg = async () =>{
        const passUrl = await uploadQrPassCard(registrant, svg);

        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            to_email: registrant.Email,
            to_name: registrant.Name,
            user_name: registrant.Name,
            event_name: EVENT_NAME,
            pass_url: passUrl,
            support_email: "event202xofficial@gmail.com",
            company_name: "Event 202X",
          },
          { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY },
        );
      };
      uploadImg(); 
    }, 1500);
    return () => clearTimeout(timer);
  });

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(registrant.RegistrationID);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable (permissions / insecure context) — fail silently.
    }
  };

  /**
   * Render the QR (same payload as on screen) plus the registration details
   * into a print-ready pass-card PNG, then trigger the download.
   */
  const handleDownloadQr = async () => {
    const svg = qrWrapRef.current?.querySelector("svg");
    if (!svg) return;
    try {
      await downloadQrPassCard(registrant, svg);
      setQrSaved(true);
      setTimeout(() => setQrSaved(false), 1600);
    } catch {
      // PNG export unsupported — fail silently.
    }
  };

  const qrValue = registrant.RegistrationID;

  const details = [
    { icon: User, label: "Name", value: registrant.Name },
    { icon: CalendarDays, label: "Age", value: String(registrant.Age) },
    { icon: Mail, label: "Email", value: registrant.Email },
  ];

  return (
    <div className="animate-dialog-in custom-scrollbar relative max-h-[min(92vh,760px)] w-full max-w-lg overflow-y-auto rounded-2xl border border-(--primary-mint)/20 bg-(--nav-bg) shadow-[0_25px_70px_-15px_rgba(13,31,23,0.9)]">
      {/* Accent strip */}
      <div
        className="h-1.5 bg-gradient-to-r from-sec-high via-mint to-sec-high"
        aria-hidden="true"
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-6 pb-4 pt-5">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-(--primary-mint) p-2 text-(--bg-spruce)">
            <QrCode className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ash">
              {EVENT_NAME}
            </p>
            <h2
              id="registration-dialog-title"
              className="text-sm font-semibold text-cream"
            >
              Attendee Pass
            </h2>
          </div>
        </div>

        <button
          ref={closeRef}
          type="button"
          onClick={() => onClickClose()}
          aria-label="Close registration dialog"
          className="rounded-lg p-2 text-ash transition-colors hover:bg-(--sec-high)/20 hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <h1 className="text-2xl font-bold text-center mb-3">
        You Have Successfully Registered for Event 202X!
      </h1>
      {/* Identity */}
      <div className="flex flex-col items-center gap-3 px-6">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={handleCopyId}
            title="Copy registrant ID"
            className="group inline-flex items-center gap-1.5 rounded-full border border-mint/30 bg-(--bg-spruce) px-3 py-1 font-mono text-xs text-mint transition-colors hover:border-mint/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"
          >
            {registrant.RegistrationID}
            {copied ? (
              <Check className="h-3 w-3" aria-label="Copied" />
            ) : (
              <Copy
                className="h-3 w-3 opacity-50 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            )}
          </button>
          {registrant.hasAttended === true ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-mint/40 bg-(--primary-mint)/10 px-3 py-1 text-xs font-medium text-mint">
              <Check className="h-3 w-3" aria-hidden="true" />
              Attended
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ash/20 bg-ash/10 px-3 py-1 text-xs font-medium text-ash">
              Awaiting scan
            </span>
          )}
        </div>
      </div>

      {/* Registration details + QR — side by side on sm+, stacked on mobile */}
      <div className="mt-5 flex flex-col gap-5 px-6 sm:flex-row sm:items-center sm:gap-4">
        {/* Details */}
        <dl className="min-w-0 flex-1 space-y-4">
          {details.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="rounded-lg bg-(--sec-high)/25 p-2 text-mint">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <dt className="text-[10px] uppercase tracking-wider text-ash">
                  {label}
                </dt>
                <dd className="break-words text-sm font-medium leading-snug text-cream">
                  {value}
                </dd>
              </div>
            </div>
          ))}
        </dl>

        {/* Vertical perforation (desktop) */}
        <div
          className="hidden w-px self-stretch border-l border-dashed border-mint/25 sm:block"
          aria-hidden="true"
        />

        {/* Horizontal perforation (mobile) */}
        <div className="relative sm:hidden" aria-hidden="true">
          <div className="border-t border-dashed border-(--primary-mint)/30" />
          <div className="absolute -top-2.5 -left-9 h-5 w-5 rounded-full bg-(--bg-spruce)" />
          <div className="absolute -top-2.5 -right-9 h-5 w-5 rounded-full bg-(--bg-spruce)" />
        </div>

        {/* QR code */}
        <div className="flex w-48 shrink-0 self-center flex-col items-center gap-2.5 sm:self-auto">
          <div className="relative rounded-xl bg-cream p-3">
            {/* Scanner-frame corner brackets */}
            <span
              className="absolute left-1.5 top-1.5 h-4 w-4 rounded-tl-md border-l-2 border-t-2 border-sec-high"
              aria-hidden="true"
            />
            <span
              className="absolute right-1.5 top-1.5 h-4 w-4 rounded-tr-md border-r-2 border-t-2 border-sec-high"
              aria-hidden="true"
            />
            <span
              className="absolute bottom-1.5 left-1.5 h-4 w-4 rounded-bl-md border-b-2 border-l-2 border-sec-high"
              aria-hidden="true"
            />
            <span
              className="absolute bottom-1.5 right-1.5 h-4 w-4 rounded-br-md border-b-2 border-r-2 border-sec-high"
              aria-hidden="true"
            />
            <div ref={qrWrapRef}>
              <QRCodeSVG
                value={qrValue}
                size={168}
                level="H"
                marginSize={1}
                bgColor="white"
                fgColor="#0D1F17"
                title={`Attendance QR code for ${registrant.Name} (${registrant.RegistrationID})`}
              />
            </div>
          </div>
          <p className="text-center text-[11px] leading-snug text-ash">
            Scan at the entrance to record attendance
          </p>
          <div className="w-full rounded-lg bg-(--bg-spruce)/60 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wider text-ash/70">
              QR encodes
            </p>
            <p className="mt-0.5 break-all font-mono text-[10px] leading-snug text-ash">
              {qrValue}
            </p>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="mt-6 grid grid-cols-2 gap-3 border-t border-mint/10 bg-(--bg-spruce)/50 px-6 py-5">
        <button
          type="button"
          onClick={handleDownloadQr}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-(--primary-mint)/30 px-4 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-(--sec-high)/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"
        >
          {qrSaved ? (
            <Check className="h-4 w-4 text-mint" aria-hidden="true" />
          ) : (
            <Download className="h-4 w-4" aria-hidden="true" />
          )}
          {qrSaved ? "Saved" : "Download QR"}
        </button>
        <button
          type="button"
          onClick={() => onClickClose()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-(--primary-mint) px-4 py-2.5 text-sm font-semibold text-spruce transition-colors hover:bg-(--primary-mint)/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream"
        >
          <Check className="h-4 w-4" aria-hidden="true" />
          Done
        </button>
      </div>
    </div>
  );
}


export default RegisDiag;
