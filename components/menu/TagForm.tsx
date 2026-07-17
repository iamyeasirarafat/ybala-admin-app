import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SectionHeading } from '@/components/settings/SectionHeading';
import { Button, Input } from '@/components/ui';
import { useSaveTag, useTag } from '@/hooks/useMenu';
import { toast } from '@/utils/toast';

export const TagForm: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const tagId = id ? Number(id) : undefined;

  const { data: tag, isLoading } = useTag(tagId);
  const saveTag = useSaveTag();
  const [name, setName] = useState('');

  useEffect(() => {
    if (tag) setName(tag.name || '');
  }, [tag]);

  const handleSave = async () => {
    if (!name.trim()) return toast.error('Tag name is required.');
    try {
      await saveTag.mutateAsync({ id: tagId, name: name.trim() });
      router.back();
    } catch {
      // handled by hook
    }
  };

  if (tagId && isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-16">
        <ActivityIndicator size="large" color="#6FA25F" />
      </View>
    );
  }

  return (
    <View className="px-4 py-5 gap-5">
      <SectionHeading title={tagId ? 'Edit Tag' : 'New Tag'} />
      <Input
        label="Tag Name"
        value={name}
        onChangeText={setName}
        placeholder="e.g. Spicy"
      />
      <Button onPress={handleSave} loading={saveTag.isPending}>
        <Text className="text-white font-semibold text-base">
          {tagId ? 'Update' : 'Create'}
        </Text>
      </Button>
    </View>
  );
};
