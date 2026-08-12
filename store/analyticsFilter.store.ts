import { create } from 'zustand';

interface AnalyticsFilterState {
  /** null means "All branches" — no branch_id is sent to the API. */
  branchId: number | null;
  setBranchId: (branchId: number | null) => void;
  reset: () => void;
}

/**
 * Branch scope for the dashboard and analytics screens.
 *
 * Kept in a store rather than passed down because the seven report components
 * each own their own fetch — threading a prop through all of them (and both
 * screens) to reach the query params would touch far more code than it saves.
 * The analytics hooks already read auth state this way.
 *
 * Shared across both screens on purpose: picking a branch on the dashboard and
 * then finding Analytics reset to "All" would read as a bug.
 */
export const useAnalyticsFilterStore = create<AnalyticsFilterState>((set) => ({
  branchId: null,
  setBranchId: (branchId) => set({ branchId }),
  reset: () => set({ branchId: null }),
}));
