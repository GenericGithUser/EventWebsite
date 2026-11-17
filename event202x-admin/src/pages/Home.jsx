import AttendeeDialog from "../components/AttendeeDialog";
import {useEffect, useState} from "react";
import toast, {Toaster} from "react-hot-toast";
import { fetchAll , getSize, searchFor } from "../lib/helpers";
import { Link } from "react-router-dom";
import { QrCode } from "lucide-react";

export default function Home(){
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [query, setQuery] = useState("");
    const [dialogData, setDialogData] = useState(null);
    const [loading, setLoading] = useState(true)
    const [signUps, setSignUps] = useState([]);
    const [error, setError] = useState(null);
    const [attendedNum, setAttendedNum] = useState(0);
    const [notAttendedNum, setNotAttendedNum] = useState(0);

    const openDialog = (data) =>{
      setDialogData(data);
      setIsDialogOpen(true);

    }

    const closeDialog = (message) => {
      setIsDialogOpen(false);
      setDialogData(null);

      if (message) {
        toast.success("Successfully Marked");
      }
    };

    useEffect(()=>{
      let ignore = false;

      async function load() {
        try {
          const result = await fetchAll();
          const attended = await getSize(true);
          const notAttended = await getSize(false);
          if (ignore) return;

          setSignUps(Array.isArray(result)? result: []);
          setAttendedNum(attended);
          setNotAttendedNum(notAttended);

        } catch (err) {
          if (!ignore) setError(err.message);

        } finally {
          if (!ignore) setLoading(false);
        }

      }

      load();

      return () => {
        ignore = true;
      }
    },[]);

    

    const handleSearch = (e) =>{
      e.preventDefault();
      setQuery(searchInput.trim().toLowerCase());
      
    }

    useEffect(()=>{
      if (searchInput === "") {
        setQuery("");
      }
    }, [searchInput]);

    

    const visible = query ? signUps.filter((s)=> s?.Name.toLowerCase().includes(query) || s?.Email.toLowerCase().includes(query)) : signUps;

    return (
      <>
        <div className="home mt-15 p-4 w-[85vw] max-[700px]:w-screen max-[400px]:p-0">
          <h1 className="text-3xl font-bold text-center text-amber-100 mb-2">
            Attendees Info
          </h1>
          <div className="infoCont flex justify-center items-center gap-10 max-[800px]:gap-5 max-[700px]:flex-wrap max-[460px]:gap-2">
            <div className="infoBox w-[18vw] max-[800px]:w-[25vw] max-[700px]:w-[40vw] max-[460px]:w-[60vw] bg-(--primary-mint) p-3 border-2 border-(--text-sec) rounded-md shadow-sm shadow-gray-400">
              <p className="text-xl max-[700px]:hidden">Total Attendees</p>
              <h2 className="font-bold text-6xl text-right max-[700px]:text-3xl max-[700px]:text-center max-[700px]:flex max-[700px]:justify-center max-[700px]:items-center max-[700px]:gap-3">
                <span className="font-normal text-xl min-[700px]:hidden max-[550px]:text-lg">
                  Total Attendees:{" "}
                </span>
                {signUps?.length}
              </h2>
            </div>
            <div className="infoBox w-[18vw] max-[800px]:w-[25vw] max-[700px]:w-[40vw] max-[460px]:w-[60vw] bg-(--primary-mint) p-3 border-2 border-(--text-sec) rounded-md shadow-sm shadow-gray-400">
              <p className="text-xl max-[700px]:hidden">Attended</p>
              <h2 className="font-bold text-6xl text-right max-[700px]:text-3xl max-[700px]:text-center max-[700px]:flex max-[700px]:justify-center max-[700px]:items-center max-[700px]:gap-3">
                <span className="font-normal text-xl min-[700px]:hidden max-[550px]:text-lg">
                  Attended:{" "}
                </span>
                {attendedNum}
              </h2>
            </div>
            <div className="infoBox w-[18vw] max-[800px]:w-[25vw] max-[700px]:w-[40vw] max-[460px]:w-[60vw] bg-(--primary-mint) p-3 border-2 border-(--text-sec) rounded-md shadow-sm shadow-gray-400">
              <p className="text-xl max-[700px]:hidden">Not Attended</p>
              <h2 className="font-bold text-6xl text-right max-[700px]:text-3xl max-[700px]:text-center max-[700px]:flex max-[700px]:justify-center max-[700px]:items-center max-[700px]:gap-3 ">
                <span className="font-normal text-xl min-[700px]:hidden max-[550px]:text-lg">
                  Not Attended:{" "}
                </span>
                {notAttendedNum}
              </h2>
            </div>
          </div>

          <div className="attendeeList bg-(--nav-bg) mt-2 h-[57vh] border-2 overflow-hidden border-cyan-300 rounded p-1 box-border">
            <h1 className="text-2xl font-bold text-center text-amber-100 mt-2 mb-1">
              Attendees List
            </h1>
            <form
              onSubmit={handleSearch}
              className="searchForm bg-(--sec-high) p-1 w-[36vw] max-[800px]:w-[60vw] max-[650px]:w-[70vw] max-[420px]:w-[80vw] max-[400px]:w-[95vw] m-auto flex justify-center gap-2 items-center rounded-2xl"
            >
              <label htmlFor="searchBox" className="text-base">
                Search:{" "}
              </label>
              <input
                type="search"
                name="search"
                id="searchBox"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="border-2 border-white rounded-xl outline-0 w-[20vw] max-[800px]:w-[35vw] max-[400px]:w-[45vw] bg-(--nav-bg) transition-all transition-duration-3 p-1 focus:ring-1 focus:ring-amber-200"
              />
              <input
                type="submit"
                value="🔎Search"
                className="bg-cyan-500 p-1 rounded-2xl transition-all transition-duration-3 cursor-pointer hover:bg-(--sec-high) border-2 border-amber-100"
              />
            </form>
            <div className="attendeeBox p-1 flex justify-center mt-2 h-[75%] flex-col items-center gap-3 overflow-y-auto box-border">
              {visible.length === 0 ? (
                <p>{query ? "No Matches" : "No Sign-ups yet!"}</p>
              ) : loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p>Error {error}</p>
              ) : (
                visible.map((s) => (
                  <div
                    key={s?.RegistrationID}
                    className="attendeeItem w-[40vw] max-[800px]:w-[60vw] max-[550px]:w-[70vw] max-[420px]:w-[80vw] max-[400px]:w-[90vw] flex justify-between p-2 bg-(--primary-mint) items-center rounded-2xl border-2 border-(--sec-high) shadow-sm shadow-amber-100 cursor-pointer transition-all transition-duration-3 hover:bg-(--nav-bg) hover:scale-105"
                    onClick={() => openDialog(s)}
                  >
                    <p className="font-bold text-amber-100">
                      ID: {s?.RegistrationID}
                    </p>
                    <p>Name: {s?.Name} </p>
                  </div>
                ))
              )}
            </div>
          </div>
          <Link to={"/scan"} className="scanBtn absolute bottom-5 right-5 bg-amber-900 p-1 rounded-4xl min-[700px]:hidden " replace>
            <QrCode size={40} />
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