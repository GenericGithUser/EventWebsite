
function NavItem({ itemName, itemLink, active }) {
    console.log(active);
    console.log(`itemLLink: ${itemLink}`);
    return (
      <>
        <li>
          <a
            href={itemLink}
            className={`px-4 rounded-md transition-all ${active === itemLink.replace("#","") ? "bg-(--text-sec) font-bold" : ""}`}
          >
            {itemName}
          </a>
        </li>
      </>
    );
}

export default NavItem;