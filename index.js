import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrar módulos de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Home() {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/csv")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          // Procesar los datos para el gráfico
          const edades = data.map((item) => parseInt(item.edad, 10)).filter((e) => !isNaN(e));
          const labels = [...new Set(edades)].sort((a, b) => a - b);
          const counts = labels.map((label) => edades.filter((e) => e === label).length);

          setChartData({
            labels,
            datasets: [
              {
                label: "Distribución de edades",
                data: counts,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
              },
            ],
          });
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Datos del Censo en Chile</h1>
      {chartData ? <Bar data={chartData} /> : <p>Cargando datos...</p>}
    </div>
  );
}
