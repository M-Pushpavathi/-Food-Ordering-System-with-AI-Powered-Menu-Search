import axios, { type AxiosInstance } from "axios";

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:5000";

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT automatically
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("token");
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Global 401 handling
api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("role");
      window.localStorage.removeItem("name");
    }
    return Promise.reject(error);
  },
);

/* ------------------------------------------------------------------ */
/*  AUTH                                                              */
/* ------------------------------------------------------------------ */
export const authApi = {
 register: (payload: {
  name: string;
  email: string;
  password: string;
  role?: string;
}) =>
  api.post("/api/auth/register", {
    full_name: payload.name,
    email: payload.email,
    password: payload.password,
    role: payload.role,
  }).then((r) => r.data),
  login: (payload: { email: string; password: string }) =>
    api.post("/api/auth/login", payload).then((r) => r.data),
};

/* ------------------------------------------------------------------ */
/*  CATEGORIES                                                        */
/* ------------------------------------------------------------------ */
export const categoryApi = {
  list: () => api.get("/api/categories").then((r) => r.data),
  create: (payload: { name: string; description?: string; image?: string }) =>
    api.post("/api/categories", payload).then((r) => r.data),
  update: (id: string | number, payload: Record<string, unknown>) =>
    api.put(`/api/categories/${id}`, payload).then((r) => r.data),
  remove: (id: string | number) =>
    api.delete(`/api/categories/${id}`).then((r) => r.data),
};

/* ------------------------------------------------------------------ */
/*  MENU                                                              */
/* ------------------------------------------------------------------ */
export const menuApi = {
  list: async () => {
    const menuRes = await api.get("/api/menu");
    const categoryRes = await api.get("/api/categories");

    const menu = menuRes.data;
    const categories = categoryRes.data;

   return menu.map((item:any)=>({
    id:item.id,
    name:item.name,
    description:item.description,
    price:item.price,
    image:item.image_url || "",
    category:
      categories.find((c:any)=>c.id===item.category_id)?.name || "Food",

    category_id:item.category_id,

    is_veg:item.is_vegetarian,
    is_spicy:item.is_spicy,
    available:item.available,
}));
  },

  get: async (id: string | number) => {
    const itemRes = await api.get(`/api/menu/${id}`);
    const categoryRes = await api.get("/api/categories");

    const item = itemRes.data;
    const categories = categoryRes.data;

    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image_url || "",
      category:
        categories.find((c: any) => c.id === item.category_id)?.name || "Food",
      is_veg: item.is_vegetarian,
      is_spicy: item.is_spicy,
      available: item.available,
    };
  },

  create: (payload: Record<string, unknown>) =>
    api.post("/api/menu", payload).then((r) => r.data),

  update: (id: string | number, payload: Record<string, unknown>) =>
    api.put(`/api/menu/${id}`, payload).then((r) => r.data),

  remove: (id: string | number) =>
    api.delete(`/api/menu/${id}`).then((r) => r.data),
};

/* ------------------------------------------------------------------ */
/*  CART                                                              */
/* ------------------------------------------------------------------ */
export const cartApi = {
  list: () => api.get("/api/cart").then((r) => r.data),
 
    add: (payload: {
  menu_id: string | number;
  quantity: number;
}) =>
  api.post("/api/cart", {
    menu_item_id: payload.menu_id,
    quantity: payload.quantity,
  }).then((r) => r.data),
  update: (id: string | number, payload: { quantity: number }) =>
    api.patch(`/api/cart/${id}`, payload).then((r) => r.data),
  remove: (id: string | number) => api.delete(`/api/cart/${id}`).then((r) => r.data),
};

/* ------------------------------------------------------------------ */
/*  ORDERS                                                            */
/* ------------------------------------------------------------------ */
export const orderApi = {
  create: (payload: Record<string, unknown>) =>
    api.post("/api/orders", payload).then((r) => r.data),
  list: () => api.get("/api/orders").then((r) => r.data),
  get: (id: string | number) => api.get(`/api/orders/${id}`).then((r) => r.data),
  updateStatus: (id: string | number, status: string) =>
    api.patch(`/api/orders/${id}/status`, { status }).then((r) => r.data),
};

/* ------------------------------------------------------------------ */
/*  DASHBOARD                                                         */
/* ------------------------------------------------------------------ */
export const dashboardApi = {
  summary: () => api.get("/api/dashboard/summary").then((r) => r.data),
  orders: () => api.get("/api/dashboard/orders").then((r) => r.data),
};

/* ------------------------------------------------------------------ */
/*  AI SEARCH                                                         */
/* ------------------------------------------------------------------ */
export const aiApi = {
  search: (q: string) =>
    api.get(`/api/ai/search`, { params: { q } }).then((r) => r.data),
};

export default api;