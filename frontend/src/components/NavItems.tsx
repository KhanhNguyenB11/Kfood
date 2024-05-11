import Link from "next/link";
import React from "react";

const navItemsList = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "About",
    url: "/about",
  },
  {
    title: "Restaurants",
    url: "/restaurants",
  },

  {
    title: "Popular Foods",
    url: "/foods",
  },
  {
    title: "Contact",
    url: "/contact",
  },
];
function NavItems({activeItem = 0} : {activeItem: number}) {
  return <div>
    {navItemsList.map((item,index)=>(
        <Link key={index} href={item.url} className={`px-5 text-[18px] ${activeItem === index && "text-[#37B668]"}` }>
            {item.title}
        </Link>
    ))}
  </div>;
}

export default NavItems;
