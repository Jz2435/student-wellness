import React, { useState } from "react";

interface FormInputProps {
  label: string;
  type: "email" | "password" | "text";
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  required?: boolean;
  showPasswordToggle?: boolean;
  accentColor?: string;
  autoComplete?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  showPasswordToggle = false,
  accentColor = "#10b981",
  autoComplete,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType =
    type === "password" && showPasswordToggle && showPassword ? "text" : type;

  return (
    <div style={{ marginBottom: "28px" }}>
      <label
        style={{
          display: "block",
          fontSize: "14px",
          fontWeight: 600,
          color: "#374151",
          marginBottom: "10px",
          textAlign: "left",
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={{
            width: "100%",
            padding: "14px 16px",
            paddingRight: showPasswordToggle ? "60px" : "16px",
            fontSize: "15px",
            border: `2px solid ${error ? "#dc2626" : "#e5e7eb"}`,
            borderRadius: "10px",
            outline: "none",
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = accentColor;
            e.target.style.boxShadow = `0 0 0 2px ${accentColor}33`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? "#dc2626" : "#e5e7eb";
            e.target.style.boxShadow = "none";
          }}
          required={required}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${label}-error` : undefined}
        />
        {showPasswordToggle && type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "#6b7280",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
              padding: "4px 8px",
            }}
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={0}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {error && (
        <p
          id={`${label}-error`}
          role="alert"
          style={{
            fontSize: "12px",
            color: "#dc2626",
            margin: "6px 0 0 0",
            textAlign: "left",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};
