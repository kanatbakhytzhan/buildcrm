import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Alert } from "react-native";
import { api, getToken } from "../services/api";
import { useAuth } from "./AuthContext";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  city: string;
  summary?: string; // Описание запроса (основное поле с бэкенда)
  request?: string; // Старое поле (для обратной совместимости)
  date?: string;
  created_at?: string; // ISO date string с бэкенда (snake_case)
  createdAt?: string; // ISO date string (camelCase для совместимости)
  status: "new" | "success" | "failed";
}

interface LeadsContextType {
  leads: Lead[];
  isLoading: boolean;
  loadLeads: () => Promise<void>;
  updateLeadStatus: (id: string, newStatus: "new" | "success" | "failed") => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  getLeadById: (id: string | string[]) => Lead | undefined;
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export function LeadsProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Загрузка заявок с сервера
  const loadLeads = async () => {
    try {
      console.log("🔄 Начинаю загрузку заявок...");
      setIsLoading(true);
      
      // Проверяем токен
      const token = await getToken();
      console.log("🔑 Токен:", token ? `${token.substring(0, 20)}...` : "Отсутствует");
      
      if (!token) {
        console.warn("⚠️ Токен не найден, очищаем список заявок");
        setLeads([]);
        setIsLoading(false);
        return;
      }
      
      console.log("📡 Отправляю запрос на сервер...");
      const data = await api.getLeads();
      
      console.log("✅ Ответ сервера получен");
      console.log("📊 Количество заявок:", Array.isArray(data) ? data.length : "не массив");
      
      if (Array.isArray(data) && data.length > 0) {
        console.log("📋 Первая заявка:", JSON.stringify(data[0], null, 2));
      }
      
      setLeads(Array.isArray(data) ? data : []);
      console.log("💾 Заявки сохранены в состояние");
    } catch (error: any) {
      console.error("❌ Ошибка загрузки заявок:", error);
      console.error("❌ Тип ошибки:", error.constructor.name);
      console.error("❌ Сообщение:", error.message);
      console.error("❌ Stack:", error.stack);
      
      // Показываем Alert с детальной информацией
      Alert.alert(
        "Ошибка загрузки заявок",
        `Не удалось загрузить список заявок.\n\nОшибка: ${error.message || "Неизвестная ошибка"}\n\nПроверьте соединение с интернетом и попробуйте еще раз.`,
        [{ text: "OK" }]
      );
      
      // Очищаем список при ошибке
      setLeads([]);
    } finally {
      setIsLoading(false);
      console.log("🏁 Загрузка завершена");
    }
  };

  // Автоматическая загрузка при авторизации
  useEffect(() => {
    if (isAuthenticated) {
      loadLeads();
    } else {
      setLeads([]);
    }
  }, [isAuthenticated]);

  // Обновление статуса заявки
  const updateLeadStatus = async (id: string, newStatus: "new" | "success" | "failed") => {
    try {
      console.log("📝 updateLeadStatus: Обновляем заявку", { id, newStatus, type: typeof id });
      
      // Сначала отправляем на сервер
      await api.updateLeadStatus(id, newStatus);
      console.log("✅ updateLeadStatus: Сервер обновлен успешно");
      
      // Если успешно, обновляем локально (гибкое сравнение)
      setLeads((prevLeads) =>
        prevLeads.map((lead) => {
          const match = String(lead.id) === String(id);
          if (match) {
            console.log("🔄 updateLeadStatus: Обновляем локальную заявку", lead.id);
          }
          return match ? { ...lead, status: newStatus } : lead;
        })
      );
      console.log("✅ updateLeadStatus: Локальный стейт обновлен");
    } catch (error: any) {
      console.error("❌ updateLeadStatus: Ошибка:", error.message || error);
      throw error;
    }
  };

  // Удаление заявки
  const deleteLead = async (id: string) => {
    try {
      console.log("🗑 deleteLead: Удаляем заявку, ID:", id);
      
      // Сначала удаляем на сервере
      await api.deleteLead(id);
      console.log("✅ deleteLead: Заявка удалена на сервере");
      
      // Если успешно, удаляем локально
      setLeads((prevLeads) => {
        const filtered = prevLeads.filter((lead) => String(lead.id) !== String(id));
        console.log("🗑 deleteLead: Осталось заявок:", filtered.length);
        return filtered;
      });
      console.log("✅ deleteLead: Заявка удалена из локального стейта");
    } catch (error: any) {
      console.error("❌ deleteLead: Ошибка:", error.message || error);
      throw error;
    }
  };

  const getLeadById = (id: string | string[]) => {
    // Если id - массив, берем первый элемент
    const searchId = Array.isArray(id) ? id[0] : id;
    
    console.log("🔎 getLeadById: Ищем заявку с ID:", searchId, "Тип:", typeof searchId);
    console.log("📋 getLeadById: Всего заявок в контексте:", leads.length);
    console.log("📋 getLeadById: ID всех заявок:", leads.map(l => `${l.id} (${typeof l.id})`).join(", "));
    
    // Гибкое сравнение: приводим к строке для сравнения
    const found = leads.find((lead) => String(lead.id) === String(searchId));
    
    console.log(found ? "✅ getLeadById: Заявка найдена!" : "❌ getLeadById: Заявка НЕ найдена");
    
    return found;
  };

  return (
    <LeadsContext.Provider value={{ leads, isLoading, loadLeads, updateLeadStatus, deleteLead, getLeadById }}>
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeads() {
  const context = useContext(LeadsContext);
  if (!context) {
    throw new Error("useLeads must be used within a LeadsProvider");
  }
  return context;
}
