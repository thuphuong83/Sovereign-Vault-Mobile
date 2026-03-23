import { View, Text, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/tokens';

const MenuItem = ({
  label,
  subtitle,
  onPress,
  accent,
}: {
  label: string;
  subtitle?: string;
  onPress: () => void;
  accent?: boolean;
}) => (
  <Pressable
    onPress={onPress}
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: Spacing[4],
      paddingHorizontal: Spacing[5],
    }}
  >
    <View>
      <Text style={{ ...Typography.label_lg, color: accent ? Colors.error : Colors.on_surface }}>
        {label}
      </Text>
      {subtitle && (
        <Text style={{ ...Typography.body_sm, color: Colors.outline }}>{subtitle}</Text>
      )}
    </View>
    <Text style={{ ...Typography.body_md, color: Colors.outline }}>›</Text>
  </Pressable>
);

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();
  const fullName = user?.user_metadata?.full_name ?? 'Curator';
  const email = user?.email ?? '';

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to leave your vault?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/welcome');
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      {/* Profile Header */}
      <View
        style={{
          margin: Spacing[6],
          backgroundColor: Colors.primary,
          borderRadius: Radius.xl,
          padding: Spacing[6],
          ...Shadows.float,
        }}
      >
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: Colors.tertiary_fixed,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: Spacing[4],
          }}
        >
          <Text style={{ ...Typography.headline_sm, color: Colors.on_tertiary_container }}>
            {fullName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={{ ...Typography.title_md, color: Colors.on_primary }}>{fullName}</Text>
        <Text style={{ ...Typography.body_sm, color: Colors.secondary_container }}>{email}</Text>
      </View>

      {/* Settings Groups */}
      <View
        style={{
          marginHorizontal: Spacing[6],
          backgroundColor: Colors.surface_container_lowest,
          borderRadius: Radius.lg,
          marginBottom: Spacing[4],
          ...Shadows.card,
        }}
      >
        <MenuItem label="Personal Details" subtitle="Name, email, currency" onPress={() => {}} />
        <View style={{ height: 1, backgroundColor: Colors.surface_container_low, marginHorizontal: Spacing[5] }} />
        <MenuItem label="Security" subtitle="Password, biometrics" onPress={() => {}} />
        <View style={{ height: 1, backgroundColor: Colors.surface_container_low, marginHorizontal: Spacing[5] }} />
        <MenuItem label="Notifications" onPress={() => {}} />
      </View>

      <View
        style={{
          marginHorizontal: Spacing[6],
          backgroundColor: Colors.surface_container_lowest,
          borderRadius: Radius.lg,
          marginBottom: Spacing[4],
          ...Shadows.card,
        }}
      >
        <MenuItem label="Privacy Policy" onPress={() => {}} />
        <View style={{ height: 1, backgroundColor: Colors.surface_container_low, marginHorizontal: Spacing[5] }} />
        <MenuItem label="Terms of Service" onPress={() => {}} />
        <View style={{ height: 1, backgroundColor: Colors.surface_container_low, marginHorizontal: Spacing[5] }} />
        <MenuItem label="Regulatory Disclosures" onPress={() => {}} />
      </View>

      <View
        style={{
          marginHorizontal: Spacing[6],
          backgroundColor: Colors.surface_container_lowest,
          borderRadius: Radius.lg,
          ...Shadows.card,
        }}
      >
        <MenuItem label="Sign Out" onPress={handleSignOut} accent />
      </View>

      <Text
        style={{ ...Typography.body_sm, color: Colors.outline, textAlign: 'center', marginTop: Spacing[6] }}
      >
        Sovereign Vault v1.0.0
      </Text>
    </SafeAreaView>
  );
}
