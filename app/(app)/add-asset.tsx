import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { usePortfolioStore } from '@/store/portfolioStore';
import { Colors, Typography, Spacing, Radius, Shadows, Gradients } from '@/constants/tokens';
import { AssetCategory } from '@/types/database';
import { Asset, UserProfile } from '@/types';

// ── Asset class card config ──────────────────────────────────────────────────
type AssetClassOption = {
  label: string;
  category: AssetCategory;
  icon: keyof typeof MaterialIcons.glyphMap;
  subtitle: string;
};

const ASSET_CLASSES: AssetClassOption[] = [
  {
    label: 'Gold',
    category: 'metals',
    icon: 'stars',
    subtitle: 'Precious metals',
  },
  {
    label: 'Silver',
    category: 'metals',
    icon: 'brightness-7',
    subtitle: 'Precious metals',
  },
  {
    label: 'Property',
    category: 'real_estate',
    icon: 'home',
    subtitle: 'Real estate',
  },
  {
    label: 'Cash',
    category: 'cash',
    icon: 'account-balance-wallet',
    subtitle: 'Liquid cash',
  },
];

type UnitOption = 'units' | 'grams' | 'taels' | 'oz';
const UNIT_OPTIONS: UnitOption[] = ['units', 'grams', 'taels', 'oz'];

