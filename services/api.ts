import { setToken as storageSetToken, getToken as storageGetToken, deleteToken as storageDeleteToken } from "./storage";

const BASE_URL = "https://crm-api-5vso.onrender.com";
const TOKEN_KEY = "auth_token";

// Сохранение токена (web: localStorage, native: SecureStore)
export const saveToken = async (token: string): Promise<void> => {
  await storageSetToken(TOKEN_KEY, token);
};

// Получение токена
export const getToken = async (): Promise<string | null> => {
  return await storageGetToken(TOKEN_KEY);
};

// Удаление токена
export const removeToken = async (): Promise<void> => {
  await storageDeleteToken(TOKEN_KEY);
};

// Базовая функция для API запросов
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  try {
    console.log(`🌐 apiRequest: ${options.method || 'GET'} ${BASE_URL}${endpoint}`);
    
    const token = await getToken();
    console.log(`🔑 apiRequest: Токен ${token ? 'присутствует' : 'отсутствует'}`);
    
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    console.log(`📤 apiRequest: Отправка запроса...`);
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    console.log(`📬 apiRequest: Получен ответ со статусом ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`❌ apiRequest: Ошибка ${response.status}:`, errorData);
      throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ apiRequest: Успешный ответ`);
    return data;
  } catch (error) {
    console.error(`❌ API Error (${endpoint}):`, error);
    throw error;
  }
};

// API методы
export const api = {
  // Вход в систему (FastAPI OAuth2)
  login: async (email: string, password: string): Promise<{ token: string; user: any }> => {
    try {
      // FastAPI OAuth2PasswordRequestForm ожидает application/x-www-form-urlencoded
      const formData = new URLSearchParams();
      formData.append('username', email); // FastAPI использует 'username', не 'email'
      formData.append('password', password);

      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // FastAPI OAuth2 возвращает access_token
      const token = data.access_token || data.token;
      
      if (token) {
        await saveToken(token);
      }
      
      return { token, user: data.user || {} };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // Выход из системы
  logout: async (): Promise<void> => {
    await removeToken();
  },

  // Получение списка заявок
  getLeads: async (): Promise<any[]> => {
    console.log("📡 API: Запрос на /api/leads");
    const data = await apiRequest("/api/leads");
    console.log("📥 API: Получен ответ:", JSON.stringify(data, null, 2));
    
    let leads = data.leads || data;
    
    // Нормализация данных
    if (Array.isArray(leads)) {
      leads = leads.map((lead: any) => ({
        ...lead,
        summary: lead.summary || lead.request || lead.description || "",
        createdAt: lead.created_at || lead.createdAt || new Date().toISOString(),
      }));
      console.log("📊 API: Обработано заявок:", leads.length);
    } else {
      console.error("❌ API: Данные не являются массивом:", typeof leads);
      return [];
    }
    
    return leads;
  },

  // Обновление статуса заявки
  updateLeadStatus: async (
    id: string,
    status: "new" | "success" | "failed"
  ): Promise<any> => {
    return await apiRequest(`/api/leads/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  // Удаление заявки
  deleteLead: async (id: string): Promise<void> => {
    console.log("🗑 API: Удаление заявки, ID:", id);
    await apiRequest(`/api/leads/${id}`, {
      method: "DELETE",
    });
    console.log("✅ API: Заявка удалена успешно");
  },

  // Получение конкретной заявки
  getLead: async (id: string): Promise<any> => {
    console.log("📡 API: Запрос одной заявки, ID:", id);
    const data = await apiRequest(`/api/leads/${id}`);
    console.log("📥 API: Получена заявка:", JSON.stringify(data, null, 2));
    
    // Нормализация
    const normalized = {
      ...data,
      summary: data.summary || data.request || data.description || "",
      createdAt: data.created_at || data.createdAt || new Date().toISOString(),
    };
    
    console.log("📝 API: Поле summary:", normalized.summary || "ПУСТО");
    console.log("📅 API: Дата создания:", normalized.createdAt);
    return normalized;
  },
};
