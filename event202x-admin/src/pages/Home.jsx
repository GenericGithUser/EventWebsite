import AttendeeDialog from "../components/AttendeeDialog";
import {useEffect, useState} from "react";
import toast, {Toaster} from "react-hot-toast";
import { fetchAll , getSize, searchFor } from "../lib/helpers";

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
        <div className="home mt-15 p-4 w-[85vw]">
          <h1 className="text-3xl font-bold text-center text-amber-100 mb-2">
            Attendees Info
          </h1>
          <div className="infoCont flex justify-center items-center gap-10">
            <div className="infoBox w-[18vw] bg-(--primary-mint) p-3 border-2 border-(--text-sec) rounded-md shadow-sm shadow-gray-400">
              <p className="text-xl">Total Attendees</p>
              <h2 className="font-bold text-6xl text-right">
                {signUps?.length}
              </h2>
            </div>
            <div className="infoBox w-[18vw] bg-(--primary-mint) p-3 border-2 border-(--text-sec) rounded-md shadow-sm shadow-gray-400">
              <p className="text-xl">Attended</p>
              <h2 className="font-bold text-6xl text-right">{attendedNum}</h2>
            </div>
            <div className="infoBox w-[18vw] bg-(--primary-mint) p-3 border-2 border-(--text-sec) rounded-md shadow-sm shadow-gray-400">
              <p className="text-xl">Has Not Attended</p>
              <h2 className="font-bold text-6xl text-right">
                {notAttendedNum}
              </h2>
            </div>
          </div>

          <div className="attendeeList bg-(--nav-bg) mt-2 h-[59.5vh] border-2 overflow-hidden border-cyan-300 rounded p-1 box-border">
            <h1 className="text-2xl font-bold text-center text-amber-100 mt-2 mb-1">
              Attendees List
            </h1>
            <form
              onSubmit={handleSearch}
              className="searchForm bg-(--sec-high) p-1 w-[32vw] m-auto flex justify-center gap-2 items-center rounded-2xl"
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
                className="border-2 border-white rounded-xl outline-0 w-[20vw] bg-(--nav-bg) transition-all transition-duration-3 p-1 focus:ring-1 focus:ring-amber-200"
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
                    className="attendeeItem w-[40vw] flex justify-between p-2 bg-(--primary-mint) items-center rounded-2xl border-2 border-(--sec-high) shadow-sm shadow-amber-100 cursor-pointer transition-all transition-duration-3 hover:bg-(--nav-bg) hover:scale-105"
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