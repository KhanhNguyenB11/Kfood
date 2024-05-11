"use client";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { CgProfile } from "react-icons/cg";
import React, { useState } from "react";
import AuthScreen from "@/screens/AuthScreen";

function ProfileDropDown() {
    const [signedIn,setSignedIn] = useState(false);
    const [openModal,setOpenModal] = useState(false)
  return (
    <div className="flex items-center gap-4">
      {
        signedIn ? (
            <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar as="button" className="transition-transform" src=""></Avatar>
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Action" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">
                Signed In as ...
            </p>
          </DropdownItem>
          <DropdownItem key="settings">My Profile</DropdownItem>
          <DropdownItem key="all_orders">All orders</DropdownItem>
          <DropdownItem key="team_settings">Apply for seller account</DropdownItem>
          <DropdownItem key="logout" color="danger">Logout</DropdownItem>
        </DropdownMenu>
      </Dropdown>
        ) : (
            <CgProfile className="text-3xl cursor-pointer" onClick={()=> setOpenModal(true)}></CgProfile>
        )

        
      }
      {
            openModal && <AuthScreen />
        }
    </div>
  );
}

export default ProfileDropDown;
