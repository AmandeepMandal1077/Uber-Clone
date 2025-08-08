import React from "react";

const LocationInput = ({
  label,
  value,
  onChange,
  placeholder,
  suggestions,
  showDropdown,
  onSuggestionSelect,
  getLocationIcon,
  dotColor = "#c1121f",
}) => {
  return (
    <div className="relative">
      <label className="block text-black font-medium mb-1 md:mb-2">
        <span className="flex items-center gap-2">
          <div
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full`}
            style={{ backgroundColor: dotColor }}
          ></div>
          {label}
        </span>
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 md:px-4 md:py-3 border-2 border-[#669bbc] rounded-lg focus:outline-none focus:border-[#c1121f] transition-colors text-black text-sm md:text-base"
      />

      {/* Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1">
          <div className="bg-white rounded-lg shadow-xl border-2 border-[#669bbc] max-h-32 md:max-h-48 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSuggestionSelect(suggestion);
                }}
                className="flex items-center gap-2 md:gap-3 p-2 md:p-3 hover:bg-[#fdf0d5] cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors select-none"
              >
                <div className="w-6 h-6 md:w-8 md:h-8 bg-[#669bbc] rounded-full flex items-center justify-center flex-shrink-0">
                  <i
                    className={`${getLocationIcon(
                      suggestion.type
                    )} text-white text-xs md:text-sm`}
                  ></i>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-black text-xs md:text-sm truncate">
                    {suggestion.name}
                  </div>
                  <div className="text-xs text-black truncate">
                    {suggestion.area}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationInput;
