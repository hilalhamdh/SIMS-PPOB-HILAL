// src/components/Dashboard.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBalance } from "../redux/balance/BalanceSlice";
import { fetchProfile } from "../redux/profile/profileSlice";
import { useNavigate } from "react-router-dom";
import NavbarPages from "../pages/NavbarPages";

import ServiceList from "../pages/ServiceList";
import BannerList from "../pages/BannerList";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
