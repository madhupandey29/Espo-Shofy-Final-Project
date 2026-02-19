import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { cartApi } from "./cartApi";

/* ---------------- config ---------------- */
const API_BASE = "https://test.amrita-fashions.com";

/* ---------------- helpers ---------------- */
const productKey = (p) => p?._id || p?.id || p?.productId || null;
const computeDistinctCount = (items = []) =>
  new Set(items.map((it) => productKey(it)).filter(Boolean)).size;

const normalizeItems = (items = []) =>
  items.map((it) => {
    const p = { ...(it?.product || {}), ...it };
    const pid = productKey(p);
    return {
      ...p,
      _id: pid,
      id: pid,
      orderQuantity:
        typeof p.orderQuantity === "number"
          ? p.orderQuantity
          : typeof p.qty === "number"
          ? p.qty
          : typeof p.quantity === "number"
          ? p.quantity
          : 1,
      quantity:
        typeof p.quantity === "number"
          ? p.quantity
          : typeof p.stock === "number"
          ? p.stock
          : undefined,
      title: p.title || p.name || "Product",
      price:
        typeof p.price === "string" || typeof p.price === "number"
          ? parseFloat(p.price) || 0
          : 0,
      image: p.image || p.imageUrl || p.img || p.thumbnail || "",
    };
  });

/* ================================
   THUNKS (classic)
=================================== */

export const fetch_cart_products = createAsyncThunk(
  "cart/fetch_cart_products",
  async ({ userId }, { rejectWithValue }) => {
    try {
      if (!userId) return rejectWithValue("Missing userId");
      
      // Using unified API endpoint (same as wishlist)
      const API_BASE_UNIFIED = process.env.NEXT_PUBLIC_API_BASE_URL || "https://espobackend.vercel.app/api";
      const url = `${API_BASE_UNIFIED}/wishlist/fieldname/customerAccountId/${encodeURIComponent(userId)}`;
      
      const res = await fetch(url, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        credentials: "include",
        cache: "no-store",
      });
      
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        return rejectWithValue(`HTTP ${res.status}: ${txt || "Failed to load cart"}`);
      }
      
      const json = await res.json();
      
      console.log('🛒 FETCH CART - Raw response:', json);
      
      if (!json?.success) return rejectWithValue(json?.message || "Cart API success=false");

      // Filter only cart items (itemType === "cart")
      const allItems = Array.isArray(json?.data) ? json.data : [];
      const cartItems = allItems.filter(item => item.itemType === 'cart');
      
      console.log('🛒 Filtered cart items:', cartItems.length, 'out of', allItems.length);

      // Transform cart items to include product data
      const transformedItems = cartItems.map(item => ({
        // Cart metadata
        _id: item.productId,
        id: item.productId,
        productId: item.productId,
        cartItemId: item.id, // For update/delete operations
        
        // Cart-specific fields
        orderQuantity: item.qty || 1,
        qty: item.qty || 1,
        quantity: item.qty || 1,
        price: parseFloat(item.price) || 0,
        priceCurrency: item.priceCurrency || 'USD',
        priceConverted: item.priceConverted,
        itemType: item.itemType,
        
        // Product data from nested object
        ...(item.product || {}),
        
        // Override with top-level fields
        title: item.productName || item.product?.name || 'Product',
        name: item.productName || item.product?.name || 'Product',
        image: item.product?.image1CloudUrl || item.product?.img || '',
        
        // Keep original for reference
        __originalCartItem: item,
      }));

      console.log('🛒 Transformed cart items:', transformedItems);

      return transformedItems;
    } catch (e) {
      console.error('🛒 FETCH CART Error:', e);
      return rejectWithValue(e?.message || "Unknown error fetching cart");
    }
  }
);

export const add_to_cart = createAsyncThunk(
  "cart/add_to_cart",
  async ({ userId, productId, quantity = 1, price = null, priceCurrency = 'USD' }, { dispatch, rejectWithValue }) => {
    try {
      if (!userId || !productId) return rejectWithValue("Missing userId or productId");
      
      console.log('🛒 ADD TO CART:', { userId, productId, quantity, price, priceCurrency });
      
      // Using unified API endpoint (same as wishlist)
      const API_BASE_UNIFIED = process.env.NEXT_PUBLIC_API_BASE_URL || "https://espobackend.vercel.app/api";
      const url = `${API_BASE_UNIFIED}/wishlist`;
      
      const res = await fetch(url, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ 
          customerAccountId: userId,
          productId: productId,
          itemType: 'cart',
          qty: quantity,
          price: price || '0.00',
          priceCurrency: priceCurrency
        }),
      });
      
      console.log('🛒 ADD TO CART Response status:', res.status);
      
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error('🛒 ADD TO CART Error:', txt);
        return rejectWithValue(`HTTP ${res.status}: ${txt || "Failed to add to cart"}`);
      }
      
      const json = await res.json();
      console.log('🛒 ADD TO CART Response:', json);
      
      if (!json?.success) return rejectWithValue(json?.message || "Add to cart failed");
      
      // Refetch cart to get updated data
      await dispatch(fetch_cart_products({ userId }));
      return true;
    } catch (e) {
      console.error('🛒 ADD TO CART Exception:', e);
      return rejectWithValue(e?.message || "Unknown error adding to cart");
    }
  }
);

