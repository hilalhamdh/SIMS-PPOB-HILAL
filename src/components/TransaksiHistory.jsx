import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistory } from "../redux/transaksi/transaksiHistorySlice";
import NavbarPages from "../pages/NavbarPages";

function TransaksiHistory() {
  const dispatch = useDispatch();

  const { list, status, error, offset, limit, hasMore } = useSelector(
    (state) => state.transaksiHistory
  );

  useEffect(() => {
    // Load awal
    if (list.length === 0) {
      dispatch(fetchHistory({ offset: 0, limit }));
    }
  }, [dispatch, list.length, limit]);

  const loadMore = () => {
    if (status !== "loading" && hasMore) {
      dispatch(fetchHistory({ offset, limit }));
    }
  };

  return (
    <>
      <NavbarPages />
      <div className="max-w-5xl mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-600">
          Riwayat Transaksi
        </h2>

        {Array.isArray(list) &&
          list.map((item) => {
            const isTopup = item.transaction_type === "TOPUP";
            const sign = isTopup ? "+" : "-";
            const amountClass = isTopup ? "text-green-600" : "text-red-600";
            return (
              <div
                key={item.trx_id}
                className="flex justify-between items-start border p-4 my-2 rounded shadow-sm"
              >
                <div className="flex flex-col">
                  <p className={`font-semibold text-lg ${amountClass}`}>
                    {sign} Rp{" "}
                    {Number(item.total_amount).toLocaleString("id-ID")}
                  </p>

                  <p className="text-xs text-gray-400">
                    {new Date(item.created_on).toLocaleString("id-ID")}
                  </p>
                </div>
                <p className="font-medium text-gray-800">
                  {item.transaction_type}
                </p>
              </div>
            );
          })}

        {status === "loading" && (
          <p className="text-gray-500">Memuat data...</p>
        )}

        {hasMore && status !== "loading" && (
          <button
            onClick={loadMore}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tampilkan Lebih Banyak
          </button>
        )}

        {!hasMore && list.length > 0 && (
          <p className="mt-4 text-gray-500 text-sm">
            Semua transaksi telah ditampilkan.
          </p>
        )}
      </div>
    </>
  );
}

export default TransaksiHistory;
