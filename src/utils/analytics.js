/**
 * Centralized Analytics Utility
 * Tracks events to Google Analytics (GA4) and Microsoft Clarity
 */

// Check if analytics scripts are loaded
const isGALoaded = () => typeof window !== 'undefined' && typeof window.gtag === 'function';
const isClarityLoaded = () => typeof window !== 'undefined' && typeof window.clarity === 'function';

/**
 * Track custom events to GA4 and Clarity
 * @param {string} eventName - Name of the event
 * @param {object} eventParams - Additional parameters for the event
 */
export const trackEvent = (eventName, eventParams = {}) => {
  if (typeof window === 'undefined') return;

  // Send to Google Analytics
  if (isGALoaded()) {
    window.gtag('event', eventName, eventParams);
  }

  // Send to Microsoft Clarity
  if (isClarityLoaded()) {
    window.clarity('event', eventName);
  }

  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics Event:', eventName, eventParams);
  }
};

/**
 * Track page views
 * @param {string} url - Page URL
 * @param {string} title - Page title
 */
export const trackPageView = (url, title) => {
  if (typeof window === 'undefined') return;

  if (isGALoaded()) {
    window.gtag('event', 'page_view', {
      page_path: url,
      page_title: title,
    });
  }

  if (isClarityLoaded()) {
    window.clarity('set', 'page', url);
  }
};

/**
 * Track user login
 * @param {string} method - Login method (email, google, etc.)
 * @param {string} userId - User ID (optional)
 */
export const trackLogin = (method = 'email', userId = null) => {
  const params = { method };
  if (userId) params.user_id = userId;

  trackEvent('login', params);

  // Set user ID in GA4
  if (userId && isGALoaded()) {
    window.gtag('set', 'user_properties', { user_id: userId });
  }

  // Set user ID in Clarity
  if (userId && isClarityLoaded()) {
    window.clarity('identify', userId);
  }
};

/**
 * Track user registration
 * @param {string} method - Registration method
 */
export const trackSignup = (method = 'email') => {
  trackEvent('sign_up', { method });
};

/**
 * Track user logout
 */
export const trackLogout = () => {
  trackEvent('logout');
};

/**
 * Track file downloads
 * @param {string} fileName - Name of the downloaded file
 * @param {string} fileType - Type of file (pdf, image, etc.)
 * @param {string} productId - Product ID (if applicable)
 */
export const trackDownload = (fileName, fileType = 'pdf', productId = null) => {
  const params = {
    file_name: fileName,
    file_type: fileType,
  };
  if (productId) params.product_id = productId;

  trackEvent('file_download', params);
};

/**
 * Track scroll depth
 * @param {number} percentage - Scroll percentage (25, 50, 75, 100)
 */
export const trackScrollDepth = (percentage) => {
  trackEvent('scroll', {
    percent_scrolled: percentage,
  });
};

/**
 * Track product views
 * @param {object} product - Product object
 */
export const trackProductView = (product) => {
  if (!product) return;

  trackEvent('view_item', {
    currency: 'INR',
    value: product.price || 0,
    items: [{
      item_id: product._id || product.id,
      item_name: product.title || product.name,
      item_category: product.category?.name || product.categoryName,
      price: product.price || 0,
    }],
  });
};

/**
 * Track add to cart
 * @param {object} product - Product object
 * @param {number} quantity - Quantity added
 */
export const trackAddToCart = (product, quantity = 1) => {
  if (!product) return;

  trackEvent('add_to_cart', {
    currency: 'INR',
    value: (product.price || 0) * quantity,
    items: [{
      item_id: product._id || product.id,
      item_name: product.title || product.name,
      item_category: product.category?.name || product.categoryName,
      price: product.price || 0,
      quantity: quantity,
    }],
  });
};

/**
 * Track remove from cart
 * @param {object} product - Product object
 */
export const trackRemoveFromCart = (product) => {
  if (!product) return;

  trackEvent('remove_from_cart', {
    currency: 'INR',
    value: product.price || 0,
    items: [{
      item_id: product._id || product.id,
      item_name: product.title || product.name,
      price: product.price || 0,
    }],
  });
};

/**
 * Track add to wishlist
 * @param {object} product - Product object
 */
export const trackAddToWishlist = (product) => {
  if (!product) return;

  trackEvent('add_to_wishlist', {
    currency: 'INR',
    value: product.price || 0,
    items: [{
      item_id: product._id || product.id,
      item_name: product.title || product.name,
      price: product.price || 0,
    }],
  });
};

/**
 * Track search
 * @param {string} searchTerm - Search query
 */
export const trackSearch = (searchTerm) => {
  trackEvent('search', {
    search_term: searchTerm,
  });
};

/**
 * Track checkout initiation
 * @param {array} items - Cart items
 * @param {number} value - Total cart value
 */
export const trackBeginCheckout = (items, value) => {
  trackEvent('begin_checkout', {
    currency: 'INR',
    value: value,
    items: items.map(item => ({
      item_id: item._id || item.id,
      item_name: item.title || item.name,
      price: item.price || 0,
      quantity: item.orderQuantity || item.quantity || 1,
    })),
  });
};

/**
 * Track purchase completion
 * @param {string} orderId - Order ID
 * @param {number} value - Order total
 * @param {array} items - Order items
 */
export const trackPurchase = (orderId, value, items) => {
  trackEvent('purchase', {
    transaction_id: orderId,
    currency: 'INR',
    value: value,
    items: items.map(item => ({
      item_id: item._id || item.id,
      item_name: item.title || item.name,
      price: item.price || 0,
      quantity: item.orderQuantity || item.quantity || 1,
    })),
  });
};

/**
 * Track button clicks
 * @param {string} buttonName - Name/label of the button
 * @param {string} location - Where the button is located
 */
export const trackButtonClick = (buttonName, location = '') => {
  trackEvent('button_click', {
    button_name: buttonName,
    location: location,
  });
};

/**
 * Track form submissions
 * @param {string} formName - Name of the form
 */
export const trackFormSubmit = (formName) => {
  trackEvent('form_submit', {
    form_name: formName,
  });
};

/**
 * Track video plays
 * @param {string} videoTitle - Video title
 */
export const trackVideoPlay = (videoTitle) => {
  trackEvent('video_play', {
    video_title: videoTitle,
  });
};

/**
 * Track errors
 * @param {string} errorMessage - Error message
 * @param {string} errorLocation - Where the error occurred
 */
export const trackError = (errorMessage, errorLocation = '') => {
  trackEvent('error', {
    error_message: errorMessage,
    error_location: errorLocation,
  });
};

/**
 * Track custom user actions
 * @param {string} actionName - Name of the action
 * @param {object} actionData - Additional data
 */
export const trackCustomAction = (actionName, actionData = {}) => {
  trackEvent(actionName, actionData);
};
