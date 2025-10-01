import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import Shop from "./pages/Shop/Shop.jsx";
import Login from "./pages/Login/Login.jsx";
import Clubs from "./pages/Clubs/Clubs.jsx";
import Rating from "./pages/Rating/Rating.jsx";
import PrivateRoute from "./hooks/PrivateRoute.jsx";
import QrCode from "./pages/QrCode/QrCode.jsx";
import StudentsRaiting from "./pages/StudentsRaiting/StudentsRaiting.jsx";
import DashboardClub from "./pages/DashboardClub/DashboardCllub.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClubProfile from "./pages/ClubProfile/ClubProfile.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "/shop",
        element: (
          <PrivateRoute>
            <Shop />
          </PrivateRoute>
        ),
      },
      {
        path: "/clubs",
        element: (
          <PrivateRoute>
            <Clubs />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <DashboardClub />
          </PrivateRoute>
        ),
      },
      {
        path: "/club-profile",
        element: (
          <PrivateRoute>
            <ClubProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "/users/rating",
        element: <Rating />,
      },
      {
        path: "/qr-scanner",
        element: <QrCode />,
      },
      {
        path: "/rating",
        element: <StudentsRaiting />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

document.title = import.meta.env.VITE_APP_TITLE;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <>
          <RouterProvider router={router} />

          {/* Global Toast Container */}
          <ToastContainer
            position="bottom-right"
            autoClose={3000} // 3 sekundda yopiladi
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored" // rangli (success - yashil, error - qizil, info - ko‘k)
          />
        </>
      </PersistGate>
    </Provider>
  </StrictMode>
);
