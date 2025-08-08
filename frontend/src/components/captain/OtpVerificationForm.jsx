import React from "react";

const OtpVerificationForm = ({
  enteredOtp,
  setEnteredOtp,
  onVerify,
  onCancel,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-3">
      <h4 className="font-medium text-center mb-2">Enter OTP from Passenger</h4>
      <input
        type="text"
        maxLength="4"
        value={enteredOtp}
        onChange={(e) => setEnteredOtp(e.target.value.replace(/[^0-9]/g, ""))}
        placeholder="4-digit OTP"
        className="w-full px-4 py-2 border-2 border-[#669bbc] rounded-lg focus:outline-none focus:border-[#003049] mb-3"
      />
      <div className="flex space-x-2">
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onVerify}
          className="flex-1 bg-[#003049] text-white py-2 rounded-lg font-medium"
        >
          Verify & Start
        </button>
      </div>
    </div>
  );
};

export default OtpVerificationForm;
