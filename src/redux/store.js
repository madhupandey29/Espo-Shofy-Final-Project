import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { userApi } from "./features/userApi";
import authSlice from "./features/auth/authSlice";
import cartSlice from "./features/cartSlice";
import compareSlice from "./features/compareSlice";
import productModalSlice from "./features/productModalSlice";
import shopFilterSlice from "./features/shop-filter-slice";
import wishlistSlice from "./features/wishlist-slice";
import orderSlice from "./features/order/orderSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [userApi.reducerPath]: userApi.reducer,
    auth: authSlice,
    productModal: productModalSlice,
    shopFilter: shopFilterSlice,
    cart: cartSlice,
    wishlist: wishlistSlice,
    compare: compareSlice,
    order: orderSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "cart/add_cart_product",
          "wishlist/add_to_wishlist",
          "api/executeQuery/fulfilled",
          "api/executeQuery/rejected",
          "api/executeMutation/fulfilled",
          "api/executeMutation/rejected",
        ],
        ignoredActionPaths: [
          "payload.product",
          "payload.prd",
          "meta.baseQueryMeta",
          "meta.arg.originalArgs",
        ],
        ignoredPaths: [
          "cart.cart_products",
          "wishlist.wishlist",
          "meta.baseQueryMeta",
        ],
        // Optimize for production
        warnAfter: process.env.NODE_ENV === 'development' ? 32 : Infinity,
      },
      immutableCheck: {
        warnAfter: process.env.NODE_ENV === 'development' ? 32 : Infinity,
      },
    }).concat([apiSlice.middleware, userApi.middleware]),
  devTools: process.env.NODE_ENV === 'development',
});

export default store;
