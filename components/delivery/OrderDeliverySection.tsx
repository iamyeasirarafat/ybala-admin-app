import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Avatar } from '@/components/ui';
import {
  useAssignDeliveryMan,
  useDeliveryProfiles,
  useOrderAssignments,
} from '@/hooks/useDelivery';
import { DeliveryAssignment, ManagedUser, Order } from '@/types';
import { mediaUrl } from '@/utils/format';
import { DeliveryManSelectField } from './DeliveryManSelectField';
import {
  assignmentMeta,
  formatTimestamp,
  isOrderAssignable,
  vehicleLabel,
} from './deliveryStatus';

// Mirrors the card used by OrderDetail so the block sits flush with the rest
// of the screen.
const Card = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 gap-1">
    <Text className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">
      {title}
    </Text>
    {children}
  </View>
);

const TimelineRow = ({
  label,
  value,
  done,
}: {
  label: string;
  value?: string | null;
  done: boolean;
}) => (
  <View className="flex-row items-center py-1">
    <Ionicons
      name={done ? 'checkmark-circle' : 'ellipse-outline'}
      size={16}
      color={done ? '#22C55E' : '#D1D5DB'}
    />
    <Text className="text-sm text-gray-600 dark:text-gray-300 ml-2 flex-1">
      {label}
    </Text>
    <Text className="text-xs text-gray-500 dark:text-gray-400">
      {formatTimestamp(value)}
    </Text>
  </View>
);

/** Read-only summary of one assignment: who is carrying the order, how to
 *  reach them, and how far along they are. */
const AssignmentDetails: React.FC<{
  assignment: DeliveryAssignment;
  vehicle?: string;
}> = ({ assignment, vehicle }) => {
  const rider = assignment.delivery_man_data;
  const meta = assignmentMeta(assignment.status);
  const phone = rider?.phoneNumber;

  return (
    <View className="gap-2">
      <View className="flex-row items-center">
        <Avatar
          size="lg"
          source={mediaUrl(rider?.profile_image)}
          initials={rider?.full_name?.charAt(0).toUpperCase()}
        />
        <View className="flex-1 ml-3">
          <Text className="text-base font-semibold text-gray-900 dark:text-white">
            {rider?.full_name || 'Unassigned'}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {[phone, vehicle].filter(Boolean).join(' · ') || '—'}
          </Text>
        </View>
        {!!phone && (
          <TouchableOpacity
            onPress={() => Linking.openURL(`tel:${phone}`)}
            className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/30 items-center justify-center"
            activeOpacity={0.7}
          >
            <Ionicons name="call-outline" size={18} color="#6FA25F" />
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-row items-center gap-2 mt-1">
        <View className={`px-2.5 py-1 rounded-full ${meta.bg}`}>
          <Text className={`text-[11px] font-semibold ${meta.text}`}>
            {meta.label}
          </Text>
        </View>
        <Text className="text-xs text-gray-400 dark:text-gray-500">
          Assignment #{assignment.id}
        </Text>
      </View>

      <View className="h-px bg-gray-100 dark:bg-gray-700 my-1" />

      <TimelineRow label="Assigned" value={assignment.assigned_at} done />
      <TimelineRow
        label="Accepted by rider"
        value={assignment.accepted_at}
        done={!!assignment.accepted_at}
      />
      <TimelineRow
        label="Picked up"
        value={assignment.picked_up_at}
        done={!!assignment.picked_up_at}
      />
      <TimelineRow
        label="Delivered"
        value={assignment.delivered_at}
        done={!!assignment.delivered_at}
      />
      {!!assignment.cancelled_at && (
        <TimelineRow
          label="Cancelled"
          value={assignment.cancelled_at}
          done
        />
      )}
      {!!assignment.failure_reason && (
        <Text className="text-xs text-red-500 mt-1">
          Failure reason: {assignment.failure_reason}
        </Text>
      )}
    </View>
  );
};

/**
 * Delivery block on the order detail screen. Shows the current rider when the
 * order already has one, and otherwise the picker that creates the assignment.
 * Pickup orders are skipped entirely — nobody delivers them.
 */
export const OrderDeliverySection: React.FC<{ order: Order }> = ({ order }) => {
  const [rider, setRider] = useState<ManagedUser | null>(null);
  const { assignments, active, latest, isLoading } = useOrderAssignments(
    order.id,
  );
  const { data: profiles = [] } = useDeliveryProfiles();
  const assign = useAssignDeliveryMan();

  const vehicleFor = useMemo(
    () => (userId?: number | null) => {
      if (!userId) return undefined;
      const profile = profiles.find((p) => p.user === userId);
      return profile ? vehicleLabel(profile.vehicle_type) : undefined;
    },
    [profiles],
  );

  // Earlier attempts that ended (failed / cancelled) while a newer one runs.
  const history = assignments.filter((a) => a.id !== latest?.id);

  if (order.is_pickup) return null;

  const assignable = isOrderAssignable(order.status, order.is_pickup);

  const handleAssign = () => {
    if (!rider) return;
    assign.mutate(
      { order_id: order.id, delivery_man_id: rider.id },
      { onSuccess: () => setRider(null) },
    );
  };

  if (isLoading) {
    return (
      <Card title="Delivery Man">
        <ActivityIndicator size="small" color="#6FA25F" className="py-4" />
      </Card>
    );
  }

  return (
    <View className="gap-4">
      {latest ? (
        <Card title={active ? 'Delivery Man' : 'Last Delivery Attempt'}>
          <AssignmentDetails
            assignment={latest}
            vehicle={vehicleFor(latest.delivery_man)}
          />
        </Card>
      ) : null}

      {/* No rider on the order right now — offer the picker. */}
      {!active && (
        <Card title={latest ? 'Reassign Delivery Man' : 'Assign Delivery Man'}>
          {assignable ? (
            <View className="gap-3">
              <DeliveryManSelectField
                label=""
                value={rider}
                onChange={setRider}
              />
              <TouchableOpacity
                onPress={handleAssign}
                disabled={!rider || assign.isPending}
                className={`flex-row items-center justify-center py-3 rounded-xl ${
                  rider ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
                activeOpacity={0.85}
              >
                {assign.isPending ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <Ionicons
                      name="bicycle-outline"
                      size={18}
                      color={rider ? '#FFF' : '#9CA3AF'}
                    />
                    <Text
                      className={`font-semibold text-base ml-2 ${
                        rider ? 'text-white' : 'text-gray-400'
                      }`}
                    >
                      Assign Order
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              Move the order to <Text className="font-semibold">Processing</Text>{' '}
              before assigning a delivery man.
            </Text>
          )}
        </Card>
      )}

      {history.length > 0 && (
        <Card title={`Previous Attempts (${history.length})`}>
          {history.map((item) => {
            const meta = assignmentMeta(item.status);
            return (
              <View
                key={item.id}
                className="flex-row items-center justify-between py-2 border-b border-gray-50 dark:border-gray-700/50"
              >
                <View className="flex-1 pr-3">
                  <Text className="text-sm text-gray-900 dark:text-white">
                    {item.delivery_man_data?.full_name || 'Unknown rider'}
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimestamp(item.assigned_at)}
                    {item.failure_reason ? ` · ${item.failure_reason}` : ''}
                  </Text>
                </View>
                <View className={`px-2 py-0.5 rounded-full ${meta.bg}`}>
                  <Text className={`text-[10px] font-semibold ${meta.text}`}>
                    {meta.label}
                  </Text>
                </View>
              </View>
            );
          })}
        </Card>
      )}
    </View>
  );
};
