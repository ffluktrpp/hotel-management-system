import { BedDouble, BookPlus, Landmark, User, Users } from "lucide-react";
import React, { useState } from "react";
import Booking from "./Booking";
import Customer from "./Customer";
import Employee from "./Employee";
import Finance from "./Finance";

function Home() {
  const [selectedMenu, setSelectedMenu] = useState("booking");
  return (
    <div className="flex h-screen bg-[#eda0d4] text-white">
      <div className="w-1/5 p-5 bg-[#b56bf2] text-white">
        <div className="flex justify-center items-center mx-auto m-4 mb-6">
          <BedDouble className="w-10 h-10 mr-4" />
          <div className="text-xl text-center font-extrabold">
            Hotel Management
          </div>
        </div>
        <ul className="transition-all">
          <li
            className={`py-4 transition-all font-bold hover:bg-white/50 hover:text-black rounded-lg ${
              selectedMenu === "booking"
                ? "bg-[#FDDBBB] text-black rounded-lg"
                : ""
            }`}
          >
            <button
              onClick={() => setSelectedMenu("booking")}
              className="w-full text-left px-4 flex items-center space-x-2"
            >
              <BookPlus className="w-5 h-5" />
              <span>Booking Management</span>
            </button>
          </li>
          <li
            className={`py-4 transition-all font-bold hover:bg-white/50 hover:text-black rounded-lg ${
              selectedMenu === "customer"
                ? "bg-[#FDDBBB] text-black rounded-lg"
                : ""
            }`}
          >
            <button
              onClick={() => setSelectedMenu("customer")}
              className="w-full text-left px-4 flex items-center space-x-2"
            >
              <User className="w-5 h-5" />
              <span>Customer Management</span>
            </button>
          </li>
          <li
            className={`py-4 transition-all font-bold hover:bg-white/50 hover:text-black rounded-lg ${
              selectedMenu === "employee"
                ? "bg-[#FDDBBB] text-black rounded-lg"
                : ""
            }`}
          >
            <button
              onClick={() => setSelectedMenu("employee")}
              className="w-full text-left px-4 flex items-center space-x-2"
            >
              <Users className="w-5 h-5" />
              <span>Employee Management</span>
            </button>
          </li>
          <li
            className={`py-4 transition-all font-bold hover:bg-white/50 hover:text-black rounded-lg ${
              selectedMenu === "finance"
                ? "bg-[#FDDBBB] text-black rounded-lg"
                : ""
            }`}
          >
            <button
              onClick={() => setSelectedMenu("finance")}
              className="w-full text-left px-4 flex items-center space-x-2"
            >
              <Landmark className="w-5 h-5" />
              <span>Finance Management</span>
            </button>
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="w-3/4 p-6">
        {selectedMenu === "booking" && <Booking />}
        {selectedMenu === "customer" && <Customer />}
        {selectedMenu === "employee" && <Employee />}
        {selectedMenu === "finance" && <Finance />}
      </div>
    </div>
  );
}

export default Home;
