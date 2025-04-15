// 1. Create Redux Slice: src/redux/slices/appSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Restaurent } from '@/components/comp-manager/types';

interface AppState {
  activeUser: User | null;
  activeCategory: string | null;
  activeRestaurant: Restaurent | null;
  owners: User[];
}

const initialState: AppState = {
  activeUser: null,
  activeCategory: null,
  activeRestaurant: null,
  owners: [],
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setActiveUser(state, action: PayloadAction<User | null>) {
      state.activeUser = action.payload;
    },
    setActiveCategory(state, action: PayloadAction<string | null>) {
      state.activeCategory = action.payload;
    },
    setActiveRestaurant(state, action: PayloadAction<Restaurent | null>) {
      state.activeRestaurant = action.payload;
    },
    setOwners(state, action: PayloadAction<User[]>) {
      state.owners = action.payload;
    },
  },
});

export const {
  setActiveUser,
  setActiveCategory,
  setActiveRestaurant,
  setOwners,
} = appSlice.actions;

export default appSlice.reducer;
