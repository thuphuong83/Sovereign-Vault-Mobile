import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePortfolioStore } from '@/store/portfolioStore';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/tokens';
import { formatCurrency, formatPercent } from '@/lib/format';

export default function LiabilitiesScreen() {
  const { liabilities, totalLiabilities, totalAssets } = usePortfolioStore();
  const tl = totalLiabilities();
  const ta = totalAssets();
  const debtRatio = ta > 0 ? (tl / ta) * 100 : 0;

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      {/* Header */}
      <View className="px-6 pt-6 pb-4">
        <Text style={{ ...Typography.label_md, color: Colors.outline }} className="uppercase tracking-widest mb-1">
          Debt Portfolio
        </Text>
        <Text style={{ ...Typography.headline_sm, color: Colors.on_surface }}>
          {formatCurrency(tl)}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Debt Ratio Card */}
        <View
          style={{
            marginHorizontal: Spacing[6],
            marginBottom: Spacing[5],
            backgroundColor: Colors.surface_container_low,
            borderRadius: Radius.lg,
            padding: Spacing[5],
          }}
        >
          <View className="flex-row justify-between mb-3">
            <Text style={{ ...Typography.label_md, color: Colors.outline }} className="uppercase tracking-widest">
              Debt-to-Asset Ratio
            </Text>
            <Text style={{ ...Typography.label_lg, color: Colors.on_surface }}>
              {formatPercent(debtRatio)}
            </Text>
          </View>
          {/* Progress bar — tonal, no borders */}
          <View style={{ height: 4, backgroundColor: Colors.surface_container, borderRadius: 2 }}>
            <View
              style={{
                height: 4,
                width: `${Math.min(debtRatio, 100)}%`,
                backgroundColor: debtRatio > 60 ? Colors.error : Colors.tertiary,
                borderRadius: 2,
              }}
            />
          </View>
        </View>

        {/* Liability Items */}
        {liabilities.length === 0 ? (
          <View className="items-center px-6 pt-12">
            <Text style={{ ...Typography.headline_sm, color: Colors.on_surface_variant }} className="mb-3 text-center">
              No liabilities recorded.
            </Text>
            <Text style={{ ...Typography.body_md, color: Colors.outline }} className="text-center mb-8">
              Track your debt strategically. Add a liability to activate your Freedom Horizon.
            </Text>
            <Pressable
              style={{
                backgroundColor: Colors.tertiary_fixed,
                borderRadius: Radius.md,
                paddingHorizontal: Spacing[6],
                paddingVertical: Spacing[4],
              }}
            >
              <Text style={{ ...Typography.label_lg, color: Colors.on_tertiary_container }}>
                + Add Liability
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={{ marginHorizontal: Spacing[6] }}>
            {liabilities.map((liability) => (
              <Pressable
                key={liability.id}
                style={{
                  backgroundColor: Colors.surface_container_lowest,
                  borderRadius: Radius.lg,
                  padding: Spacing[5],
                  marginBottom: Spacing[3],
                  ...Shadows.card,
                }}
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View style={{ flex: 1 }}>
                    <Text style={{ ...Typography.label_lg, color: Colors.on_surface }}>
                      {liability.name}
                    </Text>
                    {liability.lender && (
                      <Text style={{ ...Typography.body_sm, color: Colors.outline }}>
                        {liability.lender}
                      </Text>
                    )}
                  </View>
                  <View style={{
                    backgroundColor: Colors.secondary_container,
                    borderRadius: Radius.xs,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                  }}>
                    <Text style={{ ...Typography.label_sm, color: Colors.on_secondary_container }}>
                      {formatPercent(liability.interestRate)} APR
                    </Text>
                  </View>
                </View>

                {/* Balance Progress */}
                <View className="flex-row justify-between mb-2">
                  <Text style={{ ...Typography.body_sm, color: Colors.outline }}>Balance</Text>
                  <Text style={{ ...Typography.label_lg, color: Colors.on_surface }}>
                    {formatCurrency(liability.balance)}
                  </Text>
                </View>
                <View style={{ height: 3, backgroundColor: Colors.surface_container, borderRadius: 2, marginBottom: 2 }}>
                  <View
                    style={{
                      height: 3,
                      width: `${(liability.balance / liability.principal) * 100}%`,
                      backgroundColor: Colors.tertiary,
                      borderRadius: 2,
                    }}
                  />
                </View>
                <Text style={{ ...Typography.body_sm, color: Colors.outline }}>
                  of {formatCurrency(liability.principal)} principal
                </Text>
              </Pressable>
            ))}

            {/* Freedom Target CTA */}
            <Pressable
              style={{
                backgroundColor: Colors.tertiary_fixed,
                borderRadius: Radius.md,
                padding: Spacing[4],
                alignItems: 'center',
                marginTop: Spacing[3],
              }}
            >
              <Text style={{ ...Typography.label_lg, color: Colors.on_tertiary_container }}>
                View Debt Freedom Target →
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
