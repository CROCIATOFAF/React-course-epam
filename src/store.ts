import {
  configureStore,
  createSlice,
  PayloadAction,
  createSelector,
} from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from './components/services/api';

console.log(api);

export interface Item {
  id: string;
  title: string;
  description: string;
  image?: string;
}

interface SelectedItemsState {
  items: Record<string, Item>;
}

const initialSelectedState: SelectedItemsState = {
  items: {},
};

const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState: initialSelectedState,
  reducers: {
    selectItem: (state, action: PayloadAction<Item>) => {
      state.items[action.payload.id] = action.payload;
    },
    unselectItem: (state, action: PayloadAction<string>) => {
      state.items = Object.fromEntries(
        Object.entries(state.items).filter(([key]) => key !== action.payload)
      );
    },
    unselectAll: (state) => {
      state.items = {};
    },
  },
});

export const { selectItem, unselectItem, unselectAll } =
  selectedItemsSlice.actions;

export const selectedItemsReducer = selectedItemsSlice.reducer;

export const store = configureStore({
  reducer: {
    selectedItems: selectedItemsReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const selectSelectedItems = createSelector(
  (state: RootState) => state.selectedItems.items,
  (items) => Object.values(items)
);
