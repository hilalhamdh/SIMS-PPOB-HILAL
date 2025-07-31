import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { MdAlternateEmail } from "react-icons/md";
import { PiLockKey } from "react-icons/pi";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Logi from "../assets/images/Login.png";
import Logo from "../assets/images/Logo.png";
import { FiUser } from "react-icons/fi";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, first_name, last_name, password, confirmPassword } = form;

    if (!email || !first_name || !last_name || !password || !confirmPassword) {
      alert("Semua field wajib diisi!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Konfirmasi password tidak cocok!");
      return;
    }

    dispatch(register({ email, first_name, last_name, password }));
  };

  useEffect(() => {
    if (status === "register_success") {
      alert("Registrasi berhasil! Silakan login.");
      navigate("/login");
    }
  }, [status, navigate]);

  return (
    <div className="flex items-center justify-center mx-auto min-h-screen gap-4  bg-gray-50">
      <div className="w-[450px] rounded shadow-md bg-white p-6">
        <div className="flex items-center justify-center gap-3 pb-4">
          <img src={Logo} alt="logo" className="w-5 h-5" />
          <h1 className="text-md font-bold">SIMS PPOB</h1>
        </div>

        <h2 className="text-md font-semibold mb-4 text-center">
          Lengkapi data untuk membuat akun
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-400 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="flex items-center border border-gray-300 p-2 rounded">
            <MdAlternateEmail className="text-gray-500 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Masukkan email anda"
              value={form.email}
              onChange={handleChange}
              className="w-full outline-none"
              required
            />
          </div>

          {/* First Name */}
          <div className="relative flex items-center border border-gray-300 p-2 rounded">
            <FiUser className="text-gray-500 mr-2" />
            <input
              type="text"
              name="first_name"
              placeholder="Nama Depan"
              value={form.first_name}
              onChange={handleChange}
              className="w-full outline-none"
              required
            />
          </div>
          {/* Last Name */}
          <div className="relative flex items-center border border-gray-300 p-2 rounded">
            <FiUser className="text-gray-500 mr-2" />
            <input
              type="text"
              name="last_name"
              placeholder="Nama Belakang"
              value={form.last_name}
              onChange={handleChange}
              className="w-full outline-none"
              required
            />
          </div>

          {/* Password */}
          <div className="relative flex items-center border border-gray-300 p-2 rounded">
            <PiLockKey className="text-gray-500 mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full outline-none pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-gray-500"
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative flex items-center border border-gray-300 p-2 rounded">
            <PiLockKey className="text-gray-500 mr-2" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Konfirmasi Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full outline-none pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 text-gray-500"
              tabIndex={-1}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:opacity-50"
          >
            {status === "loading" ? "Loading..." : "Daftar"}
          </button>

          {/* Link ke login */}
          <p className="text-center text-xs">
            Sudah punya akun?{" "}
            <a href="/login" className="text-red-400 hover:underline">
              Masuk di sini
            </a>
          </p>
        </form>
      </div>

      <div>
        <img src={Logi} className="w-[500px] h-[500px] " alt="login" />
      </div>
    </div>
  );
}

export default Register;
