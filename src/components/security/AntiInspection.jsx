'use client';

import { useEffect } from 'react';

export default function AntiInspection() {
  useEffect(() => {
    // 🔓 COMPLETELY DISABLED - No security on localhost
    console.log('🔓 Anti-inspection COMPLETELY DISABLED');
    return; // Exit immediately, no protections applied
  }, []);

  return null;
}

    // Disable right-click context menu
    const disableRightClick = (e) => {
      e.preventDefault();
      showWarning('Right-click is disabled for security reasons.');
      return false;
    };

    // Disable F12, Ctrl+Shift+I, Ctrl+U, and other dev tools shortcuts
    const disableDevTools = (e) => {
      // F12
      if (e.keyCode === 123) {
        e.preventDefault();
        showWarning('Developer tools are disabled.');
        return false;
      }
      
      // Ctrl+Shift+I (Inspector)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        showWarning('Inspector is disabled.');
        return false;
      }
      
      // Ctrl+Shift+C (Element selector)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault();
        showWarning('Element selector is disabled.');
        return false;
      }
      
      // Ctrl+U (View source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        showWarning('View source is disabled.');
        return false;
      }
      
      // Ctrl+S (Save page)
      if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        showWarning('Saving page is disabled.');
        return false;
      }
      
      // Ctrl+A (Select all)
      if (e.ctrlKey && e.keyCode === 65) {
        e.preventDefault();
        showWarning('Select all is disabled.');
        return false;
      }
      
      // Ctrl+P (Print)
      if (e.ctrlKey && e.keyCode === 80) {
        e.preventDefault();
        showWarning('Printing is disabled.');
        return false;
      }
    };

    // Disable text selection
    const disableSelection = () => {
      document.onselectstart = () => false;
      document.onmousedown = () => false;
    };

    // Detect developer tools opening
    const detectDevTools = () => {
      const threshold = 160;
      
      const checkDevTools = () => {
        if (
          window.outerHeight - window.innerHeight > threshold ||
          window.outerWidth - window.innerWidth > threshold
        ) {
          showWarning('Developer tools detected! Please close them.');
          // Optionally redirect or take other action
          // window.location.href = '/';
        }
      };
      
      setInterval(checkDevTools, 500);
    };

    // Disable drag and drop
    const disableDragDrop = (e) => {
      e.preventDefault();
      return false;
    };

    // Show warning message
    const showWarning = (message) => {
      // Create warning overlay
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: bold;
        z-index: 999999;
        text-align: center;
        padding: 20px;
      `;
      overlay.innerHTML = `
        <div>
          <h2>🔒 Security Notice</h2>
          <p>${message}</p>
          <p>This fabric e-commerce site is protected.</p>
          <button onclick="this.parentElement.parentElement.remove()" 
                  style="margin-top: 20px; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Continue Shopping
          </button>
        </div>
      `;
      
      document.body.appendChild(overlay);
      
      // Auto-remove after 3 seconds
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.remove();
        }
      }, 3000);
    };

    // Console warning
    const consoleWarning = () => {
      console.clear();
      console.log('%c🔒 STOP!', 'color: red; font-size: 50px; font-weight: bold;');
      console.log('%cThis is a browser feature intended for developers. If someone told you to copy-paste something here, it is a scam and will give them access to your account.', 'color: red; font-size: 16px;');
      console.log('%ceCatalogue Fabric Store - Unauthorized access is prohibited.', 'color: blue; font-size: 14px;');
    };

    // Disable image dragging
    const disableImageDrag = () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        img.draggable = false;
        img.oncontextmenu = () => false;
        img.onselectstart = () => false;
        img.ondragstart = () => false;
      });
    };

    // Apply all protections
    document.addEventListener('contextmenu', disableRightClick);
    document.addEventListener('keydown', disableDevTools);
    document.addEventListener('dragstart', disableDragDrop);
    document.addEventListener('drop', disableDragDrop);
    
    disableSelection();
    detectDevTools();
    consoleWarning();
    
    // Disable image dragging on load and when new images are added
    disableImageDrag();
    const observer = new MutationObserver(disableImageDrag);
    observer.observe(document.body, { childList: true, subtree: true });

    // Cleanup function
    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('keydown', disableDevTools);
      document.removeEventListener('dragstart', disableDragDrop);
      document.removeEventListener('drop', disableDragDrop);
      document.onselectstart = null;
      document.onmousedown = null;
      observer.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
}