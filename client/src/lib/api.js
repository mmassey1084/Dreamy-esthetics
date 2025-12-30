const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

async function handle(res){
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.message || "Request failed.";
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export async function postJSON(path, payload){
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return handle(res);
}

export async function getJSON(path){
  const res = await fetch(`${API_BASE}${path}`);
  return handle(res);
}