export const update_cart_item = createAsyncThunk(
  "cart/update_cart_item",
  async ({ userId, productId, quantity }, { dispatch, rejectWithValue }) => {
    try {
      if (!userId || !productId || typeof quantity !== "number") {
        return rejectWithValue("Missing userId/productId/quantity");
      }
      const res = await fetch(`${API_BASE}/api/cart/update/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, quantity }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        return rejectWithValue(`HTTP ${res.status}: ${txt || "Failed to update item"}`);
      }
      const json = await res.json();
      if (!json?.success) return rejectWithValue(json?.message || "Update item failed");
      await dispatch(fetch_cart_products({ userId }));
      return true;
    } catch (e) {
      return rejectWithValue(e?.message || "Unknown error updating item");
    }
  }
);

export const remove_from_cart = createAsyncThunk(
  "cart/remove_from_cart",
  async ({ userId, productId }, { dispatch, rejectWithValue }) => {
    try {
      if (!userId || !productId) return rejectWithValue("Missing userId/productId");
      const res = await fetch(`${API_BASE}/api/cart/remove/${productId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        return rejectWithValue(`HTTP ${res.status}: ${txt || "Failed to remove item"}`);
      }
      const json = await res.json();
      if (!json?.success) return rejectWithValue(json?.message || "Remove item failed");
      await dispatch(fetch_cart_products({ userId }));
      return true;
    } catch (e) {
      return rejectWithValue(e?.message || "Unknown error removing item");
    }
  }
);

export const clear_cart_api = createAsyncThunk(
  "cart/clear_cart_api",
  async ({ userId }, { dispatch, rejectWithValue }) => {
    try {
      if (!userId) return rejectWithValue("Missing userId");
      const res = await fetch(`${API_BASE}/api/cart/clear`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        return rejectWithValue(`HTTP ${res.status}: ${txt || "Failed to clear cart"}`);
      }
      const json = await res.json();
      if (!json?.success) return rejectWithValue(json?.message || "Clear cart failed");
      await dispatch(fetch_cart_products({ userId }));
      return true;
    } catch (e) {
      return rejectWithValue(e?.message || "Unknown error clearing cart");
    }
  }
);

/* ---------------- state ---------------- */
const initialState = {
  cart_products: [],
  orderQuantity: 1,
  cartMiniOpen: false,
  distinctCount: 0,
  loading: false,
  error: null,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    increment(state) { state.orderQuantity = (state.orderQuantity || 1) + 1; },
    decrement(state) { state.orderQuantity = state.orderQuantity > 1 ? state.orderQuantity - 1 : 1; },
    initialOrderQuantity(state) { state.orderQuantity = 1; },

    openCartMini(state) { state.cartMiniOpen = true; },
    closeCartMini(state) { state.cartMiniOpen = false; },

    // legacy no-ops (compat)
    get_cart_products() {},
    add_cart_product() {},
    quantityDecrement() {},
    remove_product() {},
    clearCart() {},
  },

  extraReducers: (builder) => {
    // Classic thunk pipeline
    builder
      .addCase(fetch_cart_products.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(fetch_cart_products.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.cart_products = Array.isArray(payload) ? payload : [];
        state.distinctCount = computeDistinctCount(state.cart_products);
      })
      .addCase(fetch_cart_products.rejected, (state, { payload, error }) => {
        state.loading = false;
        state.error = (typeof payload === "string" && payload) || error?.message || "Failed to load cart";
      });

    // Other thunks errors
    builder
      .addCase(add_to_cart.rejected, (state, { payload, error }) => {
        state.error = (typeof payload === "string" && payload) || error?.message || "Failed to add to cart";
      })
      .addCase(update_cart_item.rejected, (state, { payload, error }) => {
        state.error = (typeof payload === "string" && payload) || error?.message || "Failed to update cart item";
      })
      .addCase(remove_from_cart.rejected, (state, { payload, error }) => {
        state.error = (typeof payload === "string" && payload) || error?.message || "Failed to remove cart item";
      })
      .addCase(clear_cart_api.rejected, (state, { payload, error }) => {
        state.error = (typeof payload === "string" && payload) || error?.message || "Failed to clear cart";
      });

    // ✅ Mirror RTK Query getCartData into this slice too
    builder.addMatcher(
      isAnyOf(cartApi.endpoints.getCartData.matchFulfilled),
      (state, { payload }) => {
        // payload shape may be { success, data: { items: [...] , cartTotal }, ... }
        const items =
          (payload?.data && Array.isArray(payload.data.items) && payload.data.items) ||
          (Array.isArray(payload?.items) && payload.items) ||
          [];
        const normalized = normalizeItems(items);
        state.cart_products = normalized;
        state.distinctCount = computeDistinctCount(normalized);
        state.loading = false;
        state.error = null;
      }
    );
  },
});

/* -------- actions -------- */
export const {
  increment, decrement, initialOrderQuantity,
  openCartMini, closeCartMini,
  get_cart_products, add_cart_product, quantityDecrement, remove_product, clearCart,
} = cartSlice.actions;

/* -------- selectors -------- */
export const selectCartDistinctCount = (state) =>
  state.cart?.distinctCount ?? computeDistinctCount(state.cart?.cart_products || []);
export const selectCartLoading = (state) => state.cart?.loading || false;
export const selectCartError = (state) => state.cart?.error || null;

export default cartSlice.reducer;
