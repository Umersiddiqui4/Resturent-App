import { User, Restaurent } from '@/components/comp-manager/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    setActiveUser(state: any, action: PayloadAction<User | null>) {
      state.activeUser = action.payload;
    },
    setActiveCategory(state: any, action: PayloadAction<string | null>) {
      state.activeCategory = action.payload;
    },
    setActiveRestaurant(state: any, action: PayloadAction<Restaurent | null>) {
      state.activeRestaurant = action.payload;
    },
    setOwners(state: any, action: PayloadAction<User[]>) {
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
