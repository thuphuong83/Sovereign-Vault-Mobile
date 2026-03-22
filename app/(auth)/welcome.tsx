import { View, Text, Pressable, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing } from '@/constants/tokens';

export default function WelcomeScreen() {
  return (
    <View className="flex-1 bg-primary">
      <SafeAreaView className="flex-1 justify-between px-6 pb-10">
        {/* Header */}
        <View className="pt-8">
          <Text
            style={{ ...Typography.label_md, color: Colors.tertiary, letterSpacing: 3 }}
            className="uppercase mb-2"
          >
            Sovereign Vault
          </Text>
        </View>

        {/* Hero Copy */}
        <View>
          <Text
            style={{ ...Typography.display_sm, color: Colors.on_primary }}
            className="mb-4"
          >
            The Digital{'\n'}Private Bank.
          </Text>
          <Text
            style={{ ...Typography.body_lg, color: Colors.secondary_container }}
            className="mb-12 leading-relaxed"
          >
            A sophisticated ledger for the modern curator. Manage your global
            wealth within a singular, secure ecosystem.
          </Text>

          {/* CTAs */}
          <Pressable
            onPress={() => router.push('/(auth)/register')}
            className="rounded-md py-4 px-6 mb-4 items-center"
            style={{ backgroundColor: Colors.tertiary_fixed }}
          >
            <Text style={{ ...Typography.label_lg, color: Colors.on_tertiary_container }}>
              Establish Your Vault
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/(auth)/login')}
            className="rounded-md py-4 px-6 items-center border border-white/20"
          >
            <Text style={{ ...Typography.label_lg, color: Colors.on_primary }}>
              Sign In
            </Text>
          </Pressable>
        </View>

        {/* Footer note */}
        <Text
          style={{ ...Typography.body_sm, color: Colors.outline }}
          className="text-center"
        >
          Institutional-grade security. Your data, your sovereignty.
        </Text>
      </SafeAreaView>
    </View>
  );
}
