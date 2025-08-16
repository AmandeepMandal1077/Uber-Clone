import React, { useRef } from "react";

const LocationInput = ({
  label,
  value = "",
  onChange,
  placeholder,
  suggestions = [],
  showDropdown = false,
  onSuggestionSelect,
  getLocationIcon,
  dotColor = "#c1121f",
}) => {
  const input = useRef(null);

  return (
    <div className="relative">
      <label className="block text-black font-medium mb-2">
        <span className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: dotColor }}
          ></div>
          {label}
        </span>
      </label>
      <input
        ref={input}
        type="text"
        value={value || ""}
        onChange={(e) => {
          const newValue = e.target.value;
          // Pass the new value back to parent component
          onChange(newValue);
        }}
        placeholder={placeholder}
        className="w-full px-3 py-3 border-2 border-[#669bbc] rounded-lg focus:outline-none focus:border-[#c1121f] transition-colors text-black"
      />

      {/* Suggestions Dropdown */}
      {input.current &&
        document.activeElement === input.current &&
        showDropdown &&
        value &&
        value.trim() !== "" &&
        Array.isArray(suggestions) &&
        suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1">
            <div className="bg-white rounded-lg shadow-xl border-2 border-[#669bbc] max-h-48 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id || `${suggestion.name}-${suggestion.area}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onSuggestionSelect(suggestion);
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-[#fdf0d5] cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors select-none text-black"
                >
                  <div className="w-8 h-8 bg-[#669bbc] rounded-full flex items-center justify-center flex-shrink-0">
                    <i
                      className={`${getLocationIcon(
                        suggestion.type
                      )} text-black text-sm`}
                    ></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-black text-sm truncate">
                      {suggestion.name}
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
