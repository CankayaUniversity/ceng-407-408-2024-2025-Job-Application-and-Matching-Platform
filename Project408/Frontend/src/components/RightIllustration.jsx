// src/components/RightIllustration.jsx
import React from "react";

const RightIllustration = ({ illustration, logoText = "Logo" }) => {
  return (
    <div
      className="w-1/2 flex items-center justify-center relative"
      style={{
        background: "linear-gradient(180deg, #1849C6 0%, #000842 100%)",
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        borderRadius: "15px",
        margin: "10px",
        position: "relative",
      }}
    >
      {/* Logo yazısı */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "30px",
          color: "white",
          fontWeight: "500",
          fontSize: "18px",
        }}
      >
        {logoText}
      </div>

      {/* Illustration */}
      <img
        src={illustration}
        alt="Illustration"
        className="w-3/4 max-w-[400px]"
        onError={(e) => {
          console.error("Image failed to load:", e);
          console.log("Image src:", e.target.src);
        }}
      />
    </div>
  );
};

export default RightIllustration;
