import { Home, CircleQuestionMark, Phone } from "lucide-react";
import { useMediaQuery } from "../lib/media";

function NavItem({ itemName, itemLink, active, icon: Icon }) {
  const isDesktop = useMediaQuery('(min-width: 650px)');
  return (
    <>
      <li>
        <a
          href={itemLink}
          className={
            isDesktop
              ? `px-4 rounded-md transition-all ${
                  active === itemLink.replace("#", "")
                    ? "bg-(--text-sec) font-bold"
                    : ""
                }`
              : "text-(--text-white)"
          }
        >
          {isDesktop ? (
            itemName
          ) : (
            <Icon
              className={`w-7 h-7  rounded-md transition-all text-(--text-white) ${active === itemLink.replace("#", "") ? "bg-(--text-sec) " : ""}`}
            />
          )}
        </a>
      </li>
    </>
  );
}

export default NavItem;
