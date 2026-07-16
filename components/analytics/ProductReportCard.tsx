import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import { PeriodTabs } from '@/components/dashboard/PeriodTabs';
import { ReportCard } from '@/components/dashboard/ReportCard';
import { AnalyticsPeriod, ReportOrder } from '@/types';

export interface ProductRowItem {
  id: number | string;
  name: string;
  image?: string;
  primary: { label: string; value: string | number };
  secondary: { label: string; value: string | number };
}

interface ProductReportCardProps {
  title: string;
  period: AnalyticsPeriod;
  onPeriodChange: (period: AnalyticsPeriod) => void;
  order: ReportOrder;
  onOrderChange: (order: ReportOrder) => void;
  items: ProductRowItem[];
  isLoading: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
}

export const ProductReportCard: React.FC<ProductReportCardProps> = ({
  title,
  period,
  onPeriodChange,
  order,
  onOrderChange,
  items,
  isLoading,
  hasMore = false,
  onLoadMore,
  loadingMore = false,
}) => {
  return (
    <ReportCard>
      {/* Title + sort toggle aligned on one row */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </Text>
        <TouchableOpacity
          className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1.5"
          onPress={() => onOrderChange(order === 'desc' ? 'asc' : 'desc')}
          activeOpacity={0.7}
        >
          <Ionicons
            name={order === 'desc' ? 'arrow-down' : 'arrow-up'}
            size={14}
            color="#6FA25F"
          />
          <Text className="text-xs font-semibold text-gray-600 dark:text-gray-300 ml-1">
            {order === 'desc' ? 'High to Low' : 'Low to High'}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mb-3">
        <PeriodTabs value={period} onChange={onPeriodChange} />
      </View>

      {isLoading ? (
        <View className="h-40 items-center justify-center">
          <ActivityIndicator color="#6FA25F" />
        </View>
      ) : items.length === 0 ? (
        <View className="h-40 items-center justify-center">
          <Text className="text-gray-400">No data available</Text>
        </View>
      ) : (
        <View className="gap-2">
          {items.map((item) => (
            <View
              key={item.id}
              className="flex-row items-center py-2 border-b border-gray-100 dark:border-gray-800"
            >
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  className="w-11 h-11 rounded-lg bg-gray-100 dark:bg-gray-800"
                />
              ) : (
                <View className="w-11 h-11 rounded-lg bg-gray-100 dark:bg-gray-800 items-center justify-center">
                  <Ionicons name="fast-food-outline" size={20} color="#9CA3AF" />
                </View>
              )}

              <Text
                className="flex-1 mx-3 text-sm font-medium text-gray-900 dark:text-white"
                numberOfLines={1}
              >
                {item.name}
              </Text>

              <View className="items-end mr-4">
                <Text className="text-[10px] text-gray-400">{item.primary.label}</Text>
                <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                  {item.primary.value}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-[10px] text-gray-400">{item.secondary.label}</Text>
                <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                  {item.secondary.value}
                </Text>
              </View>
            </View>
          ))}

          {hasMore && (
            <TouchableOpacity
              className="mt-1 self-center flex-row items-center py-1.5 px-2"
              onPress={onLoadMore}
              disabled={loadingMore}
              activeOpacity={0.6}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {loadingMore ? (
                <ActivityIndicator color="#6FA25F" size="small" />
              ) : (
                <>
                  <Text className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                    Load more
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={13}
                    color="#6FA25F"
                    style={{ marginLeft: 3 }}
                  />
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </ReportCard>
  );
};
