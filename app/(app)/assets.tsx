import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePortfolioStore } from '@/store/portfolioStore';
import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants/tokens';
import { formatCurrency } from '@/lib/format';
import { AssetCategory } from '@/types';

const CATEGORY_LABELS: Record<AssetCategory, string> = {
  real_estate: 'Real Estate',
  metals: 'Precious Metals',
  cash: 'Liquid Cash',
  equities: 'Equities',
  crypto: 'Digital Assets',
  collectibles: 'Collectibles',
  other: 'Other',
};

export default function AssetsScreen() {
  const { assets, totalAssets } = usePortfolioStore();
  const ta = totalAssets();

  // Group by category
  const grouped = assets.reduce(
    (acc, asset) => {
      if (!acc[asset.category]) acc[asset.category] = [];
      acc[asset.category].push(asset);
      return acc;
    },
    {} as Record<AssetCategory, typeof assets>
  );

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      {/* Header */}
      <View className="px-6 pt-6 pb-4 flex-row justify-between items-center">
        <View>
          <Text style={{ ...Typography.label_md, color: Colors.outline }} className="uppercase tracking-widest mb-1">
            Asset Registry
          </Text>
          <Text style={{ ...Typography.headline_sm, color: Colors.on_surface }}>
            {formatCurrency(ta)}
          </Text>
        </View>
        <Pressable
          style={{
            backgroundColor: Colors.primary,
            borderRadius: Radius.md,
            paddingHorizontal: Spacing[4],
            paddingVertical: Spacing[3],
          }}
        >
          <Text style={{ ...Typography.label_md, color: Colors.on_primary }}>+ Add</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {Object.keys(grouped).length === 0 ? (
          <View className="flex-1 items-center justify-center px-6 pt-20">
            <Text style={{ ...Typography.headline_sm, color: Colors.on_surface_variant }} className="mb-3 text-center">
              No assets recorded.
            </Text>
            <Text style={{ ...Typography.body_md, color: Colors.outline }} className="text-center">
              Begin curating your portfolio by adding your first asset.
            </Text>
          </View>
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <View key={category} className="mb-6">
              {/* Category Header */}
              <View className="px-6 mb-3 flex-row justify-between items-center">
                <Text style={{ ...Typography.label_md, color: Colors.outline }} className="uppercase tracking-widest">
                  {CATEGORY_LABELS[category as AssetCategory]}
                </Text>
                <Text style={{ ...Typography.label_md, color: Colors.on_surface_variant }}>
                  {formatCurrency(items.reduce((s, a) => s + a.value, 0))}
                </Text>
              </View>

              {/* Asset Items */}
              <View
                style={{
                  marginHorizontal: Spacing[6],
                  backgroundColor: Colors.surface_container_lowest,
                  borderRadius: Radius.lg,
                  ...Shadows.card,
                }}
              >
                {items.map((asset, idx) => (
                  <Pressable
                    key={asset.id}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: Spacing[5],
                      marginBottom: idx < items.length - 1 ? 0 : 0,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ ...Typography.label_lg, color: Colors.on_surface }}>
                        {asset.name}
                      </Text>
                      {asset.location && (
                        <Text style={{ ...Typography.body_sm, color: Colors.outline }}>
                          {asset.location}
                        </Text>
                      )}
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ ...Typography.title_sm, color: Colors.on_surface }}>
                        {formatCurrency(asset.value)}
                      </Text>
                      {asset.quantity && asset.unit && (
                        <Text style={{ ...Typography.body_sm, color: Colors.outline }}>
                          {asset.quantity} {asset.unit}
                        </Text>
                      )}
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
