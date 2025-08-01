// src/components/TopUp.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { topUp } from "../redux/balance/BalanceSlice";
import { useNavigate } from "react-router-dom";
import NavbarPages from "../pages/NavbarPages";
import Dashboard from "./Dashboard";

function TopUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { saldo, status } = useSelector((state) => state.balance);

  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nominal = Number(amount);
    if (!Number.isInteger(nominal) || nominal <= 0) {
      setMessage("Nominal tidak valid");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Token saat topup:", token); // DEBUG

      const result = await dispatch(topUp(nominal)).unwrap();
      setMessage(
        `Top up sebesar Rp ${nominal.toLocaleString("id-ID")} berhasil.`
      );
      setAmount("");
      navigate("/transaksihistory");
    } catch (error) {
      console.error("Top up gagal:", error);
      setMessage(`Top up gagal: ${error}`);
    }
  };
  return (
    <>
      <NavbarPages />
      <div>
        <div className="max-w-5xl mx-auto  p-6  rounded  bg-white">
          <p className="text-sm text-gray-600 mb-1 ">Silahkan Masukkan</p>
          <h1 className="text-xl font-semibold">Nominal Top Up</h1>

          <form onSubmit={handleSubmit} className="space-y-4 mt-3">
            {/* Input dan Tombol preset dalam satu baris */}
            <div className="flex flex-row gap-4 items-start">
              {/* Input manual */}
              <div className="flex-1">
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  placeholder="Masukkan nominal Top Up"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border border-gray-400 text-sm py-2 px-2 rounded focus:outline-none focus:border-gray-400"
                />
                <button
                  type="submit"
                  className={`w-full py-1 mt-2 rounded text-white ${
                    !amount || Number(amount) <= 0 || status === "loading"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                  disabled={
                    !amount || Number(amount) <= 0 || status === "loading"
                  }
                >
                  {status === "loading" ? "Memproses..." : "Top Up Sekarang"}
                </button>

                {/* Pesan hasil */}
                {message && (
                  <p className="mt-2 text-center text-sm text-green-600">
                    {message}
                  </p>
                )}
              </div>

              {/* Tombol preset */}
              <div className="grid grid-cols-3 gap-2">
                {[10000, 20000, 50000, 100000, 250000, 500000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val.toString())}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded text-sm whitespace-nowrap"
                  >
                    Rp {val.toLocaleString("id-ID")}
                  </button>
                ))}
              </div>
            </div>

            {/* Tombol Submit */}
          </form>
        </div>
      </div>
    </>
  );
}

export default TopUp;
