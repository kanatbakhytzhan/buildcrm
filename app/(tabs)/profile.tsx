import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Switch,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  const handleSupport = () => {
    const phoneNumber = "77768776637";
    const message = "Привет, нужна помощь с приложением BuildCRM";
    Linking.openURL(`whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`);
  };

  const handleTasks = () => {
    router.push("/tasks");
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-6 pb-2 justify-center">
        <View className="w-12" />
        <Text className="text-slate-900 text-lg font-bold text-center flex-1">
          Профиль
        </Text>
        <View className="w-12" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 items-center w-full px-4 pb-8">
          {/* Profile Header */}
          <View className="w-full py-8 flex flex-col items-center gap-4">
            <View className="relative">
              <View className="rounded-full h-28 w-28 border-4 border-white shadow-sm overflow-hidden">
                <Image
                  source={require("../../profile.jpeg")}
                  className="h-full w-full"
                />
              </View>
              <View className="absolute bottom-1 right-1 bg-primary rounded-full p-1.5 border-2 border-white items-center justify-center shadow-sm">
                <MaterialIcons name="verified" size={16} color="#ffffff" />
              </View>
            </View>

            <View className="flex flex-col items-center text-center">
              <Text className="text-slate-900 text-2xl font-bold">
                Канат
              </Text>
              <View className="mt-1 flex-row items-center gap-2">
                <Text className="text-gray-500 text-base font-medium">
                  Владелец
                </Text>
                <View className="bg-primary/10 px-2.5 py-0.5 rounded-full">
                  <Text className="text-primary text-xs font-bold">skai_media</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Menu List (iOS Style Group) */}
          <View className="w-full rounded-2xl overflow-hidden bg-white shadow-sm">
            {/* Notifications Item */}
            <View className="flex-row items-center px-4 py-4 bg-white">
              <View className="bg-primary/10 items-center justify-center rounded-full w-10 h-10">
                <MaterialIcons name="notifications" size={20} color="#1349ec" />
              </View>
              <Text className="text-slate-900 text-base font-medium flex-1 ml-3">
                Уведомления
              </Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#e9e9ea", true: "#1349ec" }}
                thumbColor="#ffffff"
              />
            </View>

            {/* Divider */}
            <View className="h-px w-full bg-gray-100 ml-16" />

            {/* Tasks Item */}
            <TouchableOpacity 
              className="flex-row items-center px-4 py-4 bg-white active:bg-gray-50"
              onPress={handleTasks}
            >
              <View className="bg-red-50 items-center justify-center rounded-full w-10 h-10">
                <Text className="text-xl">🔥</Text>
              </View>
              <Text className="text-slate-900 text-base font-medium flex-1 ml-3">
                Задачи
              </Text>
              <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
            </TouchableOpacity>

            {/* Divider */}
            <View className="h-px w-full bg-gray-100 ml-16" />

            {/* Support Item */}
            <TouchableOpacity 
              className="flex-row items-center px-4 py-4 bg-white active:bg-gray-50"
              onPress={handleSupport}
            >
              <View className="bg-primary/10 items-center justify-center rounded-full w-10 h-10">
                <MaterialIcons name="headset-mic" size={20} color="#1349ec" />
              </View>
              <Text className="text-slate-900 text-base font-medium flex-1 ml-3">
                Техподдержка
              </Text>
              <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <View className="w-full mt-8">
            <TouchableOpacity
              className="w-full flex-row items-center justify-center gap-2 bg-red-50 active:bg-red-100 py-4 rounded-2xl"
              onPress={handleLogout}
            >
              <MaterialIcons name="logout" size={20} color="#dc2626" />
              <Text className="text-red-600 font-bold">Выйти из аккаунта</Text>
            </TouchableOpacity>
            <Text className="text-center text-xs text-gray-400 mt-4">
              Версия приложения 2.4.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
