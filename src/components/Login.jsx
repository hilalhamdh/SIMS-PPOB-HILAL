import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import Logi from "../assets/images/Login.png";
import Logo from "../assets/images/Logo.png";
import { MdAlternateEmail } from "react-icons/md";
import { PiLockKey } from "react-icons/pi";
import { FiEye, FiEyeOff } from "react-icons/fi";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, status, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Semua field wajib diisi!");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      alert("Format email tidak valid");
      return;
    }

    if (form.password.length < 8) {
      alert("Password minimal 8 karakter");
      return;
    }

    dispatch(login(form));
  };

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center mx-auto min-h-screen gap-4">
      <div className=" w-[450px] rounded shadow-md bg-white">
        <div className="flex items-center justify-center gap-3 pb-4">
          <img src={Logo} alt="logo" className="w-5 h-5" />
          <h1 className="text-md font-bold">SIMS PPOB</h1>
        </div>
        <div className="flex items-center justify-center">
          <h2 className="w-50 text-md font-semibold mb-4 text-center">
            Masuk atau buat akun untuk memulai
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-400 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 px-3 pb-10">
          {/* Input Email */}
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

          {/* Input Password */}
          <div className="relative flex items-center border border-gray-300 rounded">
            <PiLockKey className="text-gray-500 ml-2" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 pl-3 pr-10 outline-none bg-transparent"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-gray-500 focus:outline-none"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:opacity-50"
          >
            {status === "loading" ? "Loading..." : "Masuk"}
          </button>

          {/* Link ke register */}
          <p className="text-center text-xs">
            Belum punya akun? registrasi{" "}
            <a href="/register" className="text-red-400 hover:underline">
              Disini
            </a>
          </p>
        </form>
      </div>
      <div className="">
        <img src={Logi} className="w-[500px] h-[500px]" />
      </div>
    </div>
  );
}

export default Login;
