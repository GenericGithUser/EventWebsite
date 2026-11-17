import NavItem from "./NavItem";
import { useEffect, useState } from "react";
import { Home, CircleQuestionMark, Phone } from "lucide-react";

const NAV_ITEMS = [
  { id: "home", name: "Home", icon: Home },
  { id: "about", name: "About", icon: CircleQuestionMark },
  { id: "contact", name: "Contact", icon: Phone },
];

function NavBar(){
    const [active, setActive] = useState("home");

    useEffect(()=>{
      const OBSERVERS = [];

      const observerCallback = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          } 
        });
      }

      const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -30% 0px", // triggers when section hits the upper middle screen
        threshold: 0,
      };

      const observer = new IntersectionObserver(
        observerCallback,
        observerOptions,
      );

      NAV_ITEMS.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) observer.observe(element);
      });

      return () => observer.disconnect();

    }, []);

    const handleNavClick = (e, id) =>{
        e.preventDefault();
        const element = document.getElementById(id);
        if (element){
          element.scrollIntoView({behavior: "smooth"});
          setActive(id);
        }
    }

    
    return (
      <>
        <nav className="navBar flex flex-row justify-around items-center w-[80vw] h-15 bg-(--nav-bg)/70 p-4 fixed top-0 left-0 m-auto right-0 z-50 border-amber-100 border-b-2 border-l-2 border-r-2 rounded-xl md:p-0 max-[430px]:w-screen  ">
          <h2 className="font-bold text-3xl text-amber-100 max-sm:text-2xl max-[430px]:text-xl]">Event 202X</h2>
          <ul className="items list-none flex flex-row gap-4">
            {NAV_ITEMS.map((item) => (
              <NavItem
                key={item.id}
                itemName={item.name}
                itemLink={`#${item.id}`}
                icon={item.icon}
                onClick={(e)=> handleNavClick(e, item.id)}
                active={active}
              />
            ))}
          </ul>
        </nav>
      </>
    );
}

export default NavBar;