import AttendeeDialog from "../components/AttendeeDialog";


export default function Home(){
    return (
      <>
        <div className="home mt-15 p-4 w-[85vw]">
          <h1 className="text-3xl font-bold text-center text-amber-100 mb-2">
            Attendees Info
          </h1>
          <div className="infoCont flex justify-center items-center gap-10">
            <div className="infoBox w-[18vw] bg-(--primary-mint) p-3 border-2 border-(--text-sec) rounded-md shadow-sm shadow-gray-400">
              <p className="text-xl">Total Attendees</p>
              <h2 className="font-bold text-6xl text-right">0</h2>
            </div>
            <div className="infoBox w-[18vw] bg-(--primary-mint) p-3 border-2 border-(--text-sec) rounded-md shadow-sm shadow-gray-400">
              <p className="text-xl">Attended</p>
              <h2 className="font-bold text-6xl text-right">0</h2>
            </div>
            <div className="infoBox w-[18vw] bg-(--primary-mint) p-3 border-2 border-(--text-sec) rounded-md shadow-sm shadow-gray-400">
              <p className="text-xl">Has Not Attended</p>
              <h2 className="font-bold text-6xl text-right">0</h2>
            </div>
          </div>

          <div className="attendeeList bg-(--nav-bg) mt-2 h-[59.5vh] border-2 overflow-hidden border-cyan-300 rounded p-1 box-border">
            <h1 className="text-2xl font-bold text-center text-amber-100 mt-2 mb-1">
              Attendees List
            </h1>
            <form
              action=""
              className="searchForm bg-(--sec-high) p-1 w-[32vw] m-auto flex justify-center gap-2 items-center rounded-2xl"
            >
              <label htmlFor="searchBox" className="text-base">
                Search:{" "}
              </label>
              <input
                type="search"
                name="search"
                id="searchBox"
                className="border-2 border-white rounded-xl outline-0 w-[20vw] bg-(--nav-bg) transition-all transition-duration-3 p-1 focus:ring-1 focus:ring-amber-200"
              />
              <input
                type="submit"
                value="🔎Search"
                className="bg-cyan-500 p-1 rounded-2xl transition-all transition-duration-3 cursor-pointer hover:bg-(--sec-high) border-2 border-amber-100"
              />
            </form>
            <div className="attendeeBox p-1 flex justify-center mt-2 h-[75%] flex-col items-center gap-3 overflow-y-auto box-border">
              <div className="attendeeItem w-[40vw] flex justify-between p-2 bg-(--primary-mint) items-center rounded-2xl border-2 border-(--sec-high) shadow-sm shadow-amber-100 cursor-pointer transition-all transition-duration-3 hover:bg-(--nav-bg) hover:scale-105">
                <p className="font-bold text-amber-100">ID: EVE-001</p>
                <p>Name: Gianmarlo Adrian S. Abril</p>
              </div>
              <div className="attendeeItem w-[40vw] flex justify-between p-2 bg-(--primary-mint) items-center rounded-2xl border-2 border-(--sec-high) shadow-sm shadow-amber-100 cursor-pointer transition-all transition-duration-3 hover:bg-(--nav-bg) hover:scale-105">
                <p className="font-bold text-amber-100">ID: EVE-001</p>
                <p>Name: Gianmarlo Adrian S. Abril</p>
              </div>
              <div className="attendeeItem w-[40vw] flex justify-between p-2 bg-(--primary-mint) items-center rounded-2xl border-2 border-(--sec-high) shadow-sm shadow-amber-100 cursor-pointer transition-all transition-duration-3 hover:bg-(--nav-bg) hover:scale-105">
                <p className="font-bold text-amber-100">ID: EVE-001</p>
                <p>Name: Gianmarlo Adrian S. Abril</p>
              </div>
              <div className="attendeeItem w-[40vw] flex justify-between p-2 bg-(--primary-mint) items-center rounded-2xl border-2 border-(--sec-high) shadow-sm shadow-amber-100 cursor-pointer transition-all transition-duration-3 hover:bg-(--nav-bg) hover:scale-105">
                <p className="font-bold text-amber-100">ID: EVE-001</p>
                <p>Name: Gianmarlo Adrian S. Abril</p>
              </div>
              <div className="attendeeItem w-[40vw] flex justify-between p-2 bg-(--primary-mint) items-center rounded-2xl border-2 border-(--sec-high) shadow-sm shadow-amber-100 cursor-pointer transition-all transition-duration-3 hover:bg-(--nav-bg) hover:scale-105">
                <p className="font-bold text-amber-100">ID: EVE-001</p>
                <p>Name: Gianmarlo Adrian S. Abril</p>
              </div>
              <div className="attendeeItem w-[40vw] flex justify-between p-2 bg-(--primary-mint) items-center rounded-2xl border-2 border-(--sec-high) shadow-sm shadow-amber-100 cursor-pointer transition-all transition-duration-3 hover:bg-(--nav-bg) hover:scale-105">
                <p className="font-bold text-amber-100">ID: EVE-001</p>
                <p>Name: Gianmarlo Adrian S. Abril</p>
              </div>
              <div className="attendeeItem w-[40vw] flex justify-between p-2 bg-(--primary-mint) items-center rounded-2xl border-2 border-(--sec-high) shadow-sm shadow-amber-100 cursor-pointer transition-all transition-duration-3 hover:bg-(--nav-bg) hover:scale-105">
                <p className="font-bold text-amber-100">ID: EVE-001</p>
                <p>Name: Gianmarlo Adrian S. Abril</p>
              </div>
              <div className="attendeeItem w-[40vw] flex justify-between p-2 bg-(--primary-mint) items-center rounded-2xl border-2 border-(--sec-high) shadow-sm shadow-amber-100 cursor-pointer transition-all transition-duration-3 hover:bg-(--nav-bg) hover:scale-105">
                <p className="font-bold text-amber-100">ID: EVE-001</p>
                <p>Name: Gianmarlo Adrian S. Abril</p>
              </div>
              <div className="attendeeItem w-[40vw] flex justify-between p-2 bg-(--primary-mint) items-center rounded-2xl border-2 border-(--sec-high) shadow-sm shadow-amber-100 cursor-pointer transition-all transition-duration-3 hover:bg-(--nav-bg) hover:scale-105">
                <p className="font-bold text-amber-100">ID: EVE-001</p>
                <p>Name: Gianmarlo Adrian S. Abril</p>
              </div>
            </div>
          </div>
        </div>
        <AttendeeDialog/>
      </>
    );
}