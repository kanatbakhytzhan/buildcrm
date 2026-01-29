import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Ошибка", "Заполните все поля");
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      router.replace("/(tabs)/home");
    } catch (error: any) {
      console.error("Login error:", error);
      Alert.alert("Ошибка", error.message || "Неверный логин или пароль");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-full max-w-[400px]">
          <View className="bg-white rounded-2xl shadow-2xl border border-white/20 p-8">
            {/* Logo Section */}
            <View className="flex flex-col items-center gap-2 mb-6">
              <View className="h-12 w-12 bg-primary/10 rounded-xl items-center justify-center mb-2">
                <MaterialIcons name="domain" size={32} color="#1349ec" />
              </View>
              <Text className="text-slate-900 text-3xl font-extrabold text-center">
                BuildCRM
              </Text>
              <Text className="text-gray-500 text-sm font-medium text-center">
                Войдите в ваш рабочий кабинет
              </Text>
            </View>

            {/* Form Section */}
            <View className="flex flex-col gap-5">
              {/* Email Input */}
              <View className="flex flex-col gap-2">
                <Text className="text-slate-900 text-sm font-semibold">
                  Электронная почта
                </Text>
                <TextInput
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 h-12 text-slate-900 text-base"
                  placeholder="name@company.com"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* Password Input */}
              <View className="flex flex-col gap-2">
                <Text className="text-slate-900 text-sm font-semibold">
                  Пароль
                </Text>
                <View className="relative w-full">
                  <TextInput
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 h-12 text-slate-900 text-base pr-12"
                    placeholder="••••••••"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    className="absolute right-0 top-0 h-full px-4 items-center justify-center"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <MaterialIcons 
                      name={showPassword ? "visibility" : "visibility-off"} 
                      size={20} 
                      color="#9ca3af" 
                    />
                  </TouchableOpacity>
                </View>
                {/* Forgot Password Link */}
                <View className="flex items-end mt-1">
                  <TouchableOpacity>
                    <Text className="text-primary text-sm font-semibold">
                      Забыли пароль?
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                className="w-full mt-2 items-center justify-center rounded-xl h-12 px-6 bg-primary active:bg-blue-800"
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-white text-base font-bold tracking-wide">
                    Войти
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
