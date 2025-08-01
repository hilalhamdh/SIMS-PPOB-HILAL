// src/components/Dashboard.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchBalance } from "../redux/balance/balanceSlice";
import { fetchProfile } from "../redux/profile/profileSlice";

import NavbarPages from "../pages/NavbarPages";

import ServiceList from "../pages/ServiceList";
import BannerList from "../pages/BannerList";

function Dashboard() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchBalance());
  }, [dispatch]);

  return (
    <>
      <NavbarPages />
      <div className="max-w-5xl mx-auto  px-6 bg-white  ">
        <ServiceList />
        <BannerList />
      </div>
    </>
  );
}

export default Dashboard;
