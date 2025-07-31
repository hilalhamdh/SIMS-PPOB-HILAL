import { useEffect, useState } from "react";
import axios from "axios";

function BannerList() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(
          "https://take-home-test-api.nutech-integrasi.com/banner",
          { headers: { accept: "application/json" } }
        );

        if (res?.data?.status === 0) {
          setBanners(res.data.data);
        } else {
          setError(res?.data?.message || "Gagal memuat banner.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Terjadi kesalahan saat memuat banner."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) return <p>Loading banner...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className=" flex gap-4 space-y-4 mt-10">
      {banners.map((b) => (
        <div key={b.id} className="rounded overflow-hidden shadow-md">
          <img
            src={b.banner_image}
            alt={b.title || "Banner"}
            className="max-w-4xl h-20 object-cover"
          />
          {b.title && (
            <div className="p-2 bg-white">
              <h3 className="font-semibold">{b.title}</h3>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default BannerList;
