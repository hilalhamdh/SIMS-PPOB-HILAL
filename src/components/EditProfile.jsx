import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfile,
  updateProfile,
  updateProfileImage,
} from "../redux/profile/profileSlice";

import { useNavigate } from "react-router-dom";
import defaultProfile from "../assets/images/profile.png";

function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data,
    status,
    error,
    updateStatus,
    updateError,
    imageUploadStatus,
    imageUploadError,
  } = useSelector((state) => state.profile);

  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      setForm({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Ukuran gambar maksimal 10 MB.");
      return;
    }

    const formData = new FormData();
    formData.append("profile_image", file);

    dispatch(updateProfileImage(formData))
      .unwrap()
      .then(() => {
        setUploadError("");
        dispatch(fetchProfile());
      })
      .catch((err) => {
        setUploadError(err);
      });
  };

  const handleSave = () => {
    dispatch(updateProfile(form))
      .unwrap()
      .then(() => {
        alert("Profile berhasil diupdate");
        navigate("/profile");
      })
      .catch((err) => alert("Gagal update profile: " + err));
  };

  if (status === "loading") return <p>Loading profile...</p>;
  if (status === "failed")
    return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <div className="flex flex-col items-center mb-6">
        <img
          src={data?.profile_image || defaultProfile}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover cursor-pointer"
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
        {uploadError && <p className="text-red-600 mt-2">{uploadError}</p>}
        {imageUploadStatus === "loading" && <p>Uploading image...</p>}
        {imageUploadError && <p className="text-red-600">{imageUploadError}</p>}
      </div>

      <div className="flex flex-col gap-4">
        <label className="flex flex-col text-sm font-medium">
          First Name:
          <input
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded mt-1"
          />
        </label>

        <label className="flex flex-col text-sm font-medium">
          Last Name:
          <input
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded mt-1"
          />
        </label>

        <label className="flex flex-col text-sm font-medium">
          Email:
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded mt-1"
          />
        </label>

        {updateStatus === "loading" && <p>Menyimpan perubahan...</p>}
        {updateError && <p className="text-red-600">{updateError}</p>}

        <button
          onClick={handleSave}
          disabled={updateStatus === "loading"}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}

export default EditProfile;
