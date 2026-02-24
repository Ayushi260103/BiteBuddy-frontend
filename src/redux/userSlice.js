import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        currentCity: null,
        currentState: null,
        currentAddress: null,
        shopsInMyCity: null,
        itemsInMyCity: null,
        // cartItems: [{
        //     id: null,
        //     name: null,
        //     price: null,
        //     image: null,
        //     shop: null,
        //     quantity: null,
        //     foodType: null
        // }],
        cartItems: [],
        totalAmount: 0,
        myOrders: [],
        searchItems: [],
        socket: null,
        authLoading: true,
        cityLoading: true,
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
            state.authLoading = false;
        },
        setCurrentCity: (state, action) => {
            state.currentCity = action.payload;
            state.cityLoading = false;
        },
        setCurrentState: (state, action) => {
            state.currentState = action.payload;
        },
        setCurrentAddress: (state, action) => {
            state.currentAddress = action.payload;
        },
        setShopsInMyCity: (state, action) => {
            state.shopsInMyCity = action.payload;
        },
        setItemsInMyCity: (state, action) => {
            state.itemsInMyCity = action.payload;
        },
        addToCart: (state, action) => {
            const newCartItem = action.payload;
            const existing = state.cartItems.find(item => item.id === newCartItem.id);
            if (existing) {
                existing.quantity += newCartItem.quantity;
            }
            else {
                state.cartItems.push(newCartItem);
            }
            state.totalAmount = state.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
            console.log("Cart Items: ", state.cartItems);
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.cartItems.find(item => item.id === id);
            if (item) {
                item.quantity = quantity;
            }
            state.totalAmount = state.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        },
        removeCartItem: (state, action) => {
            const id = action.payload;
            state.cartItems = state.cartItems.filter(item => item.id !== id);
            state.totalAmount = state.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        },
        setMyOrders: (state, action) => {
            state.myOrders = Array.isArray(action.payload) ? action.payload : [];
        },
        addNewOrderToMyOrders: (state, action) => {
            state.myOrders = [action.payload,...state.myOrders]
        },
        updateOrderStatus: (state, action) => {       //owner apna order status update krwa rha
            const { orderId, shopId, status } = action.payload;

            const order = state.myOrders.find(o => o._id == orderId);

            if (order) {
                if(order.shopOrders && order.shopOrders.shop._id == shopId){
                    order.shopOrders.status = status;
                }
            }
        },
        updateRealTimeOrderStatus: (state, action) => {       
            const { orderId, shopId, status } = action.payload;
            const order = state.myOrders.find(o => o._id == orderId);
            if (order) {
                const shopOrder = order.shopOrders.find(so => so.shop._id == shopId)
                if (shopOrder) {
                    shopOrder.status = status;
                }
            }
        },
        updateAssignedDeliveryBoy: (state, action) => {
            const { orderId, shopId, assignedDeliveryBoy } = action.payload;
            const order = state.myOrders.find(o => o._id == orderId);
            if (!order) return;

            const ownerShopOrder = order.shopOrders;
            if (ownerShopOrder && !Array.isArray(ownerShopOrder) && ownerShopOrder.shop?._id == shopId) {
                ownerShopOrder.assignedDeliveryBoy = assignedDeliveryBoy;
                return;
            }

            if (Array.isArray(order.shopOrders)) {
                const userShopOrder = order.shopOrders.find(so => so.shop?._id == shopId);
                if (userShopOrder) {
                    userShopOrder.assignedDeliveryBoy = assignedDeliveryBoy;
                }
            }
        },
        setSearchItems: (state, action) => {
            state.searchItems = action.payload;
        },
        setSocket: (state, action) => {
            state.socket = action.payload;
        },
        setLoading: (state, action) => {
            state.authLoading = action.payload;
        }
    }
});

export const { setUserData, setCurrentCity, setLoading,
    setCurrentState, setCurrentAddress, setShopsInMyCity,
    setItemsInMyCity, addToCart, updateQuantity, removeCartItem,
    setMyOrders, addNewOrderToMyOrders, updateOrderStatus, setSearchItems,
    setSocket, updateRealTimeOrderStatus, updateAssignedDeliveryBoy
} = userSlice.actions;

export default userSlice.reducer;
