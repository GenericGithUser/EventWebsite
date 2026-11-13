import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { FaCircleArrowDown } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast, {Toaster} from "react-hot-toast";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
function Landing() {
  const [checkEmail, setCheckEmail] = useState("");
  const navigate = useNavigate();

  const checkExistsEmail = async () => {
      // Should Contain Fetching api call

      if (checkEmail === "") {
        toast.error("No Email Provided");
        return
      }
      else if (!checkEmail.includes("@")){
        toast.error("Invalid Email!");
        return
      }
      else{
        const snap = await getDoc(doc(db, "EventSignUps", checkEmail));

        if (snap.exists()){
            navigate("/details", {
              state: {
                registrant: snap.data()
              },
            });
        }
        else{
          toast("⚠ Email Not in Use!");
        }
      }
  }

  return (
    <div>
      <NavBar />

      <main className="">
        <section
          id="home"
          className="w-[98.8vw] h-screen flex flex-col justify-center items-center gap-6 bg-[url(./assets/bg.webp)] bg-cover bg-no-repeat bg-center 
                after:absolute after:inset-0 after:pointer-events-none
                after:bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.4)_100%)] "
        >
          <h1 className="text-7xl font-bold mt-20">
            The Greatest Event of All Time
          </h1>
          <Link
            to="/sign-up"
            className="cursor-pointer bg-(--primary-mint) p-2 font-bold text-2xl rounded transition-all duration-300 ease-in-out hover:bg-(--sec-high) hover:scale-105"
          >
            Sign Up NOW!
          </Link>
          <p>Or</p>
          <div className="searchEmail">
            <h2 className="text-2xl font-bold -mt-3 text-center">
              Check Your Registration Details
            </h2>
            <p className="text-center">Enter your Email Here!</p>
            <div className="searchEmailBox flex gap-4">
              <input
                type="email"
                name="Email"
                id="emailBox"
                value={checkEmail}
                className="bg-green-100 text-black w-[30vw] text-[1rem] p-1.5 rounded-xl border-2 border-(--primary-mint) outline-none focus:ring-2 focus:ring-amber-100 transition-all duration-100"
                onChange={(e) => setCheckEmail(e.target.value)}
              />
              <button
                type="button"
                className="cursor-pointer bg-(--primary-mint) p-2 font-bold text-xl rounded transition-all duration-300 ease-in-out hover:bg-(--sec-high) hover:scale-105"
                onClick={() => checkExistsEmail()}
              >
                Check
              </button>
            </div>
          </div>
          <p>To Learn More, Scroll Down</p>
          <FaCircleArrowDown className="animate-bounce text-6xl" />
        </section>
        <section id="about" className="p-5 flex flex-col gap-4">
          <article
            className="about w-[96vw] border-(--sec-high) border-2 rounded-xl p-5 m-auto text-2xl bg-(--nav-bg) 
                shadow-lg shadow-(--text-sec)/90 flex flex-row gap-3"
          >
            <p>
              The wait is finally over, and the single most monumental gathering
              in human history has officially arrived. This is not just another
              conference, seminar, or weekend convention—
              <strong>
                this is the ultimate convergence of visionaries, industry
                titans, game-changers, and boundary-pushers from every corner of
                the globe.{" "}
              </strong>
              For months, rumors have circulated, anticipation has reached a
              fever pitch, and now the doors are about to open on an immersive,
              once-in-a-lifetime spectacle designed to redefine everything you
              thought was possible.
            </p>
            <img
              src="../about_img1.webp"
              alt="meeting"
              className="w-2xl border-2 border-amber-100 rounded-2xl"
            />
          </article>
          <article
            className="about w-[96vw] border-(--sec-high) border-2 rounded-xl p-5 m-auto text-2xl bg-(--nav-bg) 
                shadow-lg shadow-(--text-sec)/90 flex flex-row gap-3"
          >
            <img
              src="../about_img2.webp"
              alt="meeting"
              className="w-2xl border-2 border-amber-100 rounded-2xl"
            />
            <p>
              If you have ever felt that quiet itch for something bigger,
              something bolder, and something utterly transformative, this is
              your definitive moment to step into the arena. Across multiple
              action-packed days, you will gain exclusive access to
              groundbreaking keynotes, electrifying mainstage panel discussions,
              confidential masterclasses, and unprecedented networking
              opportunities where world-className minds build the future in real
              time. Every session has been meticulously curated to deliver
              actionable strategies, disruptive insights, and high-impact
              connections that simply cannot be replicated anywhere else on
              Earth.
            </p>
          </article>
          <article
            className="about w-[96vw] border-(--sec-high) border-2 rounded-xl p-5 m-auto text-2xl bg-(--nav-bg) 
                shadow-lg shadow-(--text-sec)/90 flex flex-row gap-3"
          >
            <p>
              Imagine standing in an arena pulsing with unmatched energy,
              surrounded by thousands of like-minded movers and shakers who
              share your drive for excellence and obsession with growth. Whether
              you are looking to accelerate your trajectory, unlock hidden
              potential, forge million-dollar partnerships, or simply witness
              history in the making, missing this event is simply not an option.
              This is the one room where the world’s most influential innovators
              gather under one roof to set the agenda for the decade ahead.
            </p>
            <img
              src="../about_img3.webp"
              alt="meeting"
              className="w-2xl border-2 border-amber-100 rounded-2xl"
            />
          </article>
          <article
            className="about w-[96vw] border-(--sec-high) border-2 rounded-xl p-5 m-auto text-2xl bg-(--nav-bg) 
                shadow-lg shadow-(--text-sec)/90 flex flex-row gap-3"
          >
            <img
              src="../about_img4.webp"
              alt="meeting"
              className="w-2xl border-2 border-amber-100 rounded-2xl"
            />
            <p>
              Space inside this prestigious experience is strictly limited, and
              pass tiers are already filling up at a record-breaking pace.
              Securing your registration today isn’t just signing up for an
              event—it’s an investment in your vision, your network, and your
              future. Don’t spend the aftermath watching from the sidelines
              while everyone else talks about the defining experience of a
              generation. Claim your spot, lock in your badge, and join us for
              the undisputed greatest event of all time.
              <br className="" />
              <br />
              <Link
                to="/sign-up"
                className="cursor-pointer bg-(--primary-mint) p-2 font-bold text-2xl rounded transition-all duration-300 ease-in-out hover:bg-(--sec-high) hover:scale-105"
              >
                Sign Up NOW!
              </Link>
            </p>
          </article>
        </section>
      </main>
      <Footer />
      <Toaster
        toastOptions={{
            style: {
              background: "#91baa6",
              color: "#ECFDF5"
            },
        }}
      />
    </div>
  );
}

export default Landing;
