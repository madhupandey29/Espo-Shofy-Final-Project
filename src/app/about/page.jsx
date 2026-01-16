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

      <main className="about-page" style={{ padding: '60px 0' }}>
        {/* Hero Section */}
        <section className="about-hero" style={{
          padding: '80px 0',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          marginBottom: '80px'
        }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <h2 className="about-title" style={{
                  fontSize: '48px',
                  fontWeight: 700,
                  color: '#1e293b',
                  marginBottom: '20px',
                  lineHeight: 1.2
                }}>About eCatalogue</h2>
                <p className="about-subtitle" style={{
                  fontSize: '20px',
                  color: '#64748b',
                  lineHeight: 1.6,
                  maxWidth: '600px',
                  margin: '0 auto'
                }}>
                  Leading the future of premium textile manufacturing with innovation, 
                  quality, and sustainable design practices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Author Profile Section */}
        <section className="author-section" style={{ marginBottom: '100px' }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <AuthorProfile />
              </div>
            </div>
          </div>
        </section>

        {/* Company Values Section */}
        <section className="values-section" style={{
          padding: '80px 0',
          background: '#ffffff'
        }}>
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <h3 className="values-title" style={{
                  fontSize: '36px',
                  fontWeight: 700,
                  color: '#1e293b',
                  textAlign: 'center',
                  marginBottom: '60px'
                }}>Our Values</h3>
                <div className="row">
                  <div className="col-md-4">
                    <div className="value-card" style={{
                      textAlign: 'center',
                      padding: '40px 20px',
                      borderRadius: '16px',
                      background: '#ffffff',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                      border: '1px solid #f1f5f9',
                      height: '100%'
                    }}>
                      <div className="value-icon" style={{
                        fontSize: '48px',
                        marginBottom: '20px'
                      }}>🏆</div>
                      <h4 style={{
                        fontSize: '24px',
                        fontWeight: 600,
                        color: '#1e293b',
                        marginBottom: '16px'
                      }}>Quality Excellence</h4>
                      <p style={{
                        fontSize: '16px',
                        color: '#64748b',
                        lineHeight: 1.6,
                        margin: 0
                      }}>Committed to delivering premium fabrics that meet the highest industry standards.</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="value-card" style={{
                      textAlign: 'center',
                      padding: '40px 20px',
                      borderRadius: '16px',
                      background: '#ffffff',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                      border: '1px solid #f1f5f9',
                      height: '100%'
                    }}>
                      <div className="value-icon" style={{
                        fontSize: '48px',
                        marginBottom: '20px'
                      }}>🌱</div>
                      <h4 style={{
                        fontSize: '24px',
                        fontWeight: 600,
                        color: '#1e293b',
                        marginBottom: '16px'
                      }}>Sustainability</h4>
                      <p style={{
                        fontSize: '16px',
                        color: '#64748b',
                        lineHeight: 1.6,
                        margin: 0
                      }}>Pioneering eco-friendly manufacturing processes for a better tomorrow.</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="value-card" style={{
                      textAlign: 'center',
                      padding: '40px 20px',
                      borderRadius: '16px',
                      background: '#ffffff',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                      border: '1px solid #f1f5f9',
                      height: '100%'
                    }}>
                      <div className="value-icon" style={{
                        fontSize: '48px',
                        marginBottom: '20px'
                      }}>🤝</div>
                      <h4 style={{
                        fontSize: '24px',
                        fontWeight: 600,
                        color: '#1e293b',
                        marginBottom: '16px'
                      }}>Trust & Innovation</h4>
                      <p style={{
                        fontSize: '16px',
                        color: '#64748b',
                        lineHeight: 1.6,
                        margin: 0
                      }}>Building lasting partnerships through innovative solutions and reliable service.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer primary_style />
    </Wrapper>
  );
}