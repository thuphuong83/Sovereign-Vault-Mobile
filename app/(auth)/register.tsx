import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { Colors, Spacing, Radius } from '@/constants/tokens';

const CURRENCIES = ['VND', 'USD', 'EUR', 'GBP', 'SGD', 'JPY'];

export default function RegisterScreen() {
  const [fullName, setFullName]     = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [currency, setCurrency]     = useState('VND');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]   = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!fullName.trim()) {
      Alert.alert('Required', 'Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Required', 'Please enter your email address.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Weak Password', 'Password must be at least 8 characters.');
      return;
    }

    setIsLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim() },
      },
    });

    if (error) {
      setIsLoading(false);
      Alert.alert('Registration Failed', error.message);
      return;
    }

    // Update currency on the auto-created profile
    if (data.user) {
      await supabase
        .from('profiles')
        .update({ currency })
        .eq('id', data.user.id);
    }

    setIsLoading(false);
    Alert.alert(
      'Vault Established',
      'Your private vault has been created. Check your email to confirm your account.',
      [{ text: 'Sign In', onPress: () => router.replace('/(auth)/login') }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* ── Decorative Background Blobs ──────────────────────── */}
      <View style={styles.blobTopRight} />
      <View style={styles.blobBottomLeft} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Branding ─────────────────────────────────────────── */}
          <View style={styles.brandingSection}>
            <View style={styles.logoRow}>
              <LinearGradient
                colors={['#000b21', '#0d2240']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoBox}
              >
                <MaterialIcons
                  name="account-balance-wallet"
                  size={24}
                  color={Colors.tertiary_fixed}
                />
              </LinearGradient>
              <Text style={styles.brandName}>SOVEREIGN VAULT</Text>
            </View>
            <Text style={styles.heroHeadline}>Establish Your{'\n'}Vault</Text>
            <Text style={styles.heroSubtext}>
              Join a select group managing assets with institutional precision.
            </Text>
          </View>

          {/* ── Registration Card ────────────────────────────────── */}
          <View style={styles.card}>

            {/* Full Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>FULL NAME</Text>
              <View style={[styles.inputWrapper, focusedField === 'name' && styles.inputWrapperFocused]}>
                <MaterialIcons name="person" size={20} color={Colors.outline_variant} style={styles.inputIcon} />
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="name"
                  autoCapitalize="words"
                  placeholder="Your full name"
                  placeholderTextColor={Colors.outline_variant}
                  style={[styles.input, focusedField === 'name' && styles.inputFocused]}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
              <View style={[styles.inputWrapper, focusedField === 'email' && styles.inputWrapperFocused]}>
                <MaterialIcons name="mail" size={20} color={Colors.outline_variant} style={styles.inputIcon} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  placeholder="curator@example.com"
                  placeholderTextColor={Colors.outline_variant}
                  style={[styles.input, focusedField === 'email' && styles.inputFocused]}
                />
              </View>
            </View>

            {/* Currency */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>BASE CURRENCY</Text>
              <View style={styles.currencyRow}>
                {CURRENCIES.map((c) => (
                  <Pressable
                    key={c}
                    onPress={() => setCurrency(c)}
                    style={[styles.currencyChip, currency === c && styles.currencyChipActive]}
                  >
                    <Text style={[styles.currencyChipText, currency === c && styles.currencyChipTextActive]}>
                      {c}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>PASSWORD</Text>
              <View style={[styles.inputWrapper, focusedField === 'password' && styles.inputWrapperFocused]}>
                <MaterialIcons name="lock" size={20} color={Colors.outline_variant} style={styles.inputIcon} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  placeholderTextColor={Colors.outline_variant}
                  style={[styles.input, styles.inputPassword, focusedField === 'password' && styles.inputFocused]}
                />
                <Pressable
                  onPress={() => setShowPassword((v) => !v)}
                  style={styles.visibilityBtn}
                  hitSlop={8}
                >
                  <MaterialIcons
                    name={showPassword ? 'visibility-off' : 'visibility'}
                    size={20}
                    color={Colors.outline_variant}
                  />
                </Pressable>
              </View>
              <Text style={styles.passwordHint}>
                Minimum 8 characters
              </Text>
            </View>

            {/* CTA */}
            <Pressable
              onPress={handleRegister}
              disabled={isLoading}
              style={({ pressed }) => [{ opacity: pressed || isLoading ? 0.85 : 1 }]}
            >
              <LinearGradient
                colors={['#000b21', '#0d2240']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ctaBtn}
              >
                <Text style={styles.ctaBtnText}>
                  {isLoading ? 'Establishing vault…' : 'Establish My Vault'}
                </Text>
                {!isLoading && (
                  <MaterialIcons name="arrow-forward" size={18} color={Colors.on_primary} />
                )}
              </LinearGradient>
            </Pressable>

            {/* Footer */}
            <View style={styles.cardFooter}>
              <Text style={styles.cardFooterText}>
                Already have access?{'  '}
                <Text style={styles.signInLink} onPress={() => router.replace('/(auth)/login')}>
                  Sign In
                </Text>
              </Text>
            </View>
          </View>

          {/* ── Security Badges ──────────────────────────────────── */}
          <View style={styles.securityRow}>
            <View style={styles.securityBadge}>
              <MaterialIcons name="enhanced-encryption" size={14} color={Colors.outline_variant} />
              <Text style={styles.securityText}>AES-256 ENCRYPTED</Text>
            </View>
            <View style={styles.securityDot} />
            <View style={styles.securityBadge}>
              <MaterialIcons name="verified-user" size={14} color={Colors.outline_variant} />
              <Text style={styles.securityText}>SIPC INSURED</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Page Footer ──────────────────────────────────────────── */}
      <View style={styles.pageFooter}>
        <Text style={styles.pageFooterText}>
          © 2024 Sovereign Reserve Digital Limited. All Rights Reserved. Private & Confidential.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },

  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
  },

  blobTopRight: {
    position: 'absolute',
    top: '-5%',
    right: '-5%',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: `${Colors.secondary_container}33`,
  },
  blobBottomLeft: {
    position: 'absolute',
    bottom: '-5%',
    left: '-5%',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: `${Colors.tertiary_fixed}1A`,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[8],
    paddingBottom: Spacing[4],
    maxWidth: 440,
    alignSelf: 'center',
    width: '100%',
  },

  // ── Branding ──────────────────────────────────────────────
  brandingSection: {
    marginBottom: Spacing[8],
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: Spacing[6],
  },
  logoBox: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.on_primary_fixed,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  brandName: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 11,
    letterSpacing: 3,
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  heroHeadline: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 34,
    lineHeight: 42,
    color: Colors.primary,
    letterSpacing: -0.5,
    marginBottom: Spacing[3],
  },
  heroSubtext: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.on_secondary_container,
    lineHeight: 20,
  },

  // ── Card ──────────────────────────────────────────────────
  card: {
    backgroundColor: Colors.surface_container_lowest,
    borderRadius: Radius.xl,
    padding: Spacing[8],
    shadowColor: Colors.on_primary_fixed,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.06,
    shadowRadius: 40,
    elevation: 8,
    gap: Spacing[6],
  },

  // ── Fields ────────────────────────────────────────────────
  fieldGroup: {
    gap: Spacing[2],
  },
  fieldLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 1.5,
    color: Colors.on_primary_container,
    textTransform: 'uppercase',
    paddingHorizontal: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface_container_low,
    borderRadius: Radius.xl,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  inputWrapperFocused: {
    borderColor: `${Colors.tertiary_fixed}66`,
    backgroundColor: Colors.surface_container_highest,
  },
  inputIcon: {
    paddingLeft: 16,
    paddingRight: 4,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.on_surface,
    backgroundColor: 'transparent',
  },
  inputFocused: {
    backgroundColor: 'transparent',
  },
  inputPassword: {
    paddingRight: 0,
  },
  visibilityBtn: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  passwordHint: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.outline_variant,
    paddingHorizontal: 4,
  },

  // ── Currency Chips ────────────────────────────────────────
  currencyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  currencyChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface_container_low,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  currencyChipActive: {
    backgroundColor: Colors.primary_container,
    borderColor: Colors.primary,
  },
  currencyChipText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: Colors.on_surface_variant,
    letterSpacing: 0.5,
  },
  currencyChipTextActive: {
    color: Colors.on_primary,
  },

  // ── CTA Button ────────────────────────────────────────────
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: Radius.xl,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: Colors.on_primary_fixed,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  ctaBtnText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 15,
    color: Colors.on_primary,
    letterSpacing: 0.3,
  },

  // ── Card Footer ───────────────────────────────────────────
  cardFooter: {
    paddingTop: Spacing[5],
    borderTopWidth: 1,
    borderTopColor: `${Colors.surface_variant}4D`,
    alignItems: 'center',
  },
  cardFooterText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.on_secondary_container,
    textAlign: 'center',
  },
  signInLink: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    color: Colors.primary,
  },

  // ── Security Badges ───────────────────────────────────────
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: Spacing[8],
    marginBottom: Spacing[4],
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  securityText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 1.5,
    color: Colors.outline_variant,
    textTransform: 'uppercase',
  },
  securityDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.outline_variant,
  },

  // ── Page Footer ───────────────────────────────────────────
  pageFooter: {
    paddingVertical: Spacing[5],
    paddingHorizontal: Spacing[6],
    alignItems: 'center',
  },
  pageFooterText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: `${Colors.on_secondary_container}99`,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});
