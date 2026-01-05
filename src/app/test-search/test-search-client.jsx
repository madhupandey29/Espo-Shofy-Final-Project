"use client";

import React from "react";

export default function TestSearchClient() {
  const handleTest = async () => {
    try {
      const response = await fetch(
        "https://espobackend.vercel.app/api/product/search/cotton"
      );
      const data = await response.json();
      console.log("Direct API Response:", data);
      alert(`Direct API call successful! Found ${data.total} results.`);
    } catch (error) {
      console.error("API Error:", error);
      alert("API call failed. Check console for details.");
    }
  };

  return (
    <button
      onClick={handleTest}
      style={{
        background: "var(--tp-theme-primary)",
        color: "white",
        border: "none",
        padding: "12px 24px",
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      Test Direct API Call
    </button>
  );
}
