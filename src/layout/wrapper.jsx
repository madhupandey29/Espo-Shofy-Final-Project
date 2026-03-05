'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import 'react-toastify/dist/ReactToastify.css';

// Lazy load Bootstrap JS only when needed
if (typeof window !== 'undefined') {
  import('bootstrap/dist/js/bootstrap');
}

// Lazy load heavy components for better initial load
const BackToTopCom = dynamic(() => import('@/components/common/back-to-top'), {
  ssr: false,
});

const ProductModal = dynamic(() => import('@/components/common/product-modal'), {
  ssr: false,
});

const FloatingButtons = dynamic(() => import('@/components/common/FloatingButtons'), {
  ssr: false,
});

const ToastContainer = dynamic(
  () => import('react-toastify').then((mod) => mod.ToastContainer),
  { ssr: false }
);

import { get_cart_products, initialOrderQuantity } from '@/redux/features/cartSlice';
import { get_compare_products } from '@/redux/features/compareSlice';
import useAuthCheck from '@/hooks/use-auth-check';
import useWishlistManager from '@/hooks/useWishlistManager';
import Loader from '@/components/loader/loader';

const Wrapper = ({ children }) => {
  const { productItem } = useSelector((state) => state.productModal);
  const dispatch = useDispatch();
  const authChecked = useAuthCheck();
  
  // Use the wishlist manager hook to handle user switching
  useWishlistManager();

  useEffect(() => {
    // cart & compare can still hydrate from their own sources
    dispatch(get_cart_products());
    dispatch(get_compare_products());
    dispatch(initialOrderQuantity());
  }, [dispatch]);

  if (!authChecked) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
        <Loader spinner="fade" loading />
      </div>
    );
  }

  return (
    <div id="wrapper">
      {children}
      <BackToTopCom />
      <FloatingButtons />
      <ToastContainer position="bottom-center" autoClose={3000} />
      {productItem && <ProductModal />}
    </div>
  );
};

export default Wrapper;
