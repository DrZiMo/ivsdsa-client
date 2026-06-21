import { create } from 'zustand';
import { type FilterState } from '@/types';

/**
 * Zustand store for managing global filter state
 * This store manages Region, Income Level, and Residence Type filters
 * that are persistent across all pages
 */

interface FilterStore extends FilterState {
  // Actions
  setRegion: (region: string) => void;
  setIncome: (incomeLevel: string) => void;
  setResidence: (residenceType: string) => void;
  updateFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
}

const initialState: FilterState = {
  region: 'Metropolitan Area',
  incomeLevel: 'All Tiers',
  residenceType: 'Apartment/Condo',
};

export const useFilterStore = create<FilterStore>((set) => ({
  ...initialState,

  setRegion: (region: string) => {
    set({ region });
  },

  setIncome: (incomeLevel: string) => {
    set({ incomeLevel });
  },

  setResidence: (residenceType: string) => {
    set({ residenceType });
  },

  updateFilters: (filters: Partial<FilterState>) => {
    set((state) => ({
      ...state,
      ...filters,
    }));
  },

  resetFilters: () => {
    set(initialState);
  },
}));
