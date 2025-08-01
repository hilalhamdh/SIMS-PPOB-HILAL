import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ServiceList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://take-home-test-api.nutech-integrasi.com/services",
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res?.data?.status === 0) {
          setServices(res.data.data);
        } else {
          setError(res?.data?.message || "Gagal memuat layanan.");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <p>Loading layanan...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="mt-10 grid grid-cols-12 gap-4">
      {services.map((service) => (
        <div
          key={service.service_code}
          onClick={() => navigate("/payment", { state: service })}
          className="cursor-pointer text-center hover:scale-105 transition"
        >
          <img
            src={service.service_icon}
            alt={service.service_name}
            className="w-10 h-10 mx-auto mb-2"
          />
          <p className="text-xs">{service.service_name}</p>
        </div>
      ))}
    </div>
  );
}

export default ServiceList;
