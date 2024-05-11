import React from "react";
import styles from "@/utils/styles";
import NavItems from "../NavItems";
import ProfileDropDown from "../ProfileDropDown";
function Header() {
  return (
    <header className="w-full bg-[#0F1524] py-3">
      <div className="w-[90%] m-auto text-white  flex items-center justify-between">
        <h1 className={`${styles.logo}`}>KFOOD</h1>
        <NavItems/>
        <ProfileDropDown></ProfileDropDown>
      </div>
    </header>
  );
}

export default Header;
