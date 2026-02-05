import { apiSlice } from "../api/apiSlice";

export const topicPageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all topic pages
    getTopicPages: builder.query({
      query: () => ({
        url: "https://espobackend.vercel.app/api/topicpage",
        method: "GET",
      }),
      transformResponse: (response) => {
        // Transform the response to extract the data array
        if (response.success && Array.isArray(response.data)) {
          return response.data.filter(page => !page.deleted); // Filter out deleted pages
        }
        return [];
      },
      providesTags: ["TopicPage"],
      // Cache for 1 hour
      keepUnusedDataFor: 3600,
    }),

    // Get topic page by name
    getTopicPageByName: builder.query({
      query: (name) => ({
        url: "https://espobackend.vercel.app/api/topicpage",
        method: "GET",
      }),
      transformResponse: (response, meta, arg) => {
        if (response.success && Array.isArray(response.data)) {
          const pages = response.data.filter(page => !page.deleted);
          // Find page by name (case-insensitive)
          const page = pages.find(p => 
            p.name && p.name.toLowerCase() === arg.toLowerCase()
          );
          return page || null;
        }
        return null;
      },
      providesTags: (result, error, name) => [
        { type: "TopicPage", id: name }
      ],
      keepUnusedDataFor: 3600,
    }),

    // Get topic page by slug
    getTopicPageBySlug: builder.query({
      query: (slug) => ({
        url: "https://espobackend.vercel.app/api/topicpage",
        method: "GET",
      }),
      transformResponse: (response, meta, arg) => {
        if (response.success && Array.isArray(response.data)) {
          const pages = response.data.filter(page => !page.deleted);
          // Find page by slug
          const page = pages.find(p => p.slug === arg);
          return page || null;
        }
        return null;
      },
      providesTags: (result, error, slug) => [
        { type: "TopicPage", id: slug }
      ],
      keepUnusedDataFor: 3600,
    }),

    // Get home page topic data
    getHomePageTopic: builder.query({
      query: () => ({
        url: "https://espobackend.vercel.app/api/topicpage",
        method: "GET",
      }),
      transformResponse: (response) => {
        if (response.success && Array.isArray(response.data)) {
          const pages = response.data.filter(page => !page.deleted);
          // Find home page (case-insensitive)
          const homePage = pages.find(p => 
            p.name && p.name.toLowerCase() === 'home'
          );
          return homePage || null;
        }
        return null;
      },
      providesTags: [{ type: "TopicPage", id: "home" }],
      keepUnusedDataFor: 3600,
    }),

    // Get contact page topic data
    getContactPageTopic: builder.query({
      query: () => ({
        url: "https://espobackend.vercel.app/api/topicpage",
        method: "GET",
      }),
      transformResponse: (response) => {
        if (response.success && Array.isArray(response.data)) {
          const pages = response.data.filter(page => !page.deleted);
          // Find contact page (case-insensitive)
          const contactPage = pages.find(p => 
            p.name && p.name.toLowerCase() === 'contact'
          );
          return contactPage || null;
        }
        return null;
      },
      providesTags: [{ type: "TopicPage", id: "contact" }],
      keepUnusedDataFor: 3600,
    }),
  }),
});

export const {
  useGetTopicPagesQuery,
  useGetTopicPageByNameQuery,
  useGetTopicPageBySlugQuery,
  useGetHomePageTopicQuery,
  useGetContactPageTopicQuery,
} = topicPageApi;