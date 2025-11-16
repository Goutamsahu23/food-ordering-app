import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CartItem = { id?: string; name: string; price: number; qty: number };

type CartState = {
  items: CartItem[];
  restaurantId: string | null; 
};

const initialState: CartState = {
  items: [],
  restaurantId: null, 
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setRestaurantId(state, action: PayloadAction<string>) {
      state.restaurantId = action.payload;
    },

    clearRestaurant(state) {
      state.restaurantId = null;
    },

    addItem(state, action: PayloadAction<CartItem>) {
      const found = state.items.find(i => i.name === action.payload.name);
      if (found) {
        found.qty += action.payload.qty;
      } else {
        state.items.push(action.payload);
      }
    },

    removeItem(state, action: PayloadAction<{ name: string }>) {
      state.items = state.items.filter(i => i.name !== action.payload.name);
    },

    clearCart(state) {
      state.items = [];
      state.restaurantId = null; 
    },

    setCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
  },
});

export const {
  addItem,
  removeItem,
  clearCart,
  setCart,
  setRestaurantId,
  clearRestaurant
} = cartSlice.actions;

export default cartSlice.reducer;
