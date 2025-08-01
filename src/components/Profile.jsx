import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../redux/profile/profileSlice";
import Logo from "../assets/images/Logo.png";
import defaultProfile from "../assets/images/profile.png"; // pastikan file ini ada
import { logout } from "../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { data, status, error } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      setUploadError("Ukuran gambar maksimal 100 KB.");
      return;
    }

    const formData = new FormData();
    formData.append("profile_image", file);

    dispatch(updateProfileImage(formData)).then(() => {
      dispatch(fetchProfile()); // refresh profile
    });

    setUploadError("");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleEditProfile = () => {
    navigate("/editprofile");
  };

  if (status === "loading") return <p>Loading profile...</p>;
  if (status === "failed")
    return <p className="text-red-600">Error: {error}</p>;
  if (!data) return <p>Tidak ada data profile</p>;

  return (
    <>
      <div>
        <div className="flex p-4 px-30 items-center justify-between border-b-2 border-gray-300">
          <div className="flex items-center gap-4">
            <img src={Logo} className="w-5 h-5" />
            <h1>
              <a href="/dashboard">SIMS PPOB</a>
            </h1>
          </div>
          <ul className="flex items-center gap-6">
            <li>
              <a href="/topup">TopUp</a>
            </li>
            <li>
              <a href="/payment">Transaction</a>
            </li>
            <li>
              <a href="/profile">Akun</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <div className="flex flex-col items-center justify-center space-x-4 mx-auto mb-4">
          <img
            src={data.profile_image || defaultProfile}
            alt="Profile"
            className="w-25 h-25 rounded-full object-cover cursor-pointer"
            onClick={handleImageClick}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultProfile;
            }}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <h3 className="text-2xl font-bold ">
            {data.first_name} {data.last_name}
          </h3>
        </div>
        <div className="flex flex-col  w-full text-gray-600 gap-4">
          <label className="text-sm font-medium ">
            Email:
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full outline-0 mt-2"
              value={data.email}
              readOnly
            />
          </label>
          <label className="text-sm font-medium">
            Nama Depan:
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full outline-0 mt-2"
              readOnly
              value={data.first_name}
            />
          </label>
          <label className="text-sm font-medium">
            Nama Belakang:
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full outline-0 mt-2"
              value={data.last_name}
              readOnly
            />
          </label>
        </div>
        <div className="mt-6 flex flex-col ">
          <button
            onClick={handleEditProfile}
            className="px-4 py-1 bg-white text-red-600 rounded border border-red-400 hover:bg-gray-300"
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="px-4 mt-4  py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Profile;
