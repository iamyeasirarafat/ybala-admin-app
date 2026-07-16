import { SectionHeading } from '@/components/settings/SectionHeading';
import { Button, Input } from '@/components/ui';
import { useShopSettings, useUpdateShopSettings } from '@/hooks/useSettings';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Switch, Text, View } from 'react-native';

export const ShopSettingsForm: React.FC = () => {
  const { data, isLoading } = useShopSettings();
  const updateShop = useUpdateShopSettings();

  const [enableDelivery, setEnableDelivery] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState('');

  useEffect(() => {
    if (data) {
      setEnableDelivery(!!data.enable_delivery_charge);
      setDeliveryCharge(
        data.devlivery_charge != null ? String(data.devlivery_charge) : '',
      );
    }
  }, [data]);

  const handleSave = () => {
    updateShop.mutate({
      enable_delivery_charge: enableDelivery,
      devlivery_charge: enableDelivery ? Number(deliveryCharge) || 0 : 0,
      // preserve existing VAT config
      enable_vat: data?.enable_vat ?? false,
      vat: data?.vat ?? 0,
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-16">
        <ActivityIndicator size="large" color="#6FA25F" />
      </View>
    );
  }

  return (
    <View className="px-4 py-5 gap-6">
      <SectionHeading
        title="Delivery Charge"
        description="Charge customers a flat delivery fee on their orders."
      />

      <View className="flex-row items-center justify-between bg-white dark:bg-gray-800 rounded-xl px-4 py-4 border border-gray-100 dark:border-gray-700">
        <Text className="text-base font-medium text-gray-900 dark:text-white">
          Enable delivery charge
        </Text>
        <Switch
          value={enableDelivery}
          onValueChange={setEnableDelivery}
          trackColor={{ false: '#d1d5db', true: '#6FA25F' }}
          thumbColor={enableDelivery ? '#82c36f' : '#f3f4f6'}
        />
      </View>

      {enableDelivery && (
        <Input
          label="Delivery Charge (AED)"
          value={deliveryCharge}
          onChangeText={setDeliveryCharge}
          placeholder="120.00"
          keyboardType="numeric"
        />
      )}

      <Button onPress={handleSave} loading={updateShop.isPending}>
        <Text className="text-white font-semibold text-base">Update</Text>
      </Button>
    </View>
  );
};
