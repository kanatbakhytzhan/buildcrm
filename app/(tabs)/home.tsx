import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useLeads } from "../../context/LeadsContext";
import { formatDate, getRelativeTime } from "../../utils/date";

type FilterType = "new" | "success" | "failed";

export default function HomeScreen() {
  const router = useRouter();
  const { leads, isLoading, loadLeads } = useLeads();
  const [activeFilter, setActiveFilter] = useState<FilterType>("new");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    console.log("🔄 Пользователь вызвал принудительное обновление");
    setRefreshing(true);
    await loadLeads();
    setRefreshing(false);
  };

  const filteredLeads = leads.filter((lead) => lead.status === activeFilter);

  const filterLabels: Record<FilterType, string> = {
    new: "Новые",
    success: "Успешные",
    failed: "Отказные",
  };

  // Debug: логируем состояние
  console.log("🏠 HomeScreen: Всего заявок:", leads.length);
  console.log("🏠 HomeScreen: Фильтр:", activeFilter);
  console.log("🏠 HomeScreen: Отфильтровано:", filteredLeads.length);
  console.log("🏠 HomeScreen: Загрузка:", isLoading);

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      {/* Header Section */}
      <View className="px-5 pt-8 pb-4 flex-row items-center justify-between">
        <Text className="text-3xl font-extrabold text-slate-900">
          Мои заявки
        </Text>
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center rounded-full bg-primary/10 active:bg-primary/20"
          onPress={onRefresh}
          disabled={isLoading || refreshing}
        >
          {isLoading || refreshing ? (
            <ActivityIndicator size="small" color="#1349ec" />
          ) : (
            <MaterialIcons name="refresh" size={24} color="#1349ec" />
          )}
        </TouchableOpacity>
      </View>

      {/* Segmented Control */}
      <View className="px-5 py-2 mt-2">
        <View className="flex-row p-1 bg-gray-200/50 rounded-xl h-12">
          {(["new", "success", "failed"] as FilterType[]).map((filter) => (
            <TouchableOpacity
              key={filter}
              className="flex-1 relative justify-center items-center"
              activeOpacity={0.7}
              onPress={() => setActiveFilter(filter)}
            >
              {activeFilter === filter && (
                <View className="absolute inset-0 rounded-lg bg-white shadow-sm" />
              )}
              <View className="h-full w-full items-center justify-center">
                <Text
                  className={`text-sm font-semibold ${
                    activeFilter === filter
                      ? "text-slate-900"
                      : "text-gray-500"
                  }`}
                >
                  {filterLabels[filter]}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Main Content List */}
      <ScrollView 
        className="flex-1 px-5 py-4" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#1349ec"]}
            tintColor="#1349ec"
          />
        }
      >
        {isLoading ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#1349ec" />
            <Text className="text-slate-400 text-base font-medium mt-4">
              Загрузка заявок...
            </Text>
          </View>
        ) : filteredLeads.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <MaterialIcons name="inbox" size={64} color="#cbd5e1" />
            <Text className="text-slate-400 text-lg font-semibold mt-4">
              Нет заявок в этой категории
            </Text>
          </View>
        ) : (
          <View className="space-y-4 pb-4">
            {filteredLeads.map((lead) => (
              <TouchableOpacity
                key={lead.id}
                className="relative bg-surface-light rounded-2xl shadow-sm overflow-hidden active:scale-[0.98]"
                onPress={() => {
                  console.log("🔍 Открываем заявку:", { id: lead.id, name: lead.name, type: typeof lead.id });
                  router.push(`/lead/${lead.id}`);
                }}
              >
                {/* Green Left Border Indicator */}
                <View className="absolute left-0 top-0 bottom-0 w-[6px] bg-primary" />
                
                <View className="p-4 pl-6 flex flex-col gap-3">
                  <View className="flex-row justify-between items-start">
                    <View className="flex flex-col">
                      <Text className="text-lg font-bold text-slate-900">
                        {lead.name}
                      </Text>
                      <View className="flex-row items-center gap-1 mt-1">
                        <MaterialIcons name="location-on" size={18} color="#1349ec" />
                        <Text className="text-sm font-medium text-slate-500">
                          г. {lead.city}
                        </Text>
                      </View>
                    </View>
                    <View className="bg-slate-100 px-2 py-1 rounded-md">
                      <Text className="text-xs font-semibold text-slate-400">
                        {getRelativeTime(lead.created_at || lead.createdAt)}
                      </Text>
                    </View>
                  </View>

                  {/* Request Block */}
                  <View className="bg-gray-50 rounded-xl p-3">
                    <Text className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                      Запрос
                    </Text>
                    <Text className="text-sm text-slate-700 leading-relaxed" numberOfLines={2}>
                      {lead.summary || lead.request || "Нет описания"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
