import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import AuthorProfile from "@/components/author/AuthorProfile";
import { generateMetadata as generateSEOMetadata } from "@/utils/seo";

/* ---------------------------------------------
   Metadata (Static SEO)
---------------------------------------------- */
export async function generateMetadata() {
  return generateSEOMetadata({
    title: "About Us - Premium Fabric Manufacturers | eCatalogue",
    description: "Learn about our journey in premium textile manufacturing. Meet our founder and discover our commitment to quality fabrics and sustainable design.",
    keywords: "about us, fabric manufacturer, textile company, premium fabrics, sustainable design, fabric sourcing",
    path: "/about",
    ogImage: "/assets/img/logo/logo.svg",
    robots: "index, follow"
  });
}

export default function AboutPage() {
  return (
    <Wrapper>
      <HeaderTwo style_2 />

      {/* SEO-Optimized H1 */}
      <h1
        style={{
          position: "absolute",
          left: "-9999px",
          top: "auto",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        About eCatalogue - Premium Fabric Manufacturers & Textile Experts
      </h1>

      <main className="about-page">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <h2 className="about-title">About eCatalogue</h2>
                <p className="about-subtitle">
                  Leading the future of premium textile manufacturing with innovation, 
                  quality, and sustainable design practices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Author Profile Section */}
        <section className="author-section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <AuthorProfile />
              </div>
            </div>
          </div>
        </section>

        {/* Company Values Section */}
        <section className="values-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <h3 className="values-title">Our Values</h3>
                <div className="row">
                  <div className="col-md-4">
                    <div className="value-card">
                      <div className="value-icon">🏆</div>
                      <h4>Quality Excellence</h4>
                      <p>Committed to delivering premium fabrics that meet the highest industry standards.</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="value-card">
                      <div className="value-icon">🌱</div>
                      <h4>Sustainability</h4>
                      <p>Pioneering eco-friendly manufacturing processes for a better tomorrow.</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="value-card">
                      <div className="value-icon">🤝</div>
                      <h4>Trust & Innovation</h4>
                      <p>Building lasting partnerships through innovative solutions and reliable service.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer primary_style />

      <style jsx>{`
        .about-page {
          padding: 60px 0;
        }

        .about-hero {
          padding: 80px 0;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          margin-bottom: 80px;
        }

        .about-title {
          font-size: 48px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 20px;
          line-height: 1.2;
        }

        .about-subtitle {
          font-size: 20px;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
          max-width: 600px;
          margin: 0 auto;
        }

        .author-section {
          margin-bottom: 100px;
        }

        .values-section {
          padding: 80px 0;
          background: #ffffff;
        }

        .values-title {
          font-size: 36px;
          font-weight: 700;
          color: #1e293b;
          text-align: center;
          margin-bottom: 60px;
        }

        .value-card {
          text-align: center;
          padding: 40px 20px;
          border-radius: 16px;
          background: #ffffff;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #f1f5f9;
          height: 100%;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .value-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .value-icon {
          font-size: 48px;
          margin-bottom: 20px;
          display: block;
        }

        .value-card h4 {
          font-size: 24px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 16px;
        }

        .value-card p {
          font-size: 16px;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .about-hero {
            padding: 60px 0;
            margin-bottom: 60px;
          }

          .about-title {
            font-size: 32px;
          }

          .about-subtitle {
            font-size: 18px;
          }

          .values-section {
            padding: 60px 0;
          }

          .values-title {
            font-size: 28px;
            margin-bottom: 40px;
          }

          .value-card {
            margin-bottom: 30px;
            padding: 30px 20px;
          }

          .author-section {
            margin-bottom: 60px;
          }
        }

        @media (max-width: 480px) {
          .about-page {
            padding: 40px 0;
          }

          .about-hero {
            padding: 40px 0;
            margin-bottom: 40px;
          }

          .about-title {
            font-size: 24px;
          }

          .about-subtitle {
            font-size: 16px;
          }

          .values-title {
            font-size: 24px;
          }

          .value-card h4 {
            font-size: 20px;
          }

          .value-card p {
            font-size: 14px;
          }
        }
      `}</style>
    </Wrapper>
  );
}