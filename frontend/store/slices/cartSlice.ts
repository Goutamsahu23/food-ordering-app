// frontend/store/slices/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CartItem = { id?: string; name: string; price: number; qty: number };

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
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
    },
    setCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
  },
});

export const { addItem, removeItem, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
