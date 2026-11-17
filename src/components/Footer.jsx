import { FaSquareFacebook } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
function Footer() {
  return (
    <footer
      className="footer flex flex-row justify-around  w-full h-95 bg-(--sec-high) p-4 gap-2  border-t-2 border-l-2 border-r-2 rounded-tl-xl rounded-tr-xl max-[500px]:flex-col"
      id="contact"
    >
      <div className="cont1">
        <h2 className="font-bold text-3xl text-amber-100">Event 202X </h2>
        <p>Contact Us At: </p>
        <div className="social flex gap-3 items-center">
          <FaSquareFacebook size={40} />
          Event202X (Official)
        </div>
        <div className="social flex gap-3 items-center">
          <RiInstagramFill size={40} />
          event202x.official
        </div>
        <div className="social flex gap-3 items-center">
          <MdEmail size={40} />
          event202xOfficial@gmail.com
        </div>
      </div>
      <div className="cont2">
        <p className="text-amber-100">© 202X Event. All rights reserved.</p>
        <h3 className="text-2xl font-medium text-yellow-200">
          Made By Group 1
        </h3>
        <h3 className="text-2xl font-medium text-yellow-200">
          Abril | Agacita | Moscoso | Toledo
        </h3>
        <a
          href="https://event202x-admin.web.app/login"
          target="_blank"
          rel="noopener noreferrer"
          className="text-(--text-sec)"
        >
          Admin Website
        </a>
      </div>
    </footer>
  );
}

export default Footer;
