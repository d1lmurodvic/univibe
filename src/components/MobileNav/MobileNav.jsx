
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUser, FaBook } from 'react-icons/fa';
import { FaBasketShopping } from 'react-icons/fa6';
import { BsQrCodeScan } from "react-icons/bs";
import { MdLeaderboard } from 'react-icons/md';
import { useSelector } from 'react-redux';

const MobileNav = () => {

  const role = useSelector((state) => state?.auth?.role);
  const userInfo = useSelector((state) => state?.auth?.userInfo);


  const links =
  role === "student"
    ? [
        { name: "Home", path: "/", icon: <FaHome className="mr-2" /> },
        {
          name: "Clubs",
          path: "/clubs",
          icon: <MdGroups className="mr-2" />,
        },
        {
          name: "Shop",
          path: "/shop",
          icon: <FaBasketShopping className="mr-2" />,
        },
        {
          name: "Rating",
          path: "/rating",
          icon: <MdLeaderboard className="mr-2" />,
        },
        {
          name: "Profile",
          path: "/profile",
          icon: <FaUser className="mr-2" />,
        },
      ]
    : role === "club"
    ? [
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: <FaHome className="mr-2" />,
        },
        {
          name: "Profile",
          path: "/club-profile",
          icon: <FaUser className="mr-2" />,
        },
      ]
    : [];

  return (
    <div className="dock fixed bottom-0 left-0 right-0 bg-base-100 shadow-lg p-2 flex items-center justify-around md:hidden">
      {links.map((link) => (
        <NavLink
          key={link.name}
          to={link.path}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center p-2 w-16 ${isActive ? 'dock-active text-secondary' : 'text-base-content/70 hover:text-secondary'}`
          }
        >
          {link.icon}
          <span className="dock-label text-xs mt-1">{link.name}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default MobileNav;
