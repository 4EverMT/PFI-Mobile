import { Stack } from 'expo-router'
import { AuthProvider } from '../context/AuthContext'

export default function RootLayout () {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name='index' options={{ headerShown: false }} />
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen
          name='details/[id]'
          options={{ headerShown: true, title: 'Détails' }}
        />
        <Stack.Screen name='entrepots' options={{ headerShown: true}}/>
      </Stack>
    </AuthProvider>
  )
}
