// src/components/Navbar.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import coin from "../../assets/coin.png";

const gradeColors = {
  Freshmen: "bg-blue-500",
  Sophomore: "bg-purple-500",
  Junior: "bg-pink-500",
  Senior: "bg-amber-500",
  Default: "bg-neutral",
};

// ✅ Helper to normalize user image/club logo URL
const getUserImage = (user) => {
  const path = user?.image || user?.logo;
  if (!path) return null;

  // If backend already provides a full URL
  if (path.startsWith("http")) return path;

  // Otherwise prepend API domain
  return `https://api.univibe.uz${path}?v=${user?.image_updated_at || Date.now()}`;
};

const Navbar = ({ tokens }) => {
  const role = useSelector((state) => state?.auth?.role);
  const userInfo = useSelector((state) => state?.auth?.userInfo);

  const user =
    role === "student"
      ? userInfo && userInfo.length > 0
        ? userInfo[0]
        : null
      : role === "club"
      ? userInfo
      : null;

  const [imgError, setImgError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const gradeName =
    role === "student" && user?.grade?.grade_name
      ? user?.grade?.grade_name
      : "Default";
  const gradeColor = gradeColors[gradeName] || gradeColors.Default;

  const handleLogoutClick = () => {
    setIsModalOpen(true);
    document.getElementById("logout_modal").showModal();
  };

  const handleLogoutConfirm = () => {
    dispatch(logout());
    navigate("/login", { state: { from: location } });
    document.getElementById("logout_modal").close();
    setIsModalOpen(false);
  };

  const handleModalClose = () => {
    document.getElementById("logout_modal").close();
    setIsModalOpen(false);
  };

  return (
    <div className="bg-base-200 hidden md:flex navbar shadow-sm">
      {/* Navbar Start */}
      <div className="navbar-start">
        <input className="input input-md" placeholder="Search" type="text" />
      </div>

      <div className="navbar-center"></div>

      {/* Navbar End */}
      <div className="navbar-end">
        {/* Tokens */}
        <div className="flex items-center mr-4 border border-primary py-2 px-5 gap-2 rounded">
          <img src={coin} alt="coin" className="w-6" />
          <span className="text-primary">{tokens || user?.tokens || 0}</span>
        </div>

        {/* Profile Dropdown */}
        <div className="dropdown dropdown-end">
          {getUserImage(user) && !imgError ? (
            <div
              tabIndex={0}
              role="button"
              className="avatar select-none cursor-pointer"
            >
              <div
                className={`w-10 rounded-full ring ${gradeColor} ring-offset-2 ring-offset-base-100 transition-all`}
              >
                <img
                  src={getUserImage(user)}
                  alt={user?.name || user?.club_name || "User"}
                  onError={() => setImgError(true)}
                />
              </div>
            </div>
          ) : (
            <div
              tabIndex={0}
              role="button"
              className={`avatar select-none avatar-placeholder cursor-pointer ${gradeColor} text-neutral-content rounded-full w-10 h-10`}
            >
              <div className="text-xl">
                {user?.name?.[0] || user?.club_name?.[0] || "?"}
              </div>
            </div>
          )}

          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-sm"
          >
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="#">Settings</Link>
            </li>
            <li>
              <button
                onClick={handleLogoutClick}
                className="text-error font-bold"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
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
    </div>
  );
};

export default Navbar;
  