import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SingleSelectField } from '@/components/menu/SingleSelectField';
import { Input } from '@/components/ui';
import { SelectOption, ShippingAddress } from '@/types';

export type DeliveryMethod = 'delivery' | 'pickup';

interface DeliverySectionProps {
  method: DeliveryMethod;
  onMethodChange: (m: DeliveryMethod) => void;
  address: ShippingAddress;
  onAddressChange: (a: ShippingAddress) => void;
  branchId: number | null;
  onBranchChange: (id: number | null) => void;
  branchOptions: SelectOption[];
}

export const DeliverySection: React.FC<DeliverySectionProps> = ({
  method,
  onMethodChange,
  address,
  onAddressChange,
  branchId,
  onBranchChange,
  branchOptions,
}) => {
  const patch = (u: Partial<ShippingAddress>) =>
    onAddressChange({ ...address, ...u });

  return (
    <View className="gap-3">
      <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Fulfilment
      </Text>

      <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {(['delivery', 'pickup'] as DeliveryMethod[]).map((m) => (
          <TouchableOpacity
            key={m}
            onPress={() => onMethodChange(m)}
            className={`flex-1 py-2 rounded-lg items-center ${
              method === m ? 'bg-white dark:bg-gray-700' : ''
            }`}
            activeOpacity={0.8}
          >
            <Text
              className={`text-sm font-semibold capitalize ${
                method === m
                  ? 'text-primary-600 dark:text-primary-300'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {m}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {method === 'delivery' ? (
        <View className="gap-3">
          <Input
            label="Street"
            value={address.street}
            onChangeText={(v) => patch({ street: v })}
            placeholder="Building, street"
          />
          <Input
            label="City"
            value={address.city}
            onChangeText={(v) => patch({ city: v })}
            placeholder="City"
          />
          <Input
            label="ZIP / Postal Code"
            value={address.zip}
            onChangeText={(v) => patch({ zip: v })}
            placeholder="ZIP"
          />
        </View>
      ) : (
        <SingleSelectField
          label="Pickup Branch"
          options={branchOptions}
          value={branchId}
          onChange={onBranchChange}
          placeholder="Select a branch"
        />
      )}
    </View>
  );
};
