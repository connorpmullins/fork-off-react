import React from "react";
import PropTypes from "prop-types";
import { colors, typography, spacing, borderRadius } from "../../styles/theme";

const Input = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  error = null,
  ...props
}) => {
  const inputStyles = {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "0.375rem",
    border: `2px solid ${error ? "#ef4444" : "#cbd5e1"}`,
    fontSize: "1rem",
    color: "#0f172a",
    backgroundColor: "#ffffff",
    transition: "all 150ms ease-in-out",
  };

  const labelStyles = {
    display: "block",
    marginBottom: "0.5rem",
    color: "#334155",
    fontSize: "0.875rem",
    fontWeight: "500",
    position: "relative",
  };

  const errorStyles = {
    color: "#ef4444",
    fontSize: "0.875rem",
    marginTop: "0.5rem",
  };

  const requiredStyles = {
    color: "#ef4444",
    marginLeft: "2px",
  };

  return (
    <div style={{ width: "100%", marginBottom: "1rem" }}>
      {label && (
        <label htmlFor={id} style={labelStyles}>
          {label}
          {required && <span style={requiredStyles}>*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        aria-required={required}
        aria-invalid={!!error}
        style={inputStyles}
        {...props}
      />
      {error && <div style={errorStyles}>{error}</div>}
    </div>
  );
};

Input.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  error: PropTypes.string,
};

export default Input;
