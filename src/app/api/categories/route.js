import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

export async function GET() {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://espobackend.vercel.app/api';
    const url = `${API_BASE}/product/fieldname/category`;
    
    console.log('Fetching categories from:', url);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Categories API response:', data);
    
    // API returns { success: true, values: ["Denim Fabrics", "Woven Fabrics"] }
    const categoryNames = data?.values || [];
    
    // Static images for categories (you can customize these)
    const categoryImages = {
      'Denim Fabrics': '/assets/img/category/denim-fabrics.jpg',
      'Woven Fabrics': '/assets/img/category/woven-fabrics.jpg',
    };
    
    const transformedData = {
      success: true,
      data: categoryNames.map((name, index) => ({
        id: `cat-${index + 1}`,
        name: name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        image: categoryImages[name] || '/assets/img/category/default.jpg',
        description: `Explore our ${name} collection`
      }))
    };
    
    console.log('Transformed categories:', transformedData);
    
    return NextResponse.json(transformedData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    
    return NextResponse.json(
      { 
        success: false,
        data: [],
        error: 'Failed to fetch categories',
        message: error.message 
      },
      { status: 200 }
    );
  }
}
