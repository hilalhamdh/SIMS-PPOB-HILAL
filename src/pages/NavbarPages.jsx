import Logo from "../assets/images/Logo.png";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBalance } from "../redux/balance/balanceSlice";
import { fetchProfile } from "../redux/profile/profileSlice";
import { useNavigate } from "react-router-dom";
import defaultProfile from "../assets/images/profile.png";
import { FiEye, FiEyeOff } from "react-icons/fi";

const NavbarPages = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: profile,
    status: profileStatus,
    error: profileError,
  } = useSelector((state) => state.profile);

  const { saldo } = useSelector((state) => state.balance);

  const [isSaldoHidden, setIsSaldoHidden] = useState(true);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchBalance());
  }, [dispatch]);

  const toggleSaldo = () => {
    setIsSaldoHidden((prev) => !prev);
  };

  return (
    <div>
      <div className="flex p-4 px-30 items-center justify-between border-b-2 border-gray-300 ">
        <div className="flex items-center gap-4 ">
          <img src={Logo} className="w-5 h-5" />
          <h1>
            <a href="/dashboard">SIMS PPOB</a>
          </h1>
        </div>
        <div>
          <ul className="flex items-center gap-6 ">
            <li>
              <a href="/topup">TopUp </a>
            </li>
            <li>
              <a href="/transaksihistory">Transaction</a>
            </li>
            <li>
              <a href="/profile">Akun</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-5 px-6 pt-6   bg-white rounded ">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
          {profileStatus === "loading" && <p>Loading profile...</p>}
          {profileError && (
            <p className="text-red-600 mb-4">Error: {profileError}</p>
          )}

          {profile && (
            <div className="mb-6">
              <img
                src={profile.profile_image || defaultProfile}
                alt="Profile"
                className="w-25 h-25 rounded-full object-cover cursor-pointer pb-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultProfile;
                }}
              />
              <p className="text-sm text-gray-500">Selamat Datang,</p>
              <h3 className="text-2xl font-bold ">
                {profile.first_name} {profile.last_name}
              </h3>
            </div>
          )}

          <div
            className="w-[400px] mb-6 p-4 border rounded text-white bg-cover bg-center"
            style={{ backgroundImage: "url('/image/saldo.png')" }}
          >
            <h4 className="text-lg font-medium mb-2">Saldo Anda</h4>
            <p className="text-xl font-bold text-green-100 mb-2 ">
              <span>Rp </span>
              {isSaldoHidden
                ? "•••••••"
                : `${saldo?.toLocaleString("id-ID") || "0"}`}
            </p>

            <button
              onClick={toggleSaldo}
              className="flex items-center gap-2 text-sm text-white hover:text-gray-200"
            >
              {isSaldoHidden ? "Lihat Saldo" : "Tutup Saldo"}
              {isSaldoHidden ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarPages;