export default function AddAssetScreen() {
  const { session } = useAuthStore();
  const { addAsset } = usePortfolioStore();

  // Form state
  const [selectedClass, setSelectedClass] = useState<AssetClassOption | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState<UnitOption>('units');

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // Inline field errors
  const [errors, setErrors] = useState<{
    category?: string;
    name?: string;
    purchasePrice?: string;
  }>({});

  // Fetch user profile for currency
  useEffect(() => {
    if (!session?.user?.id) return;
    supabase
      .from('profiles')
      .select('id, full_name, avatar_url, currency')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setUserProfile({
            id: data.id,
            fullName: data.full_name,
            avatarUrl: data.avatar_url,
            currency: data.currency,
          });
        }
      });
  }, [session?.user?.id]);

  const currency = userProfile?.currency ?? 'VND';

  // ── Validation ──────────────────────────────────────────────────────────────
  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!selectedClass) {
      newErrors.category = 'Please select an asset class.';
    }
    if (!name.trim()) {
      newErrors.name = 'Asset name is required.';
    }
    const priceVal = parseFloat(purchasePrice);
    if (!purchasePrice.trim() || isNaN(priceVal) || priceVal <= 0) {
      newErrors.purchasePrice = 'Enter a valid purchase price greater than 0.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ── Save handler ────────────────────────────────────────────────────────────
  async function handleSave() {
    setErrorBanner(null);
    if (!validate()) return;
    if (!session?.user?.id) {
      setErrorBanner('You must be signed in to add an asset.');
      return;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('assets')
        .insert({
          user_id: session.user.id,
          name: name.trim(),
          category: selectedClass!.category,
          value: parseFloat(purchasePrice),
          currency,
          quantity: quantity > 0 ? quantity : null,
          unit: unit !== 'units' ? unit : null,
          notes: description.trim() || null,
        })
        .select()
        .single();

      if (error) {
        setErrorBanner(error.message);
        return;
      }

      if (data) {
        const newAsset: Asset = {
          id: data.id,
          userId: data.user_id,
          name: data.name,
          category: data.category,
          value: data.value,
          currency: data.currency,
          unit: data.unit ?? undefined,
          quantity: data.quantity ?? undefined,
          location: data.location ?? undefined,
          notes: data.notes ?? undefined,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        addAsset(newAsset);
      }

      router.back();
    } catch (err: any) {
      setErrorBanner(err?.message ?? 'An unexpected error occurred.');
    } finally {
      setIsSaving(false);
    }
  }

  // ── Quantity stepper ────────────────────────────────────────────────────────
  function decrementQuantity() {
    setQuantity((q) => Math.max(0, q - 1));
  }
  function incrementQuantity() {
    setQuantity((q) => q + 1);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* ── Top App Bar ──────────────────────────────────────────────────── */}
        <View style={styles.appBar}>
          <Pressable onPress={() => router.back()} style={styles.appBarCloseBtn} hitSlop={8}>
            <MaterialIcons name="close" size={24} color={Colors.on_surface} />
          </Pressable>
          <Text style={styles.appBarTitle}>Add New Asset</Text>
          <Pressable onPress={handleSave} disabled={isSaving} style={styles.appBarSaveBtn} hitSlop={8}>
            {isSaving ? (
              <ActivityIndicator size="small" color={Colors.tertiary} />
            ) : (
              <Text style={styles.appBarSaveText}>Save</Text>
            )}
          </Pressable>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Error banner ─────────────────────────────────────────────── */}
          {errorBanner && (
            <View style={styles.errorBanner}>
              <MaterialIcons name="error-outline" size={16} color={Colors.error} />
              <Text style={styles.errorBannerText}>{errorBanner}</Text>
            </View>
          )}

          {/* ── Section: Select Asset Class ──────────────────────────────── */}
          <Text style={styles.sectionLabel}>Select Asset Class</Text>
          <View style={styles.assetGrid}>
            {ASSET_CLASSES.map((item) => {
              const isSelected = selectedClass?.label === item.label;
              return (
                <Pressable
                  key={item.label}
                  onPress={() => {
                    setSelectedClass(item);
                    setErrors((e) => ({ ...e, category: undefined }));
                  }}
                  style={[
                    styles.assetCard,
                    isSelected && styles.assetCardSelected,
                  ]}
                >
                  <View
                    style={[
                      styles.assetCardIconWrap,
                      isSelected && styles.assetCardIconWrapSelected,
                    ]}
                  >
                    <MaterialIcons
                      name={item.icon}
                      size={28}
                      color={isSelected ? Colors.tertiary : Colors.on_surface_variant}
                    />
                  </View>
                  <Text
                    style={[
                      styles.assetCardLabel,
                      isSelected && styles.assetCardLabelSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  <Text style={styles.assetCardSubtitle}>{item.subtitle}</Text>
                </Pressable>
              );
            })}
          </View>
          {errors.category && (
            <Text style={styles.fieldError}>{errors.category}</Text>
          )}

          {/* ── Section: Asset Details ───────────────────────────────────── */}
          <Text style={[styles.sectionLabel, { marginTop: Spacing[6] }]}>Asset Details</Text>

          {/* Asset Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Asset Name <Text style={styles.fieldRequired}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInput, errors.name ? styles.textInputError : null]}
              placeholder="e.g. 24K Gold Bar"
              placeholderTextColor={Colors.outline}
              value={name}
              onChangeText={(v) => {
                setName(v);
                if (v.trim()) setErrors((e) => ({ ...e, name: undefined }));
              }}
              returnKeyType="next"
            />
            {errors.name && <Text style={styles.fieldError}>{errors.name}</Text>}
          </View>

          {/* Description / Notes */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Notes / Description</Text>
            <TextInput
              style={[styles.textInput, styles.textInputMultiline]}
              placeholder="e.g. Stored at home safe, vault #2…"
              placeholderTextColor={Colors.outline}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* ── Section: Value & Quantity ────────────────────────────────── */}
          <Text style={[styles.sectionLabel, { marginTop: Spacing[6] }]}>Value & Quantity</Text>

          {/* Purchase Price */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Purchase Price ({currency}) <Text style={styles.fieldRequired}>*</Text>
            </Text>
            <View
              style={[
                styles.priceInputRow,
                errors.purchasePrice ? styles.textInputError : null,
              ]}
            >
              <Text style={styles.currencyLabel}>{currency}</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="0"
                placeholderTextColor={Colors.outline}
                value={purchasePrice}
                onChangeText={(v) => {
                  setPurchasePrice(v);
                  const n = parseFloat(v);
                  if (!isNaN(n) && n > 0) setErrors((e) => ({ ...e, purchasePrice: undefined }));
                }}
                keyboardType="decimal-pad"
                returnKeyType="done"
              />
            </View>
            {errors.purchasePrice && (
              <Text style={styles.fieldError}>{errors.purchasePrice}</Text>
            )}
          </View>

          {/* Quantity stepper */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Quantity</Text>
            <View style={styles.stepperRow}>
              <Pressable onPress={decrementQuantity} style={styles.stepperBtn}>
                <MaterialIcons name="remove" size={20} color={Colors.on_surface} />
              </Pressable>
              <TextInput
                style={styles.stepperInput}
                value={String(quantity)}
                onChangeText={(v) => {
                  const n = parseInt(v, 10);
                  if (!isNaN(n) && n >= 0) setQuantity(n);
                  else if (v === '') setQuantity(0);
                }}
                keyboardType="number-pad"
                textAlign="center"
              />
              <Pressable onPress={incrementQuantity} style={styles.stepperBtn}>
                <MaterialIcons name="add" size={20} color={Colors.on_surface} />
              </Pressable>
            </View>
          </View>

          {/* Unit chips */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Unit</Text>
            <View style={styles.chipRow}>
              {UNIT_OPTIONS.map((u) => (
                <Pressable
                  key={u}
                  onPress={() => setUnit(u)}
                  style={[styles.chip, unit === u && styles.chipSelected]}
                >
                  <Text
                    style={[styles.chipText, unit === u && styles.chipTextSelected]}
                  >
                    {u}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* ── Save button ──────────────────────────────────────────────── */}
          <View style={styles.saveButtonWrap}>
            <Pressable onPress={handleSave} disabled={isSaving}>
              <LinearGradient
                colors={[...Gradients.primaryCta.colors] as [string, string]}
                start={Gradients.primaryCta.start}
                end={Gradients.primaryCta.end}
                style={styles.saveButton}
              >
                {isSaving ? (
                  <ActivityIndicator color={Colors.on_primary} />
                ) : (
                  <>
                    <MaterialIcons name="add-circle-outline" size={20} color={Colors.tertiary_fixed} style={{ marginRight: 8 }} />
                    <Text style={styles.saveButtonText}>Save Asset to Vault</Text>
                  </>
                )}
              </LinearGradient>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  flex: {
    flex: 1,
  },

  // ── App Bar ──────────────────────────────────────────────────────────────
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[4],
    backgroundColor: Colors.surface_container_lowest,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline_variant,
  },
  appBarCloseBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appBarTitle: {
    ...Typography.title_md,
    color: Colors.on_surface,
  },
  appBarSaveBtn: {
    width: 56,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appBarSaveText: {
    ...Typography.label_lg,
    color: Colors.tertiary,
  },

  // ── Scroll ───────────────────────────────────────────────────────────────
  scrollContent: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[6],
    paddingBottom: Spacing[12],
  },

  // ── Error banner ─────────────────────────────────────────────────────────
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error_container,
    borderRadius: Radius.sm,
    padding: Spacing[3],
    marginBottom: Spacing[4],
    gap: Spacing[2],
  },
  errorBannerText: {
    ...Typography.body_sm,
    color: Colors.error,
    flex: 1,
  },

  // ── Section label ─────────────────────────────────────────────────────────
  sectionLabel: {
    ...Typography.label_md,
    color: Colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing[3],
  },

  // ── Asset class grid ──────────────────────────────────────────────────────
  assetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[3],
  },
  assetCard: {
    width: '47%',
    backgroundColor: Colors.surface_container_lowest,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    borderWidth: 1.5,
    borderColor: Colors.outline_variant,
    alignItems: 'flex-start',
    ...Shadows.card,
  },
  assetCardSelected: {
    borderColor: Colors.tertiary,
    backgroundColor: `${Colors.tertiary}14`,
  },
  assetCardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface_container_low,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[3],
  },
  assetCardIconWrapSelected: {
    backgroundColor: `${Colors.tertiary}22`,
  },
  assetCardLabel: {
    ...Typography.label_lg,
    color: Colors.on_surface,
    marginBottom: 2,
  },
  assetCardLabelSelected: {
    color: Colors.tertiary,
  },
  assetCardSubtitle: {
    ...Typography.body_sm,
    color: Colors.outline,
  },

  // ── Field groups ──────────────────────────────────────────────────────────
  fieldGroup: {
    marginBottom: Spacing[4],
  },
  fieldLabel: {
    ...Typography.label_md,
    color: Colors.on_surface_variant,
    marginBottom: Spacing[2],
  },
  fieldRequired: {
    color: Colors.error,
  },
  fieldError: {
    ...Typography.body_sm,
    color: Colors.error,
    marginTop: Spacing[1],
  },

  // ── Text inputs ───────────────────────────────────────────────────────────
  textInput: {
    ...Typography.body_lg,
    color: Colors.on_surface,
    backgroundColor: Colors.surface_container_lowest,
    borderWidth: 1,
    borderColor: Colors.outline_variant,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
  },
  textInputMultiline: {
    height: 88,
    paddingTop: Spacing[3],
  },
  textInputError: {
    borderColor: Colors.error,
  },

  // ── Price input ───────────────────────────────────────────────────────────
  priceInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface_container_lowest,
    borderWidth: 1,
    borderColor: Colors.outline_variant,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing[4],
    overflow: 'hidden',
  },
  currencyLabel: {
    ...Typography.label_md,
    color: Colors.outline,
    marginRight: Spacing[2],
  },
  priceInput: {
    ...Typography.body_lg,
    color: Colors.on_surface,
    flex: 1,
    paddingVertical: Spacing[3],
  },

  // ── Quantity stepper ──────────────────────────────────────────────────────
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface_container_lowest,
    borderWidth: 1,
    borderColor: Colors.outline_variant,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  stepperBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface_container_low,
  },
  stepperInput: {
    ...Typography.body_lg,
    color: Colors.on_surface,
    width: 64,
    height: 44,
    textAlign: 'center',
  },

  // ── Unit chips ────────────────────────────────────────────────────────────
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
  },
  chip: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.outline_variant,
    backgroundColor: Colors.surface_container_lowest,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    ...Typography.label_md,
    color: Colors.on_surface_variant,
  },
  chipTextSelected: {
    color: Colors.on_primary,
  },

  // ── Save button ───────────────────────────────────────────────────────────
  saveButtonWrap: {
    marginTop: Spacing[6],
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.lg,
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[6],
    ...Shadows.float,
  },
  saveButtonText: {
    ...Typography.label_lg,
    color: Colors.tertiary_fixed,
  },
});
