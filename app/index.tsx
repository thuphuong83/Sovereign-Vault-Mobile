import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/tokens';

export default function Index() {
  const { session, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return session ? (
    <Redirect href="/(app)/dashboard" />
  ) : (
    <Redirect href="/(auth)/welcome" />
  );
}
