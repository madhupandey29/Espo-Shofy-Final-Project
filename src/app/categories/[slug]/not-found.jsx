import { Suspense } from 'react';
import Link from 'next/link';
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";

export default function CategoryNotFound() {
  return (
    <Wrapper>
      <Suspense fallback={<div style={{ height: '80px' }} />}>
        <HeaderTwo style_2 />
      </Suspense>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '800',
          color: '#2C4C97',
          marginBottom: '16px'
        }}>
          Category Not Found
        </h1>
        
        <p style={{
          fontSize: '18px',
          color: '#475569',
          marginBottom: '32px',
          maxWidth: '500px'
        }}>
          Sorry, we couldn't find the category you're looking for. It may have been removed or doesn't exist.
        </p>
        
        <Link 
          href="/fabric"
          style={{
            display: 'inline-block',
            padding: '12px 32px',
            background: '#2C4C97',
            color: '#ffffff',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
        >
          Browse All Fabrics
        </Link>
      </div>
      
      <Footer primary_style />
    </Wrapper>
  );
}
