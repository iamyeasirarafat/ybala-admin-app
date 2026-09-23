import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { deliveryService } from '@/services/deliveryService';
import {
  ACTIVE_ASSIGNMENT_STATUSES,
  AssignmentListParams,
  CreateAssignmentPayload,
  DeliveryAssignment,
  DeliveryManProfilePayload,
} from '@/types';
import { extractApiError } from '@/utils/errorExtractor';
import { toast } from '@/utils/toast';

const keys = {
  profiles: ['delivery', 'profiles'] as const,
  profile: (id: number) => ['delivery', 'profile', id] as const,
  assignments: (params: AssignmentListParams) =>
    ['delivery', 'assignments', params] as const,
  stats: (id: number) => ['delivery', 'stats', id] as const,
};

// ---- Profiles ----

export const useDeliveryProfiles = () =>
  useQuery({
    queryKey: keys.profiles,
    queryFn: deliveryService.getProfiles,
    staleTime: 60 * 1000,
  });

export const useDeliveryProfile = (id?: number) =>
  useQuery({
    queryKey: keys.profile(id ?? 0),
    queryFn: () => deliveryService.getProfile(id as number),
    enabled: !!id,
  });

export const useSaveDeliveryProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id?: number;
      payload: DeliveryManProfilePayload;
    }) =>
      id
        ? deliveryService.updateProfile(id, payload)
        : deliveryService.createProfile(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['delivery'] });
    },
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to save delivery profile.'));
    },
  });
};

// ---- Assignments ----

export const useAssignments = (
  params: AssignmentListParams,
  enabled = true,
) =>
  useQuery({
    queryKey: keys.assignments(params),
    queryFn: () => deliveryService.getAssignments(params),
    placeholderData: keepPreviousData,
    enabled,
  });

/**
 * The delivery history of one order, newest first (the backend orders by -id).
 * An order can accumulate several rows when an earlier attempt was cancelled
 * or failed, so the active one is surfaced separately from the full trail.
 */
export const useOrderAssignments = (orderId?: number) => {
  const query = useAssignments({ order: orderId as number }, !!orderId);
  const assignments: DeliveryAssignment[] = query.data ?? [];
  const active = assignments.find((a) =>
    ACTIVE_ASSIGNMENT_STATUSES.includes(a.status),
  );
  // With no active row, the latest closed one still carries who delivered it.
  return { ...query, assignments, active, latest: active ?? assignments[0] };
};

export const useAssignDeliveryMan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAssignmentPayload) =>
      deliveryService.createAssignment(payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['delivery'] });
      qc.invalidateQueries({ queryKey: ['order', 'detail', vars.order_id] });
      qc.invalidateQueries({ queryKey: ['order', 'list'] });
      toast.success('Delivery man assigned.');
    },
    onError: (error) => {
      toast.error(extractApiError(error, 'Failed to assign delivery man.'));
    },
  });
};

export const useDeliveryStats = (deliveryManId?: number) =>
  useQuery({
    queryKey: keys.stats(deliveryManId ?? 0),
    queryFn: () => deliveryService.getStats(deliveryManId as number),
    enabled: !!deliveryManId,
  });
