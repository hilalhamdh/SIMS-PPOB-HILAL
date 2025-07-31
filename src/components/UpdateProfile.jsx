import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

function UpdateProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    data: profile,
    status,
    error,
    uploadStatus,
    uploadError,
  } = useSelector((state) => state.profile);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      alert("Format harus PNG atau JPEG");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload image jika ada
    if (imageFile) {
      await dispatch(uploadProfileImage(imageFile));
    }

    // Update nama
    dispatch(updateProfile(form));
  };

  useEffect(() => {
    if (status === "update_success") {
      alert("Profil berhasil diperbarui!");
      navigate("/profile");
    }
  }, [status, navigate]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Profil</h2>

      {(error || uploadError) && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-400 rounded">
          {error || uploadError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload */}
        <div>
          <label className="block mb-1 font-medium">Foto Profil</label>
          {imagePreview || profile?.profile_image ? (
            <img
              src={imagePreview || profile.profile_image}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-full mb-2"
            />
          ) : null}
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Text Inputs */}
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={form.last_name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {status === "loading" || uploadStatus === "loading"
            ? "Menyimpan..."
            : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}

export default UpdateProfile;
