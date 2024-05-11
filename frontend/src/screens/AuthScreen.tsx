import Login from "@/components/Login";
import SignUp from "@/components/SignUp";
import React, { useState } from "react";

function AuthScreen() {
  const [activateState, setActivateState] = useState("login");
  return (
    <div className="w-full fixed top-0 left-0 h-screen z-50 flex items-center justify-center bg-black/20">
      <div className="w-[30%] h-fit bg-slate-900 rounded shadow-sm p-5">
        {activateState === "login" ? (
          <Login setActivateState={setActivateState}></Login>
        ) : (
          <SignUp setActivateState={setActivateState}></SignUp>
        )}
      </div>
    </div>
  );
}

export default AuthScreen;
