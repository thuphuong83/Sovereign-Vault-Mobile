import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { usePortfolioStore } from '@/store/portfolioStore';
import { Colors, Typography, Spacing, Shadows, Radius } from '@/constants/tokens';
import { formatCurrency } from '@/lib/format';

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const { totalAssets, totalLiabilities, netWorth, assets, liabilities } = usePortfolioStore();

  const nw = netWorth();
  const ta = totalAssets();
  const tl = totalLiabilities();

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] ?? 'Curator';

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Header */}
        <View className="px-6 pt-6 pb-4 flex-row justify-between items-center">
          <View>
            <Text style={{ ...Typography.label_md, color: Colors.outline }} className="uppercase tracking-widest mb-1">
              Sovereign Vault
            </Text>
            <Text style={{ ...Typography.title_md, color: Colors.on_surface }}>
              Good morning, {firstName}.
            </Text>
          </View>
          <Pressable
            style={{
              width: 40, height: 40, borderRadius: 20,
              backgroundColor: Colors.surface_container_low,
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Text style={{ ...Typography.label_lg, color: Colors.on_surface }}>
              {firstName.charAt(0).toUpperCase()}
            </Text>
          </Pressable>
        </View>

        {/* Net Worth Card — Level 2 */}
        <View
          style={{
            marginHorizontal: Spacing[6],
            marginBottom: Spacing[4],
            backgroundColor: Colors.primary,
            borderRadius: Radius.xl,
            padding: Spacing[6],
            ...Shadows.float,
          }}
        >
          <Text style={{ ...Typography.label_md, color: Colors.secondary_container }} className="uppercase tracking-widest mb-3">
            Total Net Worth
          </Text>
          <Text style={{ ...Typography.display_sm, color: Colors.on_primary }} className="mb-1">
            {formatCurrency(nw)}
          </Text>
          <View className="flex-row items-center mt-2">
            <View style={{ backgroundColor: `${Colors.tertiary_fixed}33`, borderRadius: Radius.xs, paddingHorizontal: 8, paddingVertical: 3 }}>
              <Text style={{ ...Typography.label_sm, color: Colors.tertiary_fixed }}>+12.4% this year</Text>
            </View>
          </View>
        </View>

        {/* Assets & Liabilities Row */}
        <View className="flex-row px-6 gap-x-3 mb-4">
          {/* Assets */}
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.surface_container_lowest,
              borderRadius: Radius.lg,
              padding: Spacing[5],
              ...Shadows.card,
            }}
          >
            <Text style={{ ...Typography.label_sm, color: Colors.outline }} className="uppercase tracking-widest mb-2">
              Assets
            </Text>
            <Text style={{ ...Typography.headline_sm, color: Colors.on_surface }}>
              {formatCurrency(ta)}
            </Text>
          </View>

          {/* Liabilities */}
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.surface_container_lowest,
              borderRadius: Radius.lg,
              padding: Spacing[5],
              ...Shadows.card,
            }}
          >
            <Text style={{ ...Typography.label_sm, color: Colors.outline }} className="uppercase tracking-widest mb-2">
              Liabilities
            </Text>
            <Text style={{ ...Typography.headline_sm, color: Colors.on_surface }}>
              {formatCurrency(tl)}
            </Text>
          </View>
        </View>

        {/* Asset Breakdown */}
        <View className="px-6 mb-2">
          <Text style={{ ...Typography.title_sm, color: Colors.on_surface }} className="mb-3">
            Portfolio Breakdown
          </Text>
        </View>

        <View
          style={{
            marginHorizontal: Spacing[6],
            backgroundColor: Colors.surface_container_low,
            borderRadius: Radius.lg,
            padding: Spacing[5],
            marginBottom: Spacing[4],
          }}
        >
          {assets.length === 0 ? (
            <Text style={{ ...Typography.body_md, color: Colors.outline }} className="text-center py-4">
              No assets recorded yet.{'\n'}Add your first asset to begin.
            </Text>
          ) : (
            assets.slice(0, 5).map((asset, index) => (
              <View
                key={asset.id}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: Spacing[3],
                  borderBottomWidth: index < assets.length - 1 ? 0 : 0,
                }}
              >
                <View>
                  <Text style={{ ...Typography.label_lg, color: Colors.on_surface }}>
                    {asset.name}
                  </Text>
                  <Text style={{ ...Typography.body_sm, color: Colors.outline, textTransform: 'capitalize' }}>
                    {asset.category.replace('_', ' ')}
                  </Text>
                </View>
                <Text style={{ ...Typography.title_sm, color: Colors.on_surface }}>
                  {formatCurrency(asset.value)}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-2">
          <Text style={{ ...Typography.title_sm, color: Colors.on_surface }} className="mb-3">
            Quick Actions
          </Text>
        </View>
        <View className="flex-row px-6 gap-x-3">
          <Pressable
            style={{
              flex: 1,
              backgroundColor: Colors.surface_container_lowest,
              borderRadius: Radius.md,
              padding: Spacing[4],
              alignItems: 'center',
              ...Shadows.card,
            }}
          >
            <Text style={{ ...Typography.label_md, color: Colors.tertiary }}>+ Asset</Text>
          </Pressable>
          <Pressable
            style={{
              flex: 1,
              backgroundColor: Colors.surface_container_lowest,
              borderRadius: Radius.md,
              padding: Spacing[4],
              alignItems: 'center',
              ...Shadows.card,
            }}
          >
            <Text style={{ ...Typography.label_md, color: Colors.on_surface_variant }}>+ Liability</Text>
          </Pressable>
          <Pressable
            style={{
              flex: 1,
              backgroundColor: Colors.primary,
              borderRadius: Radius.md,
              padding: Spacing[4],
              alignItems: 'center',
              ...Shadows.card,
            }}
          >
            <Text style={{ ...Typography.label_md, color: Colors.tertiary_fixed }}>Report</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
