import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { Colors, Typography } from '@/constants/tokens';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Required', 'Please enter your email and password.');
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    if (error) {
      Alert.alert('Authentication Failed', error.message);
    } else {
      router.replace('/(app)/dashboard');
    }
  };

  const inputStyle = (field: 'email' | 'password') => ({
    backgroundColor: focusedField === field
      ? Colors.surface_container_highest
      : Colors.surface_container_low,
    borderWidth: 1,
    borderColor: focusedField === field
      ? `${Colors.tertiary}66`  // 40% opacity
      : 'transparent',
    borderRadius: 12,
    padding: 16,
    ...Typography.body_md,
    color: Colors.on_surface,
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-surface"
    >
      <SafeAreaView className="flex-1 px-6">
        {/* Back */}
        <Pressable onPress={() => router.back()} className="pt-6 pb-4">
          <Text style={{ ...Typography.label_lg, color: Colors.secondary }}>← Back</Text>
        </Pressable>

        <View className="flex-1 justify-center">
          <Text style={{ ...Typography.headline_md, color: Colors.on_surface }} className="mb-2">
            Welcome back.
          </Text>
          <Text style={{ ...Typography.body_md, color: Colors.on_surface_variant }} className="mb-10">
            Sign in to access your vault.
          </Text>

          {/* Email */}
          <Text style={{ ...Typography.label_md, color: Colors.on_surface_variant }} className="mb-2 uppercase tracking-widest">
            Email
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            style={[inputStyle('email'), { marginBottom: 16 }]}
            placeholderTextColor={Colors.outline}
            placeholder="curator@example.com"
          />

          {/* Password */}
          <Text style={{ ...Typography.label_md, color: Colors.on_surface_variant }} className="mb-2 uppercase tracking-widest">
            Password
          </Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            secureTextEntry
            autoComplete="password"
            style={[inputStyle('password'), { marginBottom: 32 }]}
            placeholderTextColor={Colors.outline}
            placeholder="••••••••••"
          />

          {/* CTA */}
          <Pressable
            onPress={handleLogin}
            disabled={isLoading}
            className="rounded-md py-4 items-center"
            style={{ backgroundColor: Colors.primary, opacity: isLoading ? 0.6 : 1 }}
          >
            <Text style={{ ...Typography.label_lg, color: Colors.on_primary }}>
              {isLoading ? 'Signing in…' : 'Access Vault'}
            </Text>
          </Pressable>

          <Pressable onPress={() => router.push('/(auth)/register')} className="mt-6 items-center">
            <Text style={{ ...Typography.body_sm, color: Colors.secondary }}>
              No vault yet?{' '}
              <Text style={{ color: Colors.tertiary }}>Establish one →</Text>
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
