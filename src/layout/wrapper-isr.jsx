'use client';

import { Provider } from 'react-redux';
import store from '@/redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

if (typeof window !== 'undefined') {
  require('bootstrap/dist/js/bootstrap');
}

import BackToTopCom from '@/components/common/back-to-top';
import FloatingChatbot from '@/components/chatbot/FloatingChatbot';

// ISR Wrapper - Wraps everything with Redux Provider for components that need it
// Used for public pages that need ISR (home, products, blogs)
const WrapperISR = ({ children }) => {
  return (
    <Provider store={store}>
      <div id="wrapper">
        {children}
        <BackToTopCom />
        <ToastContainer position="bottom-center" autoClose={3000} />
        <FloatingChatbot />
      </div>
    </Provider>
  );
};

export default WrapperISR;
