'use client';

import { useEffect } from 'react';

export default function AdvancedProtection() {
  useEffect(() => {
    // 🔓 COMPLETELY DISABLED - No security
    console.log('🔓 Advanced protection COMPLETELY DISABLED');
    return; // Exit immediately, no protections applied
  }, []);

  return null;
}

    // Obfuscate console
    const obfuscateConsole = () => {
      // Override console methods
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;
      
      console.log = () => {};
      console.error = () => {};
      console.warn = () => {};
      console.info = () => {};
      console.debug = () => {};
      console.trace = () => {};
      console.clear = () => {};
      
      // Show security message instead
      setTimeout(() => {
        originalLog('%c🔒 eCatalogue Security System Active', 'color: #ff6b6b; font-size: 20px; font-weight: bold;');
        originalLog('%cUnauthorized inspection attempts are logged and monitored.', 'color: #ffa500; font-size: 14px;');
      }, 1000);
    };

    // Detect debugging attempts
    const detectDebugging = () => {
      let devtools = false;
      
      // Method 1: Console detection
      const element = new Image();
      Object.defineProperty(element, 'id', {
        get: function() {
          devtools = true;
          handleDevToolsDetection();
        }
      });
      
      // Method 2: Timing-based detection
      const start = performance.now();
      debugger; // This will pause if dev tools are open
      const end = performance.now();
      
      if (end - start > 100) {
        handleDevToolsDetection();
      }
      
      // Method 3: Window size detection
      const threshold = 160;
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        handleDevToolsDetection();
      }
    };

    // Handle dev tools detection
    const handleDevToolsDetection = () => {
      // Log the attempt (in a real app, you'd send this to your server)
      console.warn('Security Alert: Developer tools access attempt detected');
      
      // Show warning
      showSecurityAlert();
      
      // Optionally blur the page
      document.body.style.filter = 'blur(5px)';
      
      // Remove blur after warning is dismissed
      setTimeout(() => {
        document.body.style.filter = 'none';
      }, 5000);
    };

    // Show security alert
    const showSecurityAlert = () => {
      const alertDiv = document.createElement('div');
      alertDiv.id = 'security-alert';
      alertDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        z-index: 999999;
        text-align: center;
        font-family: Arial, sans-serif;
        max-width: 400px;
        animation: slideIn 0.5s ease-out;
      `;
      
      alertDiv.innerHTML = `
        <style>
          @keyframes slideIn {
            from { opacity: 0; transform: translate(-50%, -60%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
          }
        </style>
        <div>
          <h2 style="margin: 0 0 15px 0; font-size: 24px;">🛡️ Security Alert</h2>
          <p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.5;">
            Unauthorized inspection detected on eCatalogue fabric store.
          </p>
          <p style="margin: 0 0 20px 0; font-size: 14px; opacity: 0.9;">
            This activity has been logged for security purposes.
          </p>
          <button onclick="this.parentElement.parentElement.remove(); document.body.style.filter='none';" 
                  style="background: rgba(255,255,255,0.2); color: white; border: 2px solid white; padding: 10px 20px; border-radius: 25px; cursor: pointer; font-size: 14px; transition: all 0.3s;">
            Continue to Store
          </button>
        </div>
      `;
      
      // Remove existing alerts
      const existing = document.getElementById('security-alert');
      if (existing) existing.remove();
      
      document.body.appendChild(alertDiv);
    };

    // Disable common inspection methods
    const disableInspectionMethods = () => {
      // Disable F12 and other shortcuts
      document.addEventListener('keydown', (e) => {
        const forbiddenKeys = [
          123, // F12
          116, // F5 (refresh)
        ];
        
        const forbiddenCombos = [
          { ctrl: true, shift: true, key: 73 }, // Ctrl+Shift+I
          { ctrl: true, shift: true, key: 67 }, // Ctrl+Shift+C
          { ctrl: true, shift: true, key: 74 }, // Ctrl+Shift+J
          { ctrl: true, key: 85 }, // Ctrl+U
          { ctrl: true, key: 83 }, // Ctrl+S
        ];
        
        if (forbiddenKeys.includes(e.keyCode)) {
          e.preventDefault();
          showSecurityAlert();
          return false;
        }
        
        forbiddenCombos.forEach(combo => {
          if (
            (!combo.ctrl || e.ctrlKey) &&
            (!combo.shift || e.shiftKey) &&
            (!combo.alt || e.altKey) &&
            e.keyCode === combo.key
          ) {
            e.preventDefault();
            showSecurityAlert();
          }
        });
      });
      
      // Disable right-click
      document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showSecurityAlert();
        return false;
      });
      
      // Disable text selection
      document.addEventListener('selectstart', (e) => {
        e.preventDefault();
        return false;
      });
      
      // Disable drag and drop
      document.addEventListener('dragstart', (e) => {
        e.preventDefault();
        return false;
      });
    };

    // Protect images specifically (for fabric product photos)
    const protectImages = () => {
      const protectImg = (img) => {
        img.style.pointerEvents = 'none';
        img.draggable = false;
        img.oncontextmenu = () => false;
        img.onselectstart = () => false;
        img.ondragstart = () => false;
        
        // Add invisible overlay to prevent right-click
        const overlay = document.createElement('div');
        overlay.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: auto;
        `;
        
        overlay.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          showSecurityAlert();
        });
        
        if (img.parentNode && img.parentNode.style) {
          img.parentNode.style.position = 'relative';
          img.parentNode.appendChild(overlay);
        }
      };
      
      // Protect existing images
      document.querySelectorAll('img').forEach(protectImg);
      
      // Protect new images as they're added
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              if (node.tagName === 'IMG') {
                protectImg(node);
              }
              node.querySelectorAll && node.querySelectorAll('img').forEach(protectImg);
            }
          });
        });
      });
      
      observer.observe(document.body, { childList: true, subtree: true });
      
      return () => observer.disconnect();
    };

    // Initialize all protections
    obfuscateConsole();
    disableInspectionMethods();
    const cleanupImages = protectImages();
    
    // Periodic dev tools detection
    const detectionInterval = setInterval(detectDebugging, 1000);
    
    // Cleanup
    return () => {
      clearInterval(detectionInterval);
      cleanupImages && cleanupImages();
    };
  }, []);

  return null;
}