"use client";

const CategoryHeroImage = ({ categoryName }) => {
  return (
    <div className="category-hero-fallback">
      <div className="fallback-pattern"></div>
      <div className="fallback-content">
        <div className="fallback-icon">🧵</div>
        <h3>{categoryName}</h3>
      </div>
    </div>
  );
};

export default CategoryHeroImage;
