export async function fetchAPI(url, options = {}) {
    const token = localStorage.getItem("token");
    const isFormData = options.body instanceof FormData;
  
    const headers = {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    };
  
    const finalOptions = {
      ...options,
      headers,
    };
  
    const res = await fetch(url, finalOptions);
  
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const error = new Error(errorData.message || "API fetch failed");
      error.status = res.status;
      throw error;
    }
  
    return res.json();
  }
  