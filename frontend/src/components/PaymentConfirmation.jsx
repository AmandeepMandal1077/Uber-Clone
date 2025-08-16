import React from "react";

const PaymentConfirmation = ({ onConfirmPayment, pickup, destination }) => {
  return (
    <div className="h-full w-full bg-[#fdf0d5] flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4 md:p-6 text-center mx-4">
        <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 md:w-8 md:h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-lg md:text-xl font-semibold text-black mb-2">
          Confirm your payment to complete the booking
        </h3>
        <p className="text-gray-600 text-sm md:text-base mb-6">
          You're about to book a ride from {pickup} to {destination}
        </p>

        {/* Ride Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">From:</span>
              <span className="font-medium text-black">{pickup}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">To:</span>
              <span className="font-medium text-black">{destination}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onConfirmPayment}
          className="w-full bg-[#c1121f] text-white py-3 px-6 rounded-lg text-sm md:text-base font-medium hover:bg-[#a00e1a] transition-colors mb-4"
        >
          <div className="flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4 md:w-5 md:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            {"Confirm Payment"}
          </div>
        </button>

        <p className="text-xs text-gray-500">
          Your payment will be processed securely. You can cancel within 2
          minutes.
        </p>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
