'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const OrderConfirmationArea = () => {
  const router = useRouter();
  const [orderData, setOrderData] = useState(null);
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    // Get order data from sessionStorage
    const storedOrder = sessionStorage.getItem('lastOrder');
    
    if (storedOrder) {
      try {
        const order = JSON.parse(storedOrder);
        setOrderData(order);
        
        // Generate order number
        const orderNum = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        setOrderNumber(orderNum);
        
        // Clear the stored order
        sessionStorage.removeItem('lastOrder');
      } catch (error) {
        console.error('Error parsing order data:', error);
      }
    }
  }, []);

  if (!orderData) {
    return (
      <section className="order-confirmation-area pb-120 pt-80">
        <div className="container">
          <div className="no-order-state">
            <div className="icon-wrapper">
              <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h3>No Order Found</h3>
            <p>We couldn't find any order information. Please try placing an order first.</p>
            <Link href="/fabric" className="btn-primary-modern">
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const { shippingAddress, items, total } = orderData;

  return (
    <>
      <section className="order-confirmation-area pb-120 pt-80">
        <div className="container">
          <div className="order-confirmation-wrapper">
            {/* Success Header */}
            <div className="success-header">
              <div className="success-icon">
                <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h1 className="success-title">Thank You for Your Order!</h1>
              <p className="success-message">
                Your order has been received and is being processed. We'll contact you shortly with payment details.
              </p>
            </div>

            {/* Order Details */}
            <div className="order-details-card">
              <div className="order-number-section">
                <div className="order-number-label">Order Number</div>
                <div className="order-number-value">{orderNumber}</div>
              </div>

              <div className="order-info-grid">
                <div className="info-item">
                  <div className="info-label">Date</div>
                  <div className="info-value">{new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Total</div>
                  <div className="info-value">${total.toFixed(2)}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Payment Method</div>
                  <div className="info-value">Offline Payment</div>
                </div>
              </div>
            </div>

            <div className="row">
              {/* Order Items */}
              <div className="col-lg-8">
                <div className="order-items-card">
                  <h3 className="card-title">Order Items</h3>
                  
                  <div className="items-list">
                    {items.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-info">
                          <div className="item-name">{item.productName}</div>
                          <div className="item-meta">
                            Quantity: {item.qty} × {item.priceCurrency} {parseFloat(item.price).toFixed(2)}
                          </div>
                        </div>
                        <div className="item-total">
                          {item.priceCurrency} {(parseFloat(item.price) * item.qty).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-total-section">
                    <div className="total-row">
                      <span>Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="total-row grand-total">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="col-lg-4">
                <div className="shipping-address-card">
                  <h3 className="card-title">Shipping Address</h3>
                  
                  <div className="address-content">
                    <p className="address-name">
                      {shippingAddress.firstName} {shippingAddress.lastName}
                    </p>
                    {shippingAddress.company && (
                      <p className="address-company">{shippingAddress.company}</p>
                    )}
                    <p className="address-line">{shippingAddress.address}</p>
                    <p className="address-line">
                      {shippingAddress.city}
                      {shippingAddress.state && `, ${shippingAddress.state}`}
                      {shippingAddress.zipCode && ` ${shippingAddress.zipCode}`}
                    </p>
                    {shippingAddress.country && (
                      <p className="address-line">{shippingAddress.country}</p>
                    )}
                    <p className="address-contact">{shippingAddress.email}</p>
                    <p className="address-contact">{shippingAddress.phone}</p>
                  </div>
                </div>

                <div className="next-steps-card">
                  <h3 className="card-title">What's Next?</h3>
                  <ul className="steps-list">
                    <li>Our team will review your order</li>
                    <li>We'll contact you for payment details</li>
                    <li>Once payment is confirmed, we'll process your order</li>
                    <li>You'll receive shipping updates via email</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                type="button"
                onClick={() => router.push('/fabric')}
                className="btn-continue-shopping"
              >
                Continue Shopping
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="btn-print-order"
              >
                Print Order
              </button>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .order-confirmation-area {
          background: var(--tp-grey-1);
          min-height: calc(100vh - 200px);
        }

        .order-confirmation-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }

        .success-header {
          text-align: center;
          background: var(--tp-common-white);
          border-radius: 16px;
          padding: 48px 32px;
          margin-bottom: 32px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .success-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
          background: #dcfce7;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #16a34a;
        }

        .success-title {
          font-size: 32px;
          font-weight: 700;
          color: var(--tp-text-1);
          margin-bottom: 12px;
        }

        .success-message {
          font-size: 16px;
          color: var(--tp-text-2);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .order-details-card {
          background: var(--tp-common-white);
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 32px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .order-number-section {
          text-align: center;
          padding-bottom: 24px;
          margin-bottom: 24px;
          border-bottom: 2px solid var(--tp-grey-2);
        }

        .order-number-label {
          font-size: 14px;
          color: var(--tp-text-2);
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .order-number-value {
          font-size: 24px;
          font-weight: 700;
          color: var(--tp-theme-primary);
          font-family: monospace;
        }

        .order-info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .info-item {
          text-align: center;
        }

        .info-label {
          font-size: 13px;
          color: var(--tp-text-2);
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          font-size: 16px;
          font-weight: 600;
          color: var(--tp-text-1);
        }

        .order-items-card,
        .shipping-address-card,
        .next-steps-card {
          background: var(--tp-common-white);
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .card-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--tp-text-1);
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid var(--tp-grey-2);
        }

        .items-list {
          margin-bottom: 24px;
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 16px 0;
          border-bottom: 1px solid var(--tp-grey-2);
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .item-info {
          flex: 1;
        }

        .item-name {
          font-weight: 600;
          color: var(--tp-text-1);
          margin-bottom: 4px;
        }

        .item-meta {
          font-size: 14px;
          color: var(--tp-text-2);
        }

        .item-total {
          font-weight: 700;
          color: var(--tp-text-1);
          margin-left: 16px;
        }

        .order-total-section {
          padding-top: 16px;
          border-top: 2px solid var(--tp-grey-2);
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 15px;
          color: var(--tp-text-1);
        }

        .total-row.grand-total {
          font-size: 20px;
          font-weight: 700;
          padding-top: 16px;
          margin-top: 8px;
          border-top: 2px solid var(--tp-grey-2);
          color: var(--tp-theme-primary);
        }

        .address-content {
          line-height: 1.8;
        }

        .address-name {
          font-weight: 700;
          color: var(--tp-text-1);
          margin-bottom: 8px;
        }

        .address-company,
        .address-line,
        .address-contact {
          color: var(--tp-text-2);
          margin-bottom: 4px;
        }

        .address-contact {
          font-weight: 500;
        }

        .steps-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .steps-list li {
          padding: 12px 0 12px 32px;
          position: relative;
          color: var(--tp-text-2);
          line-height: 1.6;
        }

        .steps-list li:before {
          content: '✓';
          position: absolute;
          left: 0;
          top: 12px;
          width: 20px;
          height: 20px;
          background: var(--tp-theme-primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
        }

        .action-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-top: 32px;
        }

        .btn-continue-shopping,
        .btn-print-order {
          padding: 14px 32px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .btn-continue-shopping {
          background: var(--tp-theme-primary);
          color: var(--tp-common-white);
        }

        .btn-continue-shopping:hover {
          background: color-mix(in srgb, var(--tp-theme-primary) 90%, black);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(44, 76, 151, 0.3);
        }

        .btn-print-order {
          background: var(--tp-common-white);
          color: var(--tp-theme-primary);
          border: 2px solid var(--tp-theme-primary);
        }

        .btn-print-order:hover {
          background: var(--tp-grey-1);
        }

        .no-order-state {
          text-align: center;
          padding: 60px 20px;
          background: var(--tp-common-white);
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .icon-wrapper {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
          background: #fee2e2;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #dc2626;
        }

        .no-order-state h3 {
          font-size: 24px;
          font-weight: 700;
          color: var(--tp-text-1);
          margin-bottom: 12px;
        }

        .no-order-state p {
          color: var(--tp-text-2);
          margin-bottom: 24px;
        }

        .btn-primary-modern {
          display: inline-block;
          background: var(--tp-theme-primary);
          color: var(--tp-common-white);
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .btn-primary-modern:hover {
          background: color-mix(in srgb, var(--tp-theme-primary) 90%, black);
          transform: translateY(-1px);
        }

        @media print {
          .action-buttons {
            display: none;
          }
        }

        @media (max-width: 991px) {
          .order-info-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .success-header {
            padding: 32px 24px;
          }

          .success-title {
            font-size: 24px;
          }

          .order-details-card,
          .order-items-card,
          .shipping-address-card,
          .next-steps-card {
            padding: 24px;
          }
        }

        @media (max-width: 767px) {
          .action-buttons {
            flex-direction: column;
          }

          .btn-continue-shopping,
          .btn-print-order {
            width: 100%;
          }

          .order-item {
            flex-direction: column;
            gap: 8px;
          }

          .item-total {
            margin-left: 0;
            align-self: flex-end;
          }
        }
      `}</style>
    </>
  );
};

export default OrderConfirmationArea;
