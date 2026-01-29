import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useLeads } from "../context/LeadsContext";

export default function TasksScreen() {
  const router = useRouter();
  const { leads } = useLeads();

  // Вычисляем время 24 часа назад
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

  // Фильтруем "Горят" - новые заявки старше 24 часов
  const urgentLeads = leads.filter((lead) => {
    if (lead.status !== "new") return false;
    const createdDateStr = lead.created_at || lead.createdAt;
    if (!createdDateStr) return false;
    const createdDate = new Date(createdDateStr);
    return createdDate < twentyFourHoursAgo;
  });

  // Фильтруем "В работе" - успешные заявки
  const inProgressLeads = leads.filter((lead) => lead.status === "success");

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center rounded-full active:bg-slate-200"
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#111318" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-slate-900">Задачи</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-5 py-4" showsVerticalScrollIndicator={false}>
        {/* Блок 1: Горят */}
        <View className="mb-8">
          <View className="flex-row items-center gap-2 mb-4">
            <Text className="text-2xl">🔥</Text>
            <Text className="text-xl font-extrabold text-red-600">
              Горят (Больше суток)
            </Text>
            <View className="bg-red-100 px-2 py-0.5 rounded-full">
              <Text className="text-red-600 text-xs font-bold">
                {urgentLeads.length}
              </Text>
            </View>
          </View>

          {urgentLeads.length === 0 ? (
            <View className="bg-white rounded-2xl p-6 items-center border border-gray-100">
              <MaterialIcons name="check-circle" size={48} color="#22c55e" />
              <Text className="text-gray-500 text-base font-medium mt-2">
                Все чисто, срочных задач нет
              </Text>
            </View>
          ) : (
            <View className="space-y-3">
              {urgentLeads.map((lead) => (
                <TouchableOpacity
                  key={lead.id}
                  className="relative bg-white rounded-2xl shadow-sm overflow-hidden active:scale-[0.98]"
                  onPress={() => router.push(`/lead/${lead.id}`)}
                >
                  {/* Red Left Border */}
                  <View className="absolute left-0 top-0 bottom-0 w-[6px] bg-red-500" />

                  <View className="p-4 pl-6 flex flex-col gap-2">
                    <View className="flex-row justify-between items-start">
                      <Text className="text-lg font-bold text-slate-900">
                        {lead.name}
                      </Text>
                      <View className="bg-red-50 px-2 py-1 rounded-md">
                        <Text className="text-xs font-semibold text-red-600">
                          🔥 СРОЧНО
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <MaterialIcons name="location-on" size={16} color="#dc2626" />
                      <Text className="text-sm font-medium text-slate-500">
                        г. {lead.city}
                      </Text>
                    </View>
                    <Text
                      className="text-sm text-slate-600 mt-1"
                      numberOfLines={2}
                    >
                      {lead.summary || lead.request || "Нет описания"}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Блок 2: В работе (Успешные) */}
        <View className="mb-8">
          <View className="flex-row items-center gap-2 mb-4">
            <Text className="text-2xl">⏳</Text>
            <Text className="text-xl font-extrabold text-green-600">
              В работе (Успешные)
            </Text>
            <View className="bg-green-100 px-2 py-0.5 rounded-full">
              <Text className="text-green-600 text-xs font-bold">
                {inProgressLeads.length}
              </Text>
            </View>
          </View>

          {inProgressLeads.length === 0 ? (
            <View className="bg-white rounded-2xl p-6 items-center border border-gray-100">
              <MaterialIcons name="inbox" size={48} color="#cbd5e1" />
              <Text className="text-gray-500 text-base font-medium mt-2">
                Нет заявок в работе
              </Text>
            </View>
          ) : (
            <View className="space-y-3">
              {inProgressLeads.map((lead) => (
                <TouchableOpacity
                  key={lead.id}
                  className="relative bg-white rounded-2xl shadow-sm overflow-hidden active:scale-[0.98]"
                  onPress={() => router.push(`/lead/${lead.id}`)}
                >
                  {/* Green Left Border */}
                  <View className="absolute left-0 top-0 bottom-0 w-[6px] bg-green-500" />

                  <View className="p-4 pl-6 flex flex-col gap-2">
                    <View className="flex-row justify-between items-start">
                      <Text className="text-lg font-bold text-slate-900">
                        {lead.name}
                      </Text>
                      <View className="bg-green-50 px-2 py-1 rounded-md">
                        <Text className="text-xs font-semibold text-green-600">
                          ✅ УСПЕШНО
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <MaterialIcons name="location-on" size={16} color="#22c55e" />
                      <Text className="text-sm font-medium text-slate-500">
                        г. {lead.city}
                      </Text>
                    </View>
                    <Text
                      className="text-sm text-slate-600 mt-1"
                      numberOfLines={2}
                    >
                      {lead.summary || lead.request || "Нет описания"}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
