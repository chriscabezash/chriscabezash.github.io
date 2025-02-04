import Papa from "papaparse";

export default async function handler(req, res) {
  const s3Url = "https://aws-s3-data-census.s3.us-east-1.amazonaws.com/Microdato_Censo2017-Comunas.csv"; // Reemplaza con tu URL pública del CSV

  try {
    const response = await fetch(s3Url);
    if (!response.ok) {
      throw new Error("No se pudo descargar el CSV desde S3");
    }

    const csvText = await response.text();

    const parsedData = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    res.status(200).json(parsedData.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
