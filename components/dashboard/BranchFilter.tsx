import { useStoreLocations } from '@/hooks/useSettings';
import { useAnalyticsFilterStore } from '@/store/analyticsFilter.store';
import { useAuthStore } from '@/store/auth.store';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

/**
 * Branch scope for every report on the screen.
 *
 * Admin-only, and gated here rather than at each screen so the check cannot be
 * forgotten on one of them. Managers are already scoped to their own branch by
 * the backend, so the control would be meaningless for them.
 *
 * Uses chips in a horizontal scroller rather than the equal-width tabs used
 * for periods: the number of branches is unbounded and their names are long.
 */
export const BranchFilter: React.FC = () => {
  const isAdmin = useAuthStore((s) => s.userType === 'admin');
  const { data: branches = [] } = useStoreLocations();
  const branchId = useAnalyticsFilterStore((s) => s.branchId);
  const setBranchId = useAnalyticsFilterStore((s) => s.setBranchId);

  // Nothing to choose between until the branch list has loaded.
  if (!isAdmin || branches.length === 0) return null;

  const options = [
    { id: null as number | null, name: 'All Branches' },
    ...branches.map((b) => ({
      id: b.id as number | null,
      name: b.en_title || `Store #${b.id}`,
    })),
  ];

  return (
    <View>
      <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
        Branch
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {options.map((option) => {
          const active = option.id === branchId;
          return (
            <TouchableOpacity
              key={option.id ?? 'all'}
              onPress={() => setBranchId(option.id)}
              activeOpacity={0.8}
              className={`px-4 py-2 rounded-full border ${
                active
                  ? 'bg-primary-600 border-primary-600'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  active ? 'text-white' : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {option.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
