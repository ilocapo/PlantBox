import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" backgroundColor="#d7fcfa86" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#d7fcfa86' },
        }}
      />
    </>
  );
}
