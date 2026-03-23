import { Tabs } from 'expo-router';
import { Colors, Typography } from '@/constants/tokens';
import { Text } from 'react-native';

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text
      style={{
        ...Typography.label_sm,
        color: focused ? Colors.tertiary : Colors.outline,
        marginTop: 4,
      }}
    >
      {label}
    </Text>
  );
}

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface_container_lowest,
          borderTopWidth: 0,
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
          shadowColor: Colors.on_primary_fixed,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 16,
          elevation: 8,
        },
        tabBarActiveTintColor: Colors.tertiary,
        tabBarInactiveTintColor: Colors.outline,
        tabBarLabelStyle: {
          ...Typography.label_sm,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Vault',
          tabBarLabel: 'Vault',
        }}
      />
      <Tabs.Screen
        name="assets"
        options={{
          title: 'Assets',
          tabBarLabel: 'Assets',
        }}
      />
      <Tabs.Screen
        name="liabilities"
        options={{
          title: 'Liabilities',
          tabBarLabel: 'Liabilities',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  );
}
