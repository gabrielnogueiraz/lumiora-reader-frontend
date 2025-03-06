interface RequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: HeadersInit;
  body?: any;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  ok: boolean;
}

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3333/api";

const addAuthHeader = (headers: HeadersInit = {}): HeadersInit => {
  const token = localStorage.getItem("token");

  let authHeaders: Record<string, string> = {};

  if (headers && typeof headers === "object" && !Array.isArray(headers)) {
    authHeaders = { ...(headers as Record<string, string>) };
  }

  if (token) {
    authHeaders["Authorization"] = `Bearer ${token}`;
  }

  return authHeaders;
};

const handleResponseError = async (response: Response): Promise<never> => {
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // window.location.href = '/login';
  }

  if (response.status === 403) {
    console.error("Acesso não autorizado");
  }

  if (response.status >= 500) {
    console.error("Erro no servidor");
  }

  let errorData;
  try {
    errorData = await response.json();
  } catch {
    errorData = { message: "Erro desconhecido" };
  }

  const error = new Error(errorData.message || `Erro HTTP: ${response.status}`);
  throw Object.assign(error, {
    status: response.status,
    data: errorData,
  });
};

const fetchApi = async <T>(
  endpoint: string,
  options: RequestOptions
): Promise<ApiResponse<T>> => {
  const url = `${API_URL}${
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  }`;

  let fetchOptions: RequestInit = {
    method: options.method,
    headers: {
      "Content-Type": "application/json",
      ...addAuthHeader(options.headers || {}),
    },
  };

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      return handleResponseError(response);
    }

    if (response.status === 204) {
      return {
        data: {} as T,
        status: response.status,
        ok: true,
      };
    }

    const data = await response.json();
    return {
      data,
      status: response.status,
      ok: true,
    };
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw error;
  }
};

const apiService = {
  get: <T>(endpoint: string, headers?: HeadersInit): Promise<T> =>
    fetchApi<T>(endpoint, { method: "GET", headers }).then(
      (response) => response.data
    ),

  post: <T>(endpoint: string, body?: any, headers?: HeadersInit): Promise<T> =>
    fetchApi<T>(endpoint, { method: "POST", body, headers }).then(
      (response) => response.data
    ),

  put: <T>(endpoint: string, body?: any, headers?: HeadersInit): Promise<T> =>
    fetchApi<T>(endpoint, { method: "PUT", body, headers }).then(
      (response) => response.data
    ),

  delete: <T>(endpoint: string, headers?: HeadersInit): Promise<T> =>
    fetchApi<T>(endpoint, { method: "DELETE", headers }).then(
      (response) => response.data
    ),

  patch: <T>(endpoint: string, body?: any, headers?: HeadersInit): Promise<T> =>
    fetchApi<T>(endpoint, { method: "PATCH", body, headers }).then(
      (response) => response.data
    ),
};

export default apiService;
