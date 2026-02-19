'use client';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { selectUserId } from '@/utils/userSelectors';

const CheckoutArea = () => {
  const userId = useSelector(selectUserId);
  const router = useRouter();
  
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    notes: ''
  });

  // Fetch cart items
  useEffect(() => {
    if (!userId) return;
    
    const fetchCart = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://espobackend.vercel.app/api";
        const url = `${API_BASE}/wishlist/fieldname/customerAccountId/${encodeURIComponent(userId)}`;
        
        const res = await fetch(url, {
          method: "GET",
          credentials: "include",
          headers: { "Accept": "application/json" }
        });
        
        if (!res.ok) throw new Error('Failed to fetch cart');
        
        const json = await res.json();
        const allItems = Array.isArray(json?.data) ? json.data : [];
        const cartItems = allItems.filter(item => item.itemType === 'cart');
        
        setCartItems(cartItems);
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Failed to load cart items');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCart();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const qty = item.qty || 1;
      return sum + (price * qty);
    }, 0);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://espobackend.vercel.app/api";
      
      // Update all cart items to checkout status
      const updatePromises = cartItems.map(item => 
        fetch(`${API_BASE}/wishlist/${item.id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerAccountId: userId,
            productId: item.productId,
            itemType: 'checkout',
            qty: item.qty,
            price: item.price,
            priceCurrency: item.priceCurrency
          })
        })
      );
      
      await Promise.all(updatePromises);
      
      // Create order data
      const orderData = {
        customerAccountId: userId,
        items: cartItems.map(item => ({
          productId: item.productId,
          productName: item.productName,
          qty: item.qty,
          price: item.price,
          priceCurrency: item.priceCurrency
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        notes: formData.notes,
        total: calculateTotal(),
        status: 'pending'
      };
      
      // Store order data in sessionStorage for confirmation page
      sessionStorage.setItem('lastOrder', JSON.stringify(orderData));
      
      toast.success('Order placed successfully!');
      router.push('/order-confirmation');
      
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!userId) {
    return (
      <section className="checkout-area pb-120">
        <div className="container">
          <div className="text-center pt-50">
            <h3>Please sign in to checkout</h3>
            <button
              type="button"
              className="btn-ghost-invert square mt-20"
              onClick={() => router.push('/login')}
            >
              Go to Login
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="checkout-area pb-120 pt-80">
        <div className="container">
          <div className="text-center">
            <div className="spinner"></div>
            <p className="mt-3">Loading checkout...</p>
          </div>
        </div>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="checkout-area pb-120 pt-80">
        <div className="container">
          <div className="empty-cart-state">
            <h3>Your cart is empty</h3>
            <p>Add some items to your cart before checking out</p>
            <button
              type="button"
              onClick={() => router.push('/fabric')}
              className="btn-primary-modern mt-20"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </section>
    );
  }

  const total = calculateTotal();

  return (
    <>
      <section className="checkout-area pb-120 pt-80">
        <div className="container">
          <form onSubmit={handlePlaceOrder}>
            <div className="row">
              {/* Billing Details */}
              <div className="col-lg-7">
                <div className="checkout-billing-details">
                  <h3 className="checkout-title">Billing Details</h3>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="checkout-form-group">
                        <label>First Name <span className="required">*</span></label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="checkout-input"
                        />
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="checkout-form-group">
                        <label>Last Name <span className="required">*</span></label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="checkout-input"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="checkout-form-group">
                    <label>Company Name (Optional)</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="checkout-input"
                    />
                  </div>

                  <div className="checkout-form-group">
                    <label>Email Address <span className="required">*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="checkout-input"
                    />
                  </div>

                  <div className="checkout-form-group">
                    <label>Phone <span className="required">*</span></label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="checkout-input"
                    />
                  </div>

                  <div className="checkout-form-group">
                    <label>Street Address <span className="required">*</span></label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="checkout-input"
                      placeholder="House number and street name"
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="checkout-form-group">
                        <label>Town / City <span className="required">*</span></label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="checkout-input"
                        />
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="checkout-form-group">
                        <label>State / Province</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="checkout-input"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="checkout-form-group">
                        <label>Postcode / ZIP</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="checkout-input"
                        />
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="checkout-form-group">
                        <label>Country</label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="checkout-input"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="checkout-form-group">
                    <label>Order Notes (Optional)</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="checkout-textarea"
                      rows="4"
                      placeholder="Notes about your order, e.g. special notes for delivery"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="col-lg-5">
                <div className="checkout-order-summary">
                  <h3 className="checkout-title">Your Order</h3>
                  
                  <div className="order-summary-table">
                    <div className="order-summary-header">
                      <span>Product</span>
                      <span>Subtotal</span>
                    </div>
                    
                    {cartItems.map((item, index) => (
                      <div key={item.id || index} className="order-summary-item">
                        <div className="item-details">
                          <span className="item-name">{item.productName}</span>
                          <span className="item-qty">× {item.qty}</span>
                        </div>
                        <span className="item-price">
                          {item.priceCurrency} {(parseFloat(item.price) * item.qty).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    
                    <div className="order-summary-subtotal">
                      <span>Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    
                    <div className="order-summary-total">
                      <span>Total</span>
                      <span className="total-amount">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="payment-info">
                    <p className="payment-note">
                      <strong>Note:</strong> Payment will be processed offline. Our team will contact you for payment details.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="btn-place-order"
                    disabled={submitting}
                  >
                    {submitting ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      <style jsx>{`
        .checkout-area {
          background: var(--tp-grey-1);
          min-height: calc(100vh - 200px);
        }

        .checkout-billing-details,
        .checkout-order-summary {
          background: var(--tp-common-white);
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          margin-bottom: 24px;
        }

        .checkout-title {
          font-size: 24px;
          font-weight: 700;
          color: var(--tp-text-1);
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid var(--tp-grey-2);
        }

        .checkout-form-group {
          margin-bottom: 20px;
        }

        .checkout-form-group label {
          display: block;
          font-weight: 600;
          color: var(--tp-text-1);
          margin-bottom: 8px;
          font-size: 14px;
        }

        .required {
          color: #ef4444;
        }

        .checkout-input,
        .checkout-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid var(--tp-grey-3);
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .checkout-input:focus,
        .checkout-textarea:focus {
          outline: none;
          border-color: var(--tp-theme-primary);
          box-shadow: 0 0 0 3px rgba(44, 76, 151, 0.1);
        }

        .checkout-textarea {
          resize: vertical;
        }

        .order-summary-table {
          margin-bottom: 24px;
        }

        .order-summary-header {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 2px solid var(--tp-grey-2);
          font-weight: 600;
          color: var(--tp-text-1);
          font-size: 14px;
        }

        .order-summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid var(--tp-grey-2);
        }

        .item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .item-name {
          font-weight: 500;
          color: var(--tp-text-1);
          font-size: 14px;
        }

        .item-qty {
          font-size: 13px;
          color: var(--tp-text-2);
        }

        .item-price {
          font-weight: 600;
          color: var(--tp-text-1);
        }

        .order-summary-subtotal {
          display: flex;
          justify-content: space-between;
          padding: 16px 0;
          font-size: 15px;
          color: var(--tp-text-1);
        }

        .order-summary-total {
          display: flex;
          justify-content: space-between;
          padding: 20px 0;
          border-top: 2px solid var(--tp-grey-2);
          font-size: 18px;
          font-weight: 700;
          color: var(--tp-text-1);
        }

        .total-amount {
          color: var(--tp-theme-primary);
        }

        .payment-info {
          background: #fef3c7;
          border: 1px solid #fbbf24;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .payment-note {
          margin: 0;
          font-size: 14px;
          color: #92400e;
          line-height: 1.6;
        }

        .btn-place-order {
          width: 100%;
          background: var(--tp-theme-primary);
          color: var(--tp-common-white);
          border: none;
          border-radius: 8px;
          padding: 16px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-place-order:hover:not(:disabled) {
          background: color-mix(in srgb, var(--tp-theme-primary) 90%, black);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(44, 76, 151, 0.3);
        }

        .btn-place-order:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .empty-cart-state {
          text-align: center;
          padding: 60px 20px;
          background: var(--tp-common-white);
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .empty-cart-state h3 {
          font-size: 24px;
          font-weight: 700;
          color: var(--tp-text-1);
          margin-bottom: 12px;
        }

        .empty-cart-state p {
          color: var(--tp-text-2);
          margin-bottom: 24px;
        }

        .btn-primary-modern {
          background: var(--tp-theme-primary);
          color: var(--tp-common-white);
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary-modern:hover {
          background: color-mix(in srgb, var(--tp-theme-primary) 90%, black);
          transform: translateY(-1px);
        }

        .spinner {
          border: 3px solid var(--tp-grey-3);
          border-top: 3px solid var(--tp-theme-primary);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 991px) {
          .checkout-billing-details,
          .checkout-order-summary {
            padding: 24px;
          }

          .checkout-title {
            font-size: 20px;
          }
        }

        @media (max-width: 767px) {
          .checkout-billing-details,
          .checkout-order-summary {
            padding: 20px;
          }

          .checkout-title {
            font-size: 18px;
            margin-bottom: 20px;
          }

          .order-summary-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .item-price {
            align-self: flex-end;
          }
        }
      `}</style>
    </>
  );
};

export default CheckoutArea;
