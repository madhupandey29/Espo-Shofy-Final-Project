// app/test-search/page.jsx
import React from "react";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import TestSearchClient from "./test-search-client";

// Optional: prevents build-time static generation (helps avoid timeout issues)
export const dynamic = "force-dynamic";

export default function TestSearchPage() {
  return (
    <Wrapper>
      <HeaderTwo />
      <main>
        <div className="container" style={{ padding: "40px 0" }}>
          <div className="row">
            <div className="col-12">
              <h1>Test Search Functionality</h1>
              <p>
                Go to the <a href="/shop">Shop page</a> and try searching for
                "cotton" or any fabric-related term in the search bar.
              </p>

              <div style={{ marginTop: "20px" }}>
                <h3>Test the API directly:</h3>

                {/* ✅ Client component handles onClick */}
                <TestSearchClient />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </Wrapper>
  );
}
