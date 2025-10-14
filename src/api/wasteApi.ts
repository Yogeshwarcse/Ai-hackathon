const API_BASE = "http://127.0.0.1:8000";

async function classifyWaste(imageFile: File) {
  const formData = new FormData();
  formData.append("file", imageFile);
  const response = await fetch(`${API_BASE}/predict/`, { method: "POST", body: formData });
  const data = await response.json();
  return data.predicted_class;
}

async function createScan(scanData: any) {
  const response = await fetch(`${API_BASE}/scans/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(scanData),
  });
  return response.json();
}

export const wasteApi = { classifyWaste, createScan };
