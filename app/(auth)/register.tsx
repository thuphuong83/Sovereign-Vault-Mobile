import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { Colors, Typography } from '@/constants/tokens';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Required', 'Please complete all fields.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Weak Password', 'Password must be at least 8 characters.');
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    setIsLoading(false);
    if (error) {
      Alert.alert('Registration Failed', error.message);
    } else {
      Alert.alert(
        'Vault Established',
        'Check your email to confirm your account.',
        [{ text: 'Sign In', onPress: () => router.replace('/(auth)/login') }]
      );
    }
  };

  const inputStyle = (field: string) => ({
    backgroundColor: focusedField === field
      ? Colors.surface_container_highest
      : Colors.surface_container_low,
    borderWidth: 1,
    borderColor: focusedField === field ? `${Colors.tertiary}66` : 'transparent',
    borderRadius: 12,
    padding: 16,
    ...Typography.body_md,
    color: Colors.on_surface,
    marginBottom: 16,
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-surface"
    >
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1 px-6"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Pressable onPress={() => router.back()} className="pt-6 pb-4">
            <Text style={{ ...Typography.label_lg, color: Colors.secondary }}>← Back</Text>
          </Pressable>

          <Text style={{ ...Typography.headline_md, color: Colors.on_surface }} className="mb-2 mt-4">
            Establish your vault.
          </Text>
          <Text style={{ ...Typography.body_md, color: Colors.on_surface_variant }} className="mb-10">
            Join a select group of private individuals managing assets with institutional precision.
          </Text>

          {/* Full Name */}
          <Text style={{ ...Typography.label_md, color: Colors.on_surface_variant }} className="mb-2 uppercase tracking-widest">
            Full Name
          </Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
            autoComplete="name"
            style={inputStyle('name')}
            placeholderTextColor={Colors.outline}
            placeholder="Your full name"
          />

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
            style={inputStyle('email')}
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
            autoComplete="new-password"
            style={inputStyle('password')}
            placeholderTextColor={Colors.outline}
            placeholder="Min. 8 characters"
          />

          <Pressable
            onPress={handleRegister}
            disabled={isLoading}
            className="rounded-md py-4 items-center mb-6"
            style={{ backgroundColor: Colors.primary, opacity: isLoading ? 0.6 : 1 }}
          >
            <Text style={{ ...Typography.label_lg, color: Colors.on_primary }}>
              {isLoading ? 'Creating vault…' : 'Create My Vault'}
            </Text>
          </Pressable>

          <Pressable onPress={() => router.push('/(auth)/login')} className="items-center pb-10">
            <Text style={{ ...Typography.body_sm, color: Colors.secondary }}>
              Already have access?{' '}
              <Text style={{ color: Colors.tertiary }}>Sign in →</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
