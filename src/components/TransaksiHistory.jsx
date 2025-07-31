import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistory } from "../redux/transaksi/transaksiHistorySlice";
import NavbarPages from "../pages/NavbarPages";

function TransaksiHistory() {
  const dispatch = useDispatch();
  const { list, status, error, offset, limit, hasMore } = useSelector(
    (state) => state.transaksiHistory // pastikan reducer di store namanya transaksiHistory
  );

  useEffect(() => {
    if (Array.isArray(list) && list.length === 0) {
      dispatch(fetchHistory({ offset: 0, limit }));
    }
  }, [dispatch, list.length, limit]);

  const loadMore = () => {
    if (status !== "loading" && hasMore) {
      dispatch(fetchHistory({ offset, limit }));
    }
  };

  if (!Array.isArray(list)) {
    // Jika list bukan array (misal error persist), tampilkan info error
    return (
      <>
        <NavbarPages />
        <div className="max-w-5xl mx-auto p-4">
          <p className="text-red-600">Data transaksi tidak valid.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarPages />
      <div className="max-w-5xl mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-500">
          Semua Transaksi
        </h2>

        {status === "failed" && (
          <p className="text-red-600">Gagal memuat data: {error}</p>
        )}

        {list.length === 0 && status === "succeeded" && (
          <p>Tidak ada transaksi.</p>
        )}

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

        {status === "loading" && <p>Loading...</p>}

        {hasMore && status !== "loading" && (
          <button
            onClick={loadMore}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Show More
          </button>
        )}

        {!hasMore && list.length > 0 && (
          <p className="mt-4 text-gray-500">Semua transaksi telah dimuat.</p>
        )}
      </div>
    </>
  );
}

export default TransaksiHistory;
