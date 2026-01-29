'use client';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUserId } from '@/utils/userSelectors';
import { useGetCartDataQuery } from '@/redux/features/cartApi';

export const useCartDebug = () => {
  const userId = useSelector(selectUserId);
  const { cart_products: reduxCartProducts = [] } = useSelector((state) => state.cart);
  
  const { 
    data: cartData, 
    isLoading, 
    error 
  } = useGetCartDataQuery(userId, {
    skip: !userId,
  });

  useEffect(() => {
    }, [userId, isLoading, error, cartData, reduxCartProducts]);

  return {
    userId,
    apiData: cartData,
    reduxData: reduxCartProducts,
    isLoading,
    error
  };
};

