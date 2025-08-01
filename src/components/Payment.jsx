import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { pay } from "../redux/transaksi/transaksiSlicee";
import { kurangiSaldo } from "../redux/balance/balanceSlice";
import { useNavigate, useLocation } from "react-router-dom";
import NavbarPages from "../pages/NavbarPages";
import { fetchHistory } from "../redux/transaksi/transaksiHistorySlice"; // pastikan import ini ada
function Payment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedService = location.state;

  const [form, setForm] = useState({
    layanan: "",
    nominal: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (selectedService) {
      setForm({
        layanan: selectedService.service_code,
        nominal: selectedService.service_tariff,
      });
    }
  }, [selectedService]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { layanan, nominal } = form;

    if (!layanan || !nominal || nominal <= 0) {
      setMessage("Mohon isi semua field dengan benar.");
      return;
    }

    try {
      await dispatch(
        pay({
          service_code: layanan,
          transaction_amount: parseInt(nominal),
        })
      ).unwrap();

      // ✅ Kurangi saldo lokal
      dispatch(kurangiSaldo(parseInt(nominal)));

      // ✅ Ambil ulang history (langsung dari offset 0)
      dispatch(fetchHistory({ offset: 0, limit: 5 }));

      navigate("/transaksihistory", { state: { refresh: true } });
    } catch (err) {
      setMessage("Pembayaran gagal. Coba lagi.", err);
    }
  };

  return (
    <>
      <NavbarPages />
      <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded">
        <h2 className="text-xl text-gray-600 font-semibold mb-4">Pembayaran</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 p-4 rounded border-gray-300 bg-gray-100">
            {selectedService && (
              <>
                <img
                  src={selectedService.service_icon}
                  alt={selectedService.service_name}
                  className="w-6 h-6"
                />
                <span>{selectedService.service_name}</span>
              </>
            )}
          </div>

          <div>
            <input
              type="text"
              name="nominal"
              value={
                form.nominal
                  ? `Rp ${Number(form.nominal).toLocaleString("id-ID")}`
                  : ""
              }
              readOnly
              className="w-full border border-gray-300 p-2 rounded bg-gray-100 outline-0"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            disabled={!form.layanan || !form.nominal}
          >
            Bayar
          </button>

          {message && (
            <p className="mt-2 text-center text-sm text-blue-600">{message}</p>
          )}
        </form>
      </div>
    </>
  );
}

export default Payment;
