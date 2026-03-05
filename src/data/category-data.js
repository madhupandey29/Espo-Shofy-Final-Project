// Category data for the homepage showcase
// You can customize these categories based on your fabric collections

export const categoryData = [
  {
    id: 1,
    name: "Ethnic Wear",
    discount: "50-80% OFF",
    image: "/assets/img/category/ethnic-wear.jpg",
    link: "/fabric?category=ethnic",
    bgColor: "#8B5CF6", // Purple
    description: "Traditional and ethnic fabric collections"
  },
  {
    id: 2,
    name: "Casual Wear",
    discount: "40-80% OFF",
    image: "/assets/img/category/casual-wear.jpg",
    link: "/fabric?category=casual",
    bgColor: "#F59E0B", // Amber
    description: "Comfortable everyday fabrics"
  },
  {
    id: 3,
    name: "Men's Activewear",
    discount: "30-70% OFF",
    image: "/assets/img/category/mens-activewear.jpg",
    link: "/fabric?category=mens-active",
    bgColor: "#3B82F6", // Blue
    description: "Performance fabrics for men"
  },
  {
    id: 4,
    name: "Women's Activewear",
    discount: "30-70% OFF",
    image: "/assets/img/category/womens-activewear.jpg",
    link: "/fabric?category=womens-active",
    bgColor: "#10B981", // Green
    description: "Athletic fabrics for women"
  },
  {
    id: 5,
    name: "Western Wear",
    discount: "40-80% OFF",
    image: "/assets/img/category/western-wear.jpg",
    link: "/fabric?category=western",
    bgColor: "#EC4899", // Pink
    description: "Modern western style fabrics"
  },
  {
    id: 6,
    name: "Sportswear",
    discount: "30-80% OFF",
    image: "/assets/img/category/sportswear.jpg",
    link: "/fabric?category=sports",
    bgColor: "#6366F1", // Indigo
    description: "High-performance sports fabrics"
  },
];

// Alternative: If you want to fetch categories from API
export const fetchCategories = async () => {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7000/landing';
    const response = await fetch(`${API_BASE}/category/view`);
    
    if (!response.ok) {
      return categoryData; // Fallback to static data
    }
    
    const data = await response.json();
    
    // Transform API data to match our format
    if (data?.data && Array.isArray(data.data)) {
      return data.data.map((cat, index) => ({
        id: cat.id || cat._id || index + 1,
        name: cat.name,
        discount: cat.discount || "30-70% OFF",
        image: cat.image || `/assets/img/category/default-${index + 1}.jpg`,
        link: `/fabric?category=${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`,
        bgColor: cat.color || categoryData[index % categoryData.length].bgColor,
        description: cat.description || ""
      }));
    }
    
    return categoryData;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return categoryData; // Fallback to static data
  }
};
