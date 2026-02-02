'use client';
import React, { useState } from 'react';

const ContactMap = () => {
  const [mapError, setMapError] = useState(false);
  
  const gmapSrc =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.7267!2d72.5198!3d23.0225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAxJzIxLjAiTiA3MsKwMzEnMTEuMyJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin';

  const directionsLink =
    'https://www.google.com/maps/dir/?api=1&destination=4TH+FLOOR,+Safal+Prelude,+404,+Corporate+Rd,+near+YMCA+CLUB,+Prahlad+Nagar,+Ahmedabad,+Gujarat+380015';

  const viewLink =
    'https://www.google.com/maps/place/4TH+FLOOR,+Safal+Prelude,+404,+Corporate+Rd,+near+YMCA+CLUB,+Prahlad+Nagar,+Ahmedabad,+Gujarat+380015';

  const handleMapError = () => {
    setMapError(true);
  };

  return (
    <section className="map-block">
      <div className="wrap">
        {/* Map */}
        <div className="frame" role="region" aria-label="Office location on Google Maps">
          {!mapError ? (
            <iframe
              src={gmapSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="Amrita Global – Safal Prelude"
              onError={handleMapError}
            />
          ) : (
            <div className="map-fallback">
              <div className="fallback-content">
                <h4>Map Temporarily Unavailable</h4>
                <p>We're experiencing technical difficulties with the map display.</p>
                <div className="fallback-links">
                  <a href={viewLink} target="_blank" rel="noopener noreferrer" className="fallback-btn">
                    View on Google Maps
                  </a>
                  <a href={directionsLink} target="_blank" rel="noopener noreferrer" className="fallback-btn">
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info-window style card */}
        <aside className="info-window" aria-label="Office address">
          <h4 className="iw-title">Amrita Global Enterprises</h4>
          <p className="iw-address">
            404, 4th Floor, Safal Prelude,<br />
            Behind YMCA Club, Corporate Road,<br />
            Prahlad Nagar, Ahmedabad, Gujarat 380015
          </p>

          <div className="iw-links">
            <a href={directionsLink} target="_blank" rel="noopener noreferrer" className="iw-link">
              Directions
            </a>
            <a href={viewLink} target="_blank" rel="noopener noreferrer" className="iw-link">
              View larger map
            </a>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .map-block {
          padding: 24px 0 80px;
          background: #f7f9fc; /* light page bg so it contrasts with the footer */
        }
        .wrap {
          max-width: 1160px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
        }
        .frame {
          height: 420px;
          border-radius: 12px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 10px 30px rgba(15, 34, 53, 0.12);
        }

        /* Map fallback styles */
        .map-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border: 2px dashed #cbd5e1;
        }
        
        .fallback-content {
          text-align: center;
          padding: 40px 20px;
        }
        
        .fallback-content h4 {
          color: #475569;
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 8px;
        }
        
        .fallback-content p {
          color: #64748b;
          font-size: 14px;
          margin: 0 0 20px;
        }
        
        .fallback-links {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .fallback-btn {
          background: #2C4C97;
          color: white;
          padding: 10px 16px;
          border-radius: 6px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .fallback-btn:hover {
          background: #1f3f80;
          transform: translateY(-1px);
        }

        /* --- Info window (Google style) --- */
        .info-window {
          position: absolute;
          top: 24px;
          left: 40px;
          width: 320px;
          background: #fff;
          border: 1px solid rgba(0, 0, 0, 0.2);
          border-radius: 6px;
          box-shadow:
            0 2px 6px rgba(0, 0, 0, 0.15),
            0 1px 0 rgba(255, 255, 255, 0.6) inset;
          padding: 10px 12px;
          color: #202124; /* google-ish neutral */
          font-family: Roboto, Arial, sans-serif;
        }
        .iw-title {
          margin: 0 0 6px;
          font-size: 15px;
          font-weight: 700;
          color: #202124;
          line-height: 1.2;
        }
        .iw-address {
          margin: 0 0 10px;
          font-size: 13px;
          line-height: 1.45;
          color: #5f6368; /* grey text like maps */
        }
        .iw-links {
          display: flex;
          gap: 14px;
          align-items: center;
          flex-wrap: wrap;
        }
        .iw-link {
          font-size: 13px;
          color: #1a73e8; /* google blue */
          text-decoration: none;
        }
        .iw-link:hover {
          text-decoration: underline;
        }

        /* responsive */
        @media (max-width: 768px) {
          .frame { height: 360px; }
          .info-window {
            top: 16px;
            left: 16px;
            width: calc(100% - 32px);
          }
          .fallback-links {
            flex-direction: column;
            align-items: center;
          }
        }
        @media (max-width: 480px) {
          .frame { height: 320px; }
          .info-window {
            position: relative;
            top: auto; left: auto;
            width: 100%;
            margin-top: 12px;
          }
        }
      `}</style>
    </section>
  );
};

export default ContactMap;
