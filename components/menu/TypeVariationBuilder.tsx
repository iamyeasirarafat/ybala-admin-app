import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MenuTypeGroup } from '@/types';

interface TypeVariationBuilderProps {
  value: MenuTypeGroup[];
  onChange: (groups: MenuTypeGroup[]) => void;
  showPrice: boolean;
}

const fieldClass =
  'flex-1 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white';

export const TypeVariationBuilder: React.FC<TypeVariationBuilderProps> = ({
  value,
  onChange,
  showPrice,
}) => {
  const [typeText, setTypeText] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [variationText, setVariationText] = useState('');
  const [variationPrice, setVariationPrice] = useState('');

  const addType = () => {
    const name = typeText.trim();
    if (!name) return;
    if (value.some((g) => g.name === name)) {
      setTypeText('');
      return;
    }
    onChange([...value, { name, variation: [] }]);
    setTypeText('');
    setSelectedType(name);
  };

  const removeType = (name: string) => {
    onChange(value.filter((g) => g.name !== name));
    if (selectedType === name) setSelectedType(null);
  };

  const addVariation = () => {
    const vName = variationText.trim();
    if (!vName || !selectedType) return;
    onChange(
      value.map((g) =>
        g.name === selectedType
          ? {
              ...g,
              variation: [
                ...g.variation.filter((v) => v.name !== vName),
                { name: vName, price: showPrice ? variationPrice : '' },
              ],
            }
          : g,
      ),
    );
    setVariationText('');
    setVariationPrice('');
  };

  const removeVariation = (typeName: string, vName: string) => {
    onChange(
      value.map((g) =>
        g.name === typeName
          ? { ...g, variation: g.variation.filter((v) => v.name !== vName) }
          : g,
      ),
    );
  };

  const selectedGroup = value.find((g) => g.name === selectedType) || null;

  return (
    <View className="gap-3">
      <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Type & Variations
      </Text>

      {/* Add type */}
      <View className="flex-row items-center gap-2">
        <TextInput
          value={typeText}
          onChangeText={setTypeText}
          placeholder="Add a type (e.g. Size)"
          placeholderTextColor="#9CA3AF"
          className={fieldClass}
          style={{ fontSize: 15 }}
        />
        <TouchableOpacity
          onPress={addType}
          className="px-4 py-2.5 rounded-xl bg-primary-600"
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold text-sm">Add</Text>
        </TouchableOpacity>
      </View>

      {/* Type chips */}
      {value.length > 0 && (
        <View className="flex-row flex-wrap gap-2">
          {value.map((g) => {
            const active = selectedType === g.name;
            return (
              <TouchableOpacity
                key={g.name}
                onPress={() => setSelectedType(active ? null : g.name)}
                className={`flex-row items-center px-3 py-1.5 rounded-lg border ${
                  active
                    ? 'bg-primary-600 border-primary-600'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                }`}
                activeOpacity={0.8}
              >
                <Text
                  className={`text-sm font-medium capitalize ${
                    active ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {g.name} ({g.variation.length})
                </Text>
                <TouchableOpacity
                  onPress={() => removeType(g.name)}
                  hitSlop={6}
                  className="ml-1.5"
                >
                  <Ionicons
                    name="close"
                    size={14}
                    color={active ? '#FFF' : '#9CA3AF'}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Variation editor for the selected type */}
      {selectedGroup && (
        <View className="p-3 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 gap-3">
          <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
            {selectedGroup.name} variations
          </Text>
          <View className="flex-row items-center gap-2">
            <TextInput
              value={variationText}
              onChangeText={setVariationText}
              placeholder="Variation name"
              placeholderTextColor="#9CA3AF"
              className={fieldClass}
              style={{ fontSize: 15 }}
            />
            {showPrice && (
              <TextInput
                value={variationPrice}
                onChangeText={setVariationPrice}
                placeholder="Price"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                className="w-24 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                style={{ fontSize: 15 }}
              />
            )}
            <TouchableOpacity
              onPress={addVariation}
              className="px-4 py-2.5 rounded-xl bg-primary-600"
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-sm">Add</Text>
            </TouchableOpacity>
          </View>

          {selectedGroup.variation.length > 0 && (
            <View className="flex-row flex-wrap gap-2">
              {selectedGroup.variation.map((v) => (
                <View
                  key={v.name}
                  className="flex-row items-center px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  <Text className="text-sm text-gray-700 dark:text-gray-300">
                    {v.name}
                    {showPrice && v.price ? ` (${v.price})` : ''}
                  </Text>
                  <TouchableOpacity
                    onPress={() => removeVariation(selectedGroup.name, v.name)}
                    hitSlop={6}
                    className="ml-1.5"
                  >
                    <Ionicons name="close" size={14} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
};
