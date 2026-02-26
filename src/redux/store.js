import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice.js";
import ownerSlice from "./ownerSlice.js";
import mapSlice from "./mapSlice.js";

const CART_STORAGE_KEY = "bitebuddy_user_cart";   //This is the key used in localStorage to save and retrieve the cart data.

const loadCartState = () => {
    if (typeof window === "undefined") return undefined;
    try {
        const rawCartState = localStorage.getItem(CART_STORAGE_KEY);
        if (!rawCartState) return undefined;

        const parsedCartState = JSON.parse(rawCartState);
        const defaultUserState = userSlice(undefined, { type: "@@INIT" });
        return {
            user: {
                ...defaultUserState,
                cartItems: parsedCartState.cartItems ?? [],
                totalAmount: parsedCartState.totalAmount ?? 0
            }
        };
    } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
        return undefined;
    }
};

const saveCartState = (state) => {
    if (typeof window === "undefined") return;
    try {
        const cartStateToPersist = {
            cartItems: state.user.cartItems,
            totalAmount: state.user.totalAmount
        };
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartStateToPersist));
    } catch (error) {
        console.error("Failed to save cart to localStorage:", error);
    }
};

export const store = configureStore({
    reducer: {
        user: userSlice,
        owner: ownerSlice,
        map: mapSlice
    },
    preloadedState: loadCartState()
});

store.subscribe(() => {
    saveCartState(store.getState());
});
