export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
export async function api(path, method='GET', body=null, token=null){
  const headers = {'Content-Type':'application/json'};
  if(token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { method, headers, body: body? JSON.stringify(body): null });
  if(!res.ok){
    let msg = 'Request failed';
    try{ const j=await res.json(); msg=j.error||msg; }catch{}
    throw new Error(msg);
  }
  return res.json();
}