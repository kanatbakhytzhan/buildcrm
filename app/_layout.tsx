import { Stack } from "expo-router";
import "../global-output.css";
import { AuthProvider } from "../context/AuthContext";
import { LeadsProvider } from "../context/LeadsContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <LeadsProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#f6f6f8" },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="lead/[id]" />
          <Stack.Screen name="tasks" />
        </Stack>
      </LeadsProvider>
    </AuthProvider>
  );
}
