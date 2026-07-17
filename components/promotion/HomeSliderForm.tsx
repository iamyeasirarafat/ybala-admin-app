import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ImagePickerField } from '@/components/settings/ImagePickerField';
import { Button, Input } from '@/components/ui';
import { useSlider, useUpdateSlider } from '@/hooks/usePromotion';
import { promotionService } from '@/services/promotionService';
import { ImageUpload, SliderItem } from '@/types';
import { extractApiError } from '@/utils/errorExtractor';
import { toast } from '@/utils/toast';

interface EditableItem {
  image: string | null; // existing remote path
  localImage: ImageUpload | null; // freshly picked
  image_alt_text: string;
  banner_link: string;
}

const emptyItem = (): EditableItem => ({
  image: null,
  localImage: null,
  image_alt_text: '',
  banner_link: '',
});

export const HomeSliderForm: React.FC = () => {
  const { data: slider } = useSlider();
  const updateSlider = useUpdateSlider();
  const [items, setItems] = useState<EditableItem[]>([emptyItem()]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (slider?.items?.length) {
      setItems(
        slider.items.map((it) => ({
          image: it.image ?? null,
          localImage: null,
          image_alt_text: it.image_alt_text ?? '',
          banner_link: it.banner_link ?? '',
        })),
      );
    }
  }, [slider]);

  const patchItem = (index: number, patch: Partial<EditableItem>) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, ...patch } : it)),
    );
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);
  const removeItem = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const handleSave = async () => {
    try {
      setSaving(true);
      // Upload any freshly picked images first, then persist the JSON items.
      const resolved: SliderItem[] = [];
      for (const it of items) {
        let imagePath = it.image;
        if (it.localImage) {
          imagePath = await promotionService.uploadFile(it.localImage);
        }
        resolved.push({
          image: imagePath,
          image_alt_text: it.image_alt_text || null,
          banner_link: it.banner_link || null,
        });
      }
      await updateSlider.mutateAsync({
        payload: { number_of_banners: resolved.length, items: resolved },
        exists: !!slider,
      });
    } catch (error) {
      toast.error(extractApiError(error, 'Failed to update slider.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1">
      {/* Fixed section header + Add button */}
      <View className="flex-row items-center justify-between px-4 pt-5 pb-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <View className="flex-1 pr-3">
          <Text className="text-lg font-bold text-gray-900 dark:text-white">
            Home Page Slider
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {items.length} banner{items.length === 1 ? '' : 's'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={addItem}
          className="flex-row items-center px-3 py-2 rounded-xl bg-primary-600"
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={16} color="#FFF" />
          <Text className="text-white font-semibold text-sm ml-1">Add</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable banner items */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, gap: 16 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {items.map((item, index) => (
          <View
            key={index}
            className="p-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 gap-3"
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Banner {index + 1}
              </Text>
              {items.length > 1 && (
                <TouchableOpacity onPress={() => removeItem(index)} hitSlop={8}>
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>

            <ImagePickerField
              label="Banner Image"
              defaultImage={item.image}
              value={item.localImage}
              onPick={(asset) => patchItem(index, { localImage: asset })}
            />
            <Input
              label="Image Alt Text"
              value={item.image_alt_text}
              onChangeText={(v) => patchItem(index, { image_alt_text: v })}
              placeholder="Box of happiness"
            />
            <Input
              label="Banner Link"
              value={item.banner_link}
              onChangeText={(v) => patchItem(index, { banner_link: v })}
              placeholder="https://ybalashop.com/offer"
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>
        ))}
      </ScrollView>

      {/* Fixed footer save button */}
      <View className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <Button onPress={handleSave} loading={saving || updateSlider.isPending}>
          <Text className="text-white font-semibold text-base">Update Slider</Text>
        </Button>
      </View>
    </View>
  );
};
