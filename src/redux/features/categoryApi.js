import { apiSlice } from "../api/apiSlice";

export const categoryApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    // ──────────────── C R U D ────────────────
    addCategory: builder.mutation({
      query: body => ({
        url: "/category/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),

    /** ─ Get *all* categories  */
    getShowCategory: builder.query({
      query: () => "/category/",
      providesTags: ["Category"],
    }),

    /** ─ Get categories by product-type  */
    getProductTypeCategory: builder.query({
      query: type => `/category/show/${type}`,
      providesTags: (r, _e, type) => [{ type: "Category", id: type }],
    }),

    /** ───── NEW: get a *single* category by its id ───── */
    getCategoryById: builder.query({
      query: id => `/category/${id}`,
      providesTags: (r, _e, id) => [{ type: "Category", id }],
    }),

    /** ───── Get categories by field name (e.g., category field) ───── */
    getCategoriesByField: builder.query({
      query: (fieldName) => `/product/fieldname/${fieldName}`,
      providesTags: ["Category"],
      transformResponse: (res) => {
        // API returns: { success: true, entity: "CProduct", field: "category", values: [...], total: N }
        if (res?.success && res?.values) {
          return {
            success: res.success,
            categories: res.values,
            total: res.total,
            field: res.field,
          };
        }
        return { success: false, categories: [], total: 0 };
      },
    }),
  }),
});

export const {
  useAddCategoryMutation,
  useGetShowCategoryQuery,
  useGetProductTypeCategoryQuery,
  useGetCategoryByIdQuery,
  useGetCategoriesByFieldQuery,  // ← new hook for field-based categories
} = categoryApi;
