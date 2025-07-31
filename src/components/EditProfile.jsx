import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfile,
  updateProfile,
  updateProfileImage,
} from "../redux/profile/profileSlice";

import defaultProfile from "../assets/images/profile.png";
import { useNavigate } from "react-router-dom";
import NavbarPages from "../pages/NavbarPages";

function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { data, status } = useSelector((state) => state.profile);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [uploadError, setUploadError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");

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

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 100 * 1024) {
      setUploadError("Ukuran gambar maksimal 100 KB.");
      return;
    }

    const formData = new FormData();
    formData.append("profile_image", file);

    dispatch(updateProfileImage(formData)).then(() => {
      dispatch(fetchProfile());
    });

    setUploadError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(form)).unwrap();
      setSubmitMessage("Profil berhasil diperbarui.");
      dispatch(fetchProfile());
      setTimeout(() => navigate("/profile"), 1500);
    } catch {
      setSubmitMessage("Gagal memperbarui profil.");
    }
  };

  if (status === "loading") return <p>Loading...</p>;

  return (
    <>
      <NavbarPages />
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-xl font-semibold text-gray-600 mb-4">
          Edit Profile
        </h2>

        <div className="flex flex-col items-center mb-6">
          <img
            src={data?.profile_image || defaultProfile}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover cursor-pointer"
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
            className="hidden"
            onChange={handleFileChange}
          />
          {uploadError && (
            <p className="text-sm text-red-500 mt-2">{uploadError}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
          <label className="text-sm font-medium">
            Nama Depan:
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              required
            />
          </label>

          <label className="text-sm font-medium">
            Nama Belakang:
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              required
            />
          </label>

          <label className="text-sm font-medium">
            Email:
            <input
              type="email"
              className="border border-gray-300 p-2 rounded w-full"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mt-4"
          >
            Simpan Perubahan
          </button>

          {submitMessage && (
            <p className="text-center mt-2 text-sm text-blue-600">
              {submitMessage}
            </p>
          )}
        </form>
      </div>
    </>
  );
}

export default EditProfile;
