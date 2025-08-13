import React from "react";

const SearchingDriver = () => {
  return (
    <div className="h-full w-full bg-[#fdf0d5] flex items-center justify-center overflow-hidden">
      <div className="text-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-2 border-[#c1121f] mx-auto mb-4"></div>
        <h3 className="text-lg md:text-xl font-semibold text-[#003049] mb-2">
          Looking for drivers...
        </h3>
        <p className="text-[#003049] opacity-75 text-sm md:text-base">
          We're finding the best driver for you
        </p>
      </div>
    </div>
  );
};

export default SearchingDriver;
