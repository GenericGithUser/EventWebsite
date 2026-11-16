import Footer from "../components/Footer";
import RegisDiag from "../components/RegisDiag";
import { useState } from "react";
import {
  doc,
  getDoc,
  runTransaction,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import toast, {Toaster} from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Form() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formData, setFormData] = useState(null);
    const navigate = useNavigate();

    const closeDialog = () => {
        setDialogOpen(false);
        setFormData(null);      
    }

    const createSignUp = async (signUpDetails) => {
      const email = signUpDetails.Email.trim().toLowerCase();
      // Pre-check (nice UX; the rules reject duplicates regardless)
      if ((await getDoc(doc(db, "EventSignUps", email))).exists()) {
        return "Email Exists";
      }
      return runTransaction(db, async (transaction)=>{
        // Read IDs firstbgv6
        const counter = doc(db, "Counters", "eventSignup");
        const signupRef = doc(db, "EventSignUps", email);

        const snap = await transaction.get(counter);
        const next = (snap.data().currentValue ?? 0) + 1;
        const id = "EVE-" + String(next).padStart(3, "0");

        transaction.set(signupRef, {
          RegistrationID: id,
          Name: signUpDetails.Name,
          Age: Number(signUpDetails.Age),
          Email: email,
          EmailSent: true,
          hasAttended: false,
        });
        transaction.update(counter, { currentValue: next });
        return email;
      });
    }


    const handleFormSubmit = async (e) => {
      e.preventDefault();
      
      const data = new FormData(e.currentTarget);
      const insertData = await createSignUp(Object.fromEntries(data));

      if (insertData === "Email Exists") {
        toast.error("This email is already registered.");
        return
      }

      setFormData(insertData);
      setDialogOpen(true);
    }

    return (
      <>
        <header className="navBar flex flex-row justify-around items-center w-[80vw] h-15 bg-(--nav-bg) p-4 left-0 mt-5 m-auto  border-amber-100 border-2 rounded-xl">
          <h2 className="font-bold text-3xl text-amber-100">
            {" "}
            Event 202X Registration Form{" "}
          </h2>
        </header>
        <section
          className="formProper w-[96vw] border-(--sec-high) border-2 rounded-xl p-5 m-auto text-2xl bg-(--nav-bg) 
                shadow-2xl shadow-(--text-sec)/90 mt-5 mb-10"
        >
          <form
            action=""
            onSubmit={handleFormSubmit}
            className="dataForm flex flex-col justify-center items-center gap-4"
          >
            <div className="fCont flex gap-5 items-center ">
              <label htmlFor="usrName">Full Name: </label>
              <input
                type="text"
                name="Name"
                id="usrName"
                required
                className="bg-green-100 text-black w-xl text-xl p-1.5 rounded-xl border-2 border-(--primary-mint) outline-none focus:ring-2 focus:ring-amber-100 transition-all duration-100"
              />
            </div>
            <div className="fXlCont flex flex-row gap-5">
              <div className="fCont flex gap-5">
                <label htmlFor="usrAge">Age: </label>
                <input
                  type="number"
                  name="Age"
                  id="usrAge"
                  required
                  className="bg-green-100 text-black w-[10vw] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-xl p-1.5 rounded-xl border-2 border-(--primary-mint) outline-none focus:ring-2 focus:ring-amber-100 transition-all duration-100"
                />
              </div>
              <div className="fCont flex gap-5">
                <label htmlFor="usrEmail">Email: </label>
                <input
                  type="email"
                  name="Email"
                  id="usrEmail"
                  required
                  className="bg-green-100 text-black w-[30vw] text-xl p-1.5 rounded-xl border-2 border-(--primary-mint) outline-none focus:ring-2 focus:ring-amber-100 transition-all duration-100"
                />
              </div>
            </div>
            <input
              type="submit"
              value="Submit"
              className="bg-(--primary-mint) p-2 text-3xl rounded-xl pl-20 pr-20 font-bold cursor-pointer hover:scale-105 hover:bg-(--sec-high) transition-all duration-100"
            />
          </form>
          <div className="cancelCont flex items-center justify-center mt-4">
            <button
              type="button"
              className="bg-red-400 p-2 text-3xl rounded-xl pl-20 pr-20 font-bold cursor-pointer hover:scale-105 hover:bg-red-600 transition-all duration-100"
              onClick={()=>navigate("/")}
            >
              Cancel?
            </button>
          </div>

          <div className="max-w-3xl mx-auto p-4 mt-20 font-sans leading-relaxed">
            <h2 className="text-2xl font-bold mb-1">
              Data Privacy Notice & Event Registration Disclaimer
            </h2>
            <p className=" mb-4 text-xs">
              <span className="font-semibold text-(--text-sec)">
                Last Updated:
              </span>{" "}
              November 10, 2026
            </p>
            <p className="mb-6 text-[1.2rem]">
              By registering for and participating in this event (the "Event"),
              you acknowledge and agree to the data collection, processing,
              storage, and sharing practices described in this Data Privacy
              Notice. We are committed to protecting your personal information
              and handling your data with transparency, integrity, and full
              compliance with applicable data privacy laws and regulations
              (including GDPR, CCPA, and RA 10173).
            </p>

            <div className="space-y-3">
              <details className="group border border-gray-200 rounded-lg overflow-hidden bg-(--sec-high) open:border-blue-600 open:shadow-sm transition-all duration-200">
                <summary className="flex justify-between items-center p-4 font-semibold text-white-800 bg-(--bg-spruce) hover:bg-(--sec-high) cursor-pointer select-none group-open:bg-green-300 group-open:text-(--text-sec) transition-colors duration-200 list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-xl">1. Information We Collect</span>
                  <svg
                    className="w-4 h-4 text-white-500 group-open:text-(--text-sec) group-open:rotate-180 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="p-4 border-t border-gray-200 text-sm text-white-600 space-y-2">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong className="text-white">
                        Personal & Professional Identifiers:
                      </strong>{" "}
                      Full name, job title, company/organization name,
                      professional role, industry, business email address, phone
                      number, and mailing address.
                    </li>
                    <li>
                      <strong className="text-white">
                        Account & Pass Information:
                      </strong>{" "}
                      Ticket tier, registration identification number, badging
                      credentials, emergency contact details, and account login
                      parameters for our virtual event platform.
                    </li>
                    <li>
                      <strong className="text-white">
                        Financial & Payment Data:
                      </strong>{" "}
                      Payment status, billing address, and transaction metadata.{" "}
                      <em className="text-white-500">
                        (Note: Full credit card numbers and sensitive payment
                        credentials are processed directly by PCI-DSS compliant
                        payment gateways and are never stored on our servers.)
                      </em>
                    </li>
                    <li>
                      <strong className="text-white">
                        Preferences & Accessibility Data:
                      </strong>{" "}
                      Dietary restrictions, mobility or physical accommodation
                      requirements, language preferences, and session interest
                      tracks submitted during registration.
                    </li>
                    <li>
                      <strong className="text-white">
                        Digital Interaction & Technical Data:
                      </strong>{" "}
                      IP address, device specs, browser type, badge scan records
                      at session entry points, virtual platform interaction
                      logs, session attendance length, and poll responses.
                    </li>
                  </ul>
                </div>
              </details>
              <details className="group border border-gray-200 rounded-lg overflow-hidden bg-(--sec-high) open:border-blue-600 open:shadow-sm transition-all duration-200">
                <summary className="flex justify-between items-center p-4 font-semibold text-white-800 bg-(--bg-spruce) hover:bg-(--sec-high) cursor-pointer select-none group-open:bg-green-300 group-open:text-(--text-sec) transition-colors duration-200 list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-xl">2. How We Use Your Data</span>
                  <svg
                    className="w-4 h-4 text-white-500 group-open:text-(--text-sec) group-open:rotate-180 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="p-4 border-t border-gray-200 text-sm text-white-600 space-y-2">
                  <p>
                    We process your personal information strictly for legitimate
                    operational, promotional, and event management purposes,
                    including:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong className="text-white">
                        Event Operations & Management:
                      </strong>{" "}
                      Processing registration, issuing event passes and badging,
                      managing access control, facilitating check-in, providing
                      physical/digital accommodations, and sending critical
                      operational updates.
                    </li>
                    <li>
                      <strong className="text-white">
                        Networking & Interactive Features:
                      </strong>{" "}
                      Creating attendee lists for official event apps, enabling
                      peer-to-peer networking, meeting scheduling, and chat
                      participation.
                    </li>
                    <li>
                      <strong className="text-white">
                        Analytics & Quality Improvement:
                      </strong>{" "}
                      Evaluating delegate engagement, tracking session
                      popularity, measuring overall event performance, improving
                      future programming, and auditing attendance metrics.
                    </li>
                    <li>
                      <strong className="text-white">
                        Marketing & Post-Event Communications:
                      </strong>{" "}
                      Distributing post-event session recordings, downloadable
                      resources, surveys, and updates regarding future
                      iterations of the Event or related partner initiatives.
                    </li>
                  </ul>
                </div>
              </details>
              <details className="group border border-gray-200 rounded-lg overflow-hidden bg-(--sec-high) open:border-blue-600 open:shadow-sm transition-all duration-200">
                <summary className="flex justify-between items-center p-4 font-semibold text-white-800 bg-(--bg-spruce) hover:bg-(--sec-high) cursor-pointer select-none group-open:bg-green-300 group-open:text-(--text-sec) transition-colors duration-200 list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-xl">
                    3. Data Sharing & Third-Party Disclosures
                  </span>
                  <svg
                    className="w-4 h-4 text-white-500 group-open:text-(--text-sec) group-open:rotate-180 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="p-4 border-t border-gray-200 text-sm text-white-600 space-y-2">
                  <p>
                    We do not sell your personal information to third parties.
                    However, to execute a seamless event, we may share your data
                    under the following circumstances:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong className="text-white">
                        Authorized Service Providers:
                      </strong>{" "}
                      Event logistics partners, badging vendors, mobile app
                      developers, cloud platform providers, venue management,
                      and security personnel.
                    </li>
                    <li>
                      <strong className="text-white">
                        Event Sponsors & Exhibitors:
                      </strong>{" "}
                      If you elect to have your physical badge scanned at a
                      sponsor booth or partner session, you consent to share
                      your contact details directly with that sponsor.
                    </li>
                    <li>
                      <strong className="text-white">
                        Virtual Platform Directory:
                      </strong>{" "}
                      Registered attendees may appear in the attendee directory
                      by default. You may toggle your visibility to "Private"
                      inside the app at any time.
                    </li>
                    <li>
                      <strong className="text-white">Legal Obligations:</strong>{" "}
                      When required by law, subpoena, search warrant, court
                      order, or regulatory authority.
                    </li>
                  </ul>
                </div>
              </details>
              <details className="group border border-gray-200 rounded-lg overflow-hidden bg-(--sec-high) open:border-blue-600 open:shadow-sm transition-all duration-200">
                <summary className="flex justify-between items-center p-4 font-semibold text-white-800 bg-(--bg-spruce) hover:bg-(--sec-high) cursor-pointer select-none group-open:bg-green-300 group-open:text-(--text-sec) transition-colors duration-200 list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-xl">
                    4. Media Release & Photography Consent
                  </span>
                  <svg
                    className="w-4 h-4 text-white-500 group-open:text-(--text-sec) group-open:rotate-180 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="p-4 border-t border-gray-200 text-sm text-white-600 space-y-2">
                  <p>
                    By attending the Event in person or online, you grant
                    organizers the right to capture your image, likeness, voice,
                    and comments through photography and video recordings.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Recordings and photos may be edited, broadcast, published,
                      or distributed worldwide for marketing or archive purposes
                      without compensation.
                    </li>
                    <li>
                      Inform event staff upon check-in to receive a non-filming
                      badge indicator if you do not wish to be individually
                      photographed in identifiable contexts.
                    </li>
                  </ul>
                </div>
              </details>

              <details className="group border border-gray-200 rounded-lg overflow-hidden bg-(--sec-high) open:border-blue-600 open:shadow-sm transition-all duration-200">
                <summary className="flex justify-between items-center p-4 font-semibold text-white-800 bg-(--bg-spruce) hover:bg-(--sec-high) cursor-pointer select-none group-open:bg-green-300 group-open:text-(--text-sec) transition-colors duration-200 list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-xl">5. Retention & Security</span>
                  <svg
                    className="w-4 h-4 text-white-500 group-open:text-(--text-sec) group-open:rotate-180 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="p-4 border-t border-gray-200 text-sm text-white-600">
                  <p>
                    We maintain technical, administrative, and physical
                    safeguards to protect your personal data against
                    unauthorized access, loss, misuse, or alteration. Your data
                    is retained only as long as necessary to fulfill event
                    operations, resolve disputes, or comply with statutory audit
                    requirements.
                  </p>
                </div>
              </details>
              <details className="group border border-gray-200 rounded-lg overflow-hidden bg-(--sec-high) open:border-blue-600 open:shadow-sm transition-all duration-200">
                <summary className="flex justify-between items-center p-4 font-semibold text-white-800 bg-(--bg-spruce) hover:bg-(--sec-high) cursor-pointer select-none group-open:bg-green-300 group-open:text-(--text-sec) transition-colors duration-200 list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-xl">
                    6. Your Data Rights & Contact Information
                  </span>
                  <svg
                    className="w-4 h-4 text-white-500 group-open:text-(--text-sec) group-open:rotate-180 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="p-4 border-t border-gray-200 text-sm text-white-600 space-y-2">
                  <p>
                    Depending on your jurisdiction, you possess rights to
                    request data access, correction, deletion, or to opt out of
                    processing.
                  </p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>
                      <strong className="text-white">
                        Access & Portability:
                      </strong>{" "}
                      Request a copy of your personal data.
                    </li>
                    <li>
                      <strong className="text-white">Rectification:</strong>{" "}
                      Request correction of inaccurate records.
                    </li>
                    <li>
                      <strong className="text-white">Erasure:</strong> Request
                      deletion of your personal details.
                    </li>
                    <li>
                      <strong className="text-white">Opt-Out:</strong>{" "}
                      Unsubscribe from marketing or directory listings.
                    </li>
                  </ol>
                  <p className="pt-2">
                    Contact our Data Protection Officer at{" "}
                    <strong className="text-white">
                      privacy@thegreatestevent.com
                    </strong>{" "}
                    to exercise your rights.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </section>
        <RegisDiag
          open={dialogOpen}
          close={() => closeDialog()}
          emailID={formData}
        />
        <Footer />
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

export default Form;