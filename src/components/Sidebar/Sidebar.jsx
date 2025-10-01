import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaUser } from "react-icons/fa";
import { FaBasketShopping } from "react-icons/fa6";
import { MdGroups, MdLeaderboard } from "react-icons/md";
import { logout } from "../../redux/slices/authSlice";

const gradeColors = {
  Freshmen: "bg-blue-500",
  Sophomore: "bg-purple-500",
  Junior: "bg-pink-500",
  Senior: "bg-amber-500",
  Default: "bg-neutral",
};

const Sidebar = () => {
  const role = useSelector((state) => state?.auth?.role);
  const userInfo = useSelector((state) => state?.auth?.userInfo);

  // student uchun array, club uchun obyekt
  const user =
    role === "student"
      ? userInfo && userInfo.length > 0
        ? userInfo[0]
        : null
      : role === "club"
      ? userInfo
      : null;

  const [imgError, setImgError] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const gradeName =
    user && user?.grade && user?.grade?.grade_name
      ? user?.grade?.grade_name
      : "Default";
  const gradeColor = gradeColors[gradeName] || gradeColors.Default;

  const handleLogoutClick = () => {
    document.getElementById("logout_modal").showModal();
  };

  const handleLogoutConfirm = () => {
    dispatch(logout());
    navigate("/login", { state: { from: location } });
    document.getElementById("logout_modal").close();
  };

  const handleModalClose = () => {
    document.getElementById("logout_modal").close();
  };

  // Role bo‘yicha linklar
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
    <aside className="h-screen bg-base-200 p-4 shadow-lg border-r border-base-300">
      <nav className="flex flex-col h-full justify-between">
        <div>
          {/* Avatar */}
          <div
            onClick={() =>
              role === "club" ? navigate("/club-profile") : navigate("/profile")
            }
            className="flex flex-col items-center mb-4 cursor-pointer"
          >
            {/* Student bo‘lsa */}
            {role === "student" && (
              <>
                {user?.image && !imgError ? (
                  <div className="avatar">
                    <div
                      className={`w-24 rounded-full ring ${gradeColor} ring-offset-2 ring-offset-base-100 transition-all`}
                    >
                      <img
                        src={`https://api.univibe.uz${user.image}?v=${
                          user.image_updated_at || Date.now()
                        }`}
                        alt={`${user?.name || "User"} ${user?.surname || ""}`}
                        onError={() => setImgError(true)}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    className={`avatar avatar-placeholder ${gradeColor} text-neutral-content rounded-full w-24 h-24`}
                  >
                    <div className="w-full h-full text-3xl">
                      {user?.name?.[0] || "?"}
                    </div>
                  </div>
                )}
                <p className="text-center text-lg font-semibold mt-2">
                  {user?.name || "User"} <br />
                  <span className="text-sm opacity-70">{gradeName}</span>
                </p>
              </>
            )}

            {/* Club bo‘lsa */}
            {role === "club" && (
              <>
                {user?.logo && !imgError ? (
                  <div className="avatar">
                    <div className="w-24 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 transition-all">
                      <img
                        src={`https://api.univibe.uz${user.logo}?v=${
                          user.logo_updated_at || Date.now()
                        }`}
                        alt={user?.name || "Club"}
                        onError={() => setImgError(true)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="avatar avatar-placeholder bg-primary text-neutral-content rounded-full w-24 h-24">
                    <div className="w-full h-full text-3xl">
                      {user?.name?.[0] || "C"}
                    </div>
                  </div>
                )}
                <p className="text-center text-lg font-semibold mt-2">
                  {user?.name || "Club"}
                </p>
              </>
            )}
          </div>

          {/* Links */}
          <ul className="space-y-2 mt-5">
            {links.map((item) => (
              <li key={item.name} className="group">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-neutral text-neutral-content shadow-md"
                        : "hover:bg-base-300"
                    }`
                  }
                >
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout */}
        <div>
          <button
            className="btn btn-outline btn-error w-full"
            onClick={handleLogoutClick}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Logout modal */}
      <dialog
        id="logout_modal"
        className="modal"
        aria-label="Logout Confirmation"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Logout</h3>
          <p className="py-4">Are you sure you want to log out?</p>
          <div className="modal-action">
            <form method="dialog">
              <button
                className="btn btn-error mr-2"
                onClick={handleLogoutConfirm}
              >
                Confirm
              </button>
              <button className="btn" onClick={handleModalClose}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </aside>
  );
};

export default Sidebar;
