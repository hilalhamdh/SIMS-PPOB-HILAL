import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHistory,
  resetHistory,
} from "../redux/transaksi/transaksiHistorySlice";
import NavbarPages from "../pages/NavbarPages";
import { useLocation } from "react-router-dom";

function TransaksiHistory() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { list, status, error, offset, limit, hasMore } = useSelector(
    (state) => state.transaksiHistory
  );

  // 👉 Tangani redirect dengan refresh
  useEffect(() => {
    const shouldRefresh = location.state?.refresh;

    if (shouldRefresh) {
      dispatch(resetHistory()); // reset state lama
      dispatch(fetchHistory({ offset: 0, limit }));
    } else if (list.length === 0) {
      dispatch(fetchHistory({ offset: 0, limit }));
    }
  }, [dispatch, location.state, list.length, limit]);

  const loadMore = () => {
    if (status !== "loading" && hasMore) {
      dispatch(fetchHistory({ offset, limit }));
    }
  };

  // ... UI tetap sama

  return (
    <>
      <NavbarPages />
      <div className="max-w-5xl mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-500">
          Semua Transaksi
        </h2>

        {/* Tampilkan error jika ada */}
        {status === "failed" && (
          <p className="text-red-600">Gagal memuat data: {error}</p>
        )}

        {/* Tidak ada transaksi */}
        {list.length === 0 && status === "succeeded" && (
          <p>Tidak ada transaksi.</p>
        )}

        {/* Daftar transaksi */}
        {list.map((item) => {
          const isTopup = item.transaction_type === "TOPUP";
          const sign = isTopup ? "+" : "-";
          const amountClass = isTopup ? "text-green-600" : "text-red-600";

          return (
            <div
              key={item.id}
              className="flex justify-between items-start border p-4 my-2 rounded shadow-sm"
            >
              <div className="flex flex-col">
                <p className="font-medium text-gray-800">
                  {item.description || "Transaksi"}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(item.created_on).toLocaleString("id-ID")}
                </p>
              </div>
              <p className={`font-semibold text-lg ${amountClass}`}>
                {sign} Rp {item.total_amount.toLocaleString("id-ID")}
              </p>
            </div>
          );
        })}

        {/* Status loading */}
        {status === "loading" && <p>Loading...</p>}

        {/* Tampilkan tombol load more */}
        {hasMore && status !== "loading" && (
          <button
            onClick={loadMore}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tampilkan Lebih Banyak
          </button>
        )}

        {/* Semua data telah dimuat */}
        {!hasMore && list.length > 0 && (
          <p className="mt-4 text-gray-500">Semua transaksi telah dimuat.</p>
        )}
      </div>
    </>
  );
}

export default TransaksiHistory;
