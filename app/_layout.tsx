import { Stack } from "expo-router";

export default function RootLayout() {
  return (
  <Stack screenOptions={{ headerShown: false }}>
  <Stack.Screen name="index" options={{title: 'Home'}} />
  <Stack.Screen name="quiz" options={{title: 'Quiz'}} />
  <Stack.Screen name="badgesOfHonor" options={{title: 'Badges of Honor'}} />
  <Stack.Screen name="quizRules" options={{title: 'Rules'}} />
  </Stack>
  )
}
