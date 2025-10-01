
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUser, FaBook } from 'react-icons/fa';
import { FaBasketShopping } from 'react-icons/fa6';
import { BsQrCodeScan } from "react-icons/bs";
import { MdLeaderboard } from 'react-icons/md';

const MobileNav = () => {
    const links = [
    { name: 'Home', path: '/', icon: <FaHome className="text-xl" /> },
    { name: "Rating", path: "/rating", icon: <MdLeaderboard className="mr-2" /> },
    { name: 'Scan', path: '/qr-scanner', icon: <BsQrCodeScan className="text-xl" /> },
    { name: 'Shop', path: '/shop', icon: <FaBasketShopping className="text-xl" /> },
    { name: 'Profile', path: '/profile', icon: <FaUser className="text-xl" /> },
  ];

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
