import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistory } from "../redux/transaksi/TransaksiSlice";

function History() {
  const dispatch = useDispatch();
  const { history, status, error } = useSelector((state) => state.transaksi);

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Riwayat Transaksi
      </h2>

      {status === "loading" && <p>Memuat riwayat transaksi...</p>}
      {status === "failed" && <p className="text-red-600">Error: {error}</p>}

      {status === "succeeded" && (!history || history.length === 0) && (
        <p className="text-center text-gray-600">Belum ada transaksi.</p>
      )}

      {status === "succeeded" && history && history.length > 0 && (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-3 py-2">Tanggal</th>
              <th className="border px-3 py-2">Jenis</th>
              <th className="border px-3 py-2">Nominal (Rp)</th>
              <th className="border px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((trx) => (
              <tr key={trx.id} className="text-center">
                <td className="border px-3 py-2">
                  {new Date(trx.created_at).toLocaleString("id-ID")}
                </td>
                <td className="border px-3 py-2 capitalize">{trx.jenis}</td>
                <td className="border px-3 py-2">
                  {trx.nominal.toLocaleString("id-ID")}
                </td>
                <td
                  className={`border px-3 py-2 ${
                    trx.status === "success" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {trx.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default History;
