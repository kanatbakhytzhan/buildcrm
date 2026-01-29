import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Linking,
  Alert,
  ActivityIndicator,
  Share,
  Platform,
  ActionSheetIOS,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useLeads } from "../../context/LeadsContext";
import { useState, useEffect } from "react";
import { api } from "../../services/api";
import type { Lead } from "../../context/LeadsContext";
import { formatDate } from "../../utils/date";

export default function LeadDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getLeadById, updateLeadStatus } = useLeads();
  const [leadData, setLeadData] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLead = async () => {
      try {
        console.log("📄 LeadDetailScreen: Получен ID из параметров:", id, "Тип:", typeof id);
        
        setIsLoading(true);
        setError(null);

        // Нормализуем ID (может быть массивом или строкой)
        const leadId = Array.isArray(id) ? id[0] : id;
        console.log("📄 LeadDetailScreen: Нормализованный ID:", leadId);

        // Сначала пытаемся найти в контексте
        console.log("📄 LeadDetailScreen: Ищем в контексте...");
        let lead = getLeadById(leadId as string);

        // Если не нашли в контексте, загружаем с API
        if (!lead) {
          console.log("⚠️ LeadDetailScreen: Не найдено в контексте, загружаем с API...");
          try {
            lead = await api.getLead(leadId as string);
            console.log("✅ LeadDetailScreen: Заявка загружена с API:", lead);
          } catch (apiError: any) {
            console.error("❌ LeadDetailScreen: Ошибка загрузки с API:", apiError);
            setError(`Не удалось загрузить заявку: ${apiError.message}`);
            return;
          }
        } else {
          console.log("✅ LeadDetailScreen: Заявка найдена в контексте");
        }

        if (lead) {
          console.log("📋 LeadDetailScreen: Данные заявки:", JSON.stringify(lead, null, 2));
          console.log("📋 LeadDetailScreen: Запрос клиента (summary):", lead.summary);
          console.log("📋 LeadDetailScreen: Длина запроса:", lead.summary ? lead.summary.length : 0);
          setLeadData(lead);
        } else {
          setError("Заявка не найдена");
        }
      } catch (err: any) {
        console.error("❌ LeadDetailScreen: Общая ошибка:", err);
        setError(err.message || "Произошла ошибка");
      } finally {
        setIsLoading(false);
      }
    };

    loadLead();
  }, [id]);

  // Показываем загрузку
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background-light items-center justify-center">
        <ActivityIndicator size="large" color="#1349ec" />
        <Text className="text-slate-400 text-base font-medium mt-4">
          Загрузка заявки...
        </Text>
      </SafeAreaView>
    );
  }

  // Показываем ошибку
  if (error || !leadData) {
    return (
      <SafeAreaView className="flex-1 bg-background-light items-center justify-center px-6">
        <MaterialIcons name="error-outline" size={64} color="#ef4444" />
        <Text className="text-lg font-bold text-slate-900 mt-4">
          {error || "Заявка не найдена"}
        </Text>
        <Text className="text-sm text-slate-500 mt-2 text-center">
          ID: {Array.isArray(id) ? id[0] : id}
        </Text>
        <TouchableOpacity
          className="mt-6 px-6 py-3 bg-primary rounded-full justify-center items-center"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold">Назад к списку</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleCall = () => {
    Linking.openURL(`tel:${leadData.phone}`);
  };

  const handleWhatsApp = () => {
    Linking.openURL(`whatsapp://send?phone=${leadData.phone.replace(/\+/g, "")}`);
  };

  const handleCallFailed = async () => {
    try {
      const leadId = Array.isArray(id) ? id[0] : id;
      console.log("📝 Обновляем статус заявки на 'failed', ID:", leadId);
      await updateLeadStatus(leadId as string, "failed");
      Alert.alert("Результат", "Заявка помечена как неудачная", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.error("❌ Ошибка обновления статуса:", error);
      Alert.alert("Ошибка", `Не удалось обновить статус заявки: ${error.message || "Неизвестная ошибка"}`);
    }
  };

  const handleCallSuccess = async () => {
    try {
      const leadId = Array.isArray(id) ? id[0] : id;
      console.log("📝 Обновляем статус заявки на 'success', ID:", leadId);
      await updateLeadStatus(leadId as string, "success");
      Alert.alert("Поздравляем!", "Клиент записан на замер!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.error("❌ Ошибка обновления статуса:", error);
      Alert.alert("Ошибка", `Не удалось обновить статус заявки: ${error.message || "Неизвестная ошибка"}`);
    }
  };

  // Поделиться заявкой
  const handleShare = async () => {
    try {
      const message = `👷‍♂️ *Новый объект!*\n👤 Имя: ${leadData.name}\n📞 Тел: ${leadData.phone}\n📍 Город: ${leadData.city}\n📝 Задача: ${leadData.summary || leadData.request || "Не указано"}`;
      
      await Share.share({
        message,
        title: `Заявка от ${leadData.name}`,
      });
      
      console.log("✅ Заявка отправлена прорабу");
    } catch (error: any) {
      console.error("❌ Ошибка при отправке:", error);
      if (error.message !== "User did not share") {
        Alert.alert("Ошибка", "Не удалось поделиться заявкой");
      }
    }
  };

  // Удаление заявки
  const handleDelete = () => {
    Alert.alert(
      "Удалить заявку?",
      "Это действие нельзя отменить. Заявка будет удалена навсегда.",
      [
        {
          text: "Отмена",
          style: "cancel",
        },
        {
          text: "Удалить",
          style: "destructive",
          onPress: async () => {
            try {
              const leadId = Array.isArray(id) ? id[0] : id;
              console.log("🗑 Удаляем заявку, ID:", leadId);
              
              await api.deleteLead(leadId as string);
              
              console.log("✅ Заявка успешно удалена");
              Alert.alert("Успешно", "Заявка удалена", [
                { text: "OK", onPress: () => router.replace("/(tabs)/home") },
              ]);
            } catch (error: any) {
              console.error("❌ Ошибка удаления:", error);
              Alert.alert(
                "Ошибка",
                `Не удалось удалить заявку: ${error.message || "Проверьте соединение с интернетом"}`
              );
            }
          },
        },
      ]
    );
  };

  // Меню с опциями
  const handleMenuPress = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Отмена", "📤 Отправить прорабу", "🗑 Удалить заявку"],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 0,
          title: "Действия с заявкой",
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handleShare();
          } else if (buttonIndex === 2) {
            handleDelete();
          }
        }
      );
    } else {
      // Для Android используем Alert
      Alert.alert(
        "Действия с заявкой",
        "Выберите действие",
        [
          { text: "📤 Отправить прорабу", onPress: handleShare },
          { text: "🗑 Удалить заявку", onPress: handleDelete, style: "destructive" },
          { text: "Отмена", style: "cancel" },
        ]
      );
    }
  };

  // Проверяем, является ли заявка новой
  const isNewLead = leadData.status === "new";

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      {/* Top App Bar */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center rounded-full active:bg-slate-200"
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#111318" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-slate-900">
          Заявка #{id}
        </Text>
        <TouchableOpacity 
          className="w-10 h-10 items-center justify-center rounded-full active:bg-slate-200"
          onPress={handleMenuPress}
        >
          <MaterialIcons name="more-vert" size={24} color="#111318" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content Area */}
      <ScrollView className={`flex-1 ${isNewLead ? "pb-32" : "pb-8"}`} showsVerticalScrollIndicator={false}>
        <View className="flex flex-col px-4 pt-6 pb-8">
          {/* Client Info */}
          <View className="w-full mb-8">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-slate-900 text-2xl font-extrabold">
                {leadData.name}
              </Text>
              {!isNewLead && (
                <View className={`px-3 py-1 rounded-full ${
                  leadData.status === "success" 
                    ? "bg-green-100" 
                    : "bg-red-100"
                }`}>
                  <Text className={`text-xs font-bold ${
                    leadData.status === "success" 
                      ? "text-green-700" 
                      : "text-red-700"
                  }`}>
                    {leadData.status === "success" ? "✅ Успешно" : "❌ Отказ"}
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-slate-500 text-lg font-medium mb-2">
              {leadData.phone}
            </Text>
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="schedule" size={16} color="#94a3b8" />
              <Text className="text-slate-400 text-sm">
                {formatDate(leadData.created_at || leadData.createdAt)}
              </Text>
            </View>
          </View>

          {/* Action Bar: Button Group */}
          <View className="w-full flex-row gap-3 mb-10">
            <TouchableOpacity
              className="flex-1 h-12 rounded-full bg-[#22c55e] shadow-md active:bg-green-600 justify-center items-center"
              onPress={handleCall}
            >
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="call" size={20} color="#ffffff" />
                <Text className="text-white text-sm font-bold">Позвонить</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 h-12 rounded-full bg-surface-light border-2 border-[#22c55e] active:bg-green-50 justify-center items-center"
              onPress={handleWhatsApp}
            >
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="chat" size={20} color="#22c55e" />
                <Text className="text-[#22c55e] text-sm font-bold">WhatsApp</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Info Blocks */}
          <View className="w-full flex flex-col gap-4">
            {/* Location Item */}
            <View className="flex-row items-center gap-4 bg-surface-light p-4 rounded-2xl shadow-sm border border-slate-100">
              <View className="items-center justify-center rounded-xl bg-blue-50 w-12 h-12">
                <MaterialIcons name="location-on" size={24} color="#1349ec" />
              </View>
              <View className="flex flex-col justify-center flex-1">
                <Text className="text-slate-400 text-xs font-bold uppercase tracking-wide mb-0.5">
                  Город
                </Text>
                <Text className="text-slate-900 text-base font-semibold" numberOfLines={1}>
                  г. {leadData.city}
                </Text>
              </View>
            </View>

            {/* Details Item - Request */}
            <View className="bg-surface-light p-4 rounded-2xl shadow-sm border border-slate-100">
              <View className="flex-row items-center gap-3 mb-3">
                <View className="items-center justify-center rounded-xl bg-orange-50 w-10 h-10">
                  <MaterialIcons name="description" size={20} color="#f97316" />
                </View>
                <Text className="text-slate-900 text-base font-bold">
                  Детали запроса
                </Text>
              </View>
              <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <Text className="text-slate-700 text-base leading-relaxed">
                  {leadData.summary || leadData.request || "Нет описания запроса"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Footer - Call Result (только для новых заявок) */}
      {isNewLead && (
        <View className="absolute bottom-0 left-0 right-0 p-4 pb-8 bg-surface-light/90 border-t border-slate-200">
          <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 text-center">
            Результат звонка
          </Text>
          <View className="flex-row gap-3 w-full">
            <TouchableOpacity 
              className="flex-1 h-14 rounded-full bg-white border-2 border-red-500 active:bg-red-50 justify-center items-center"
              onPress={handleCallFailed}
            >
              <Text className="text-red-600 text-base font-bold">❌ Неудачно</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-1 h-14 rounded-full bg-[#22c55e] active:bg-green-600 shadow-lg justify-center items-center"
              onPress={handleCallSuccess}
            >
              <Text className="text-white text-base font-bold">✅ Успешно</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
