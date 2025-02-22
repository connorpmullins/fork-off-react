import React from "react";
import PropTypes from "prop-types";
import { colors, typography } from "../../styles/theme";

const Input = ({
  id,
  label,
  value,
  onChange,
  error,
  required,
  multiline,
  rows,
  type,
  min,
  max,
  placeholder,
  style,
}) => {
  const inputStyles = {
    width: "100%",
    padding: "0.75rem",
    border: `1px solid ${error ? colors.error : colors.neutral.gray300}`,
    borderRadius: "0.375rem",
    fontSize: typography.fontSize.base,
    color: colors.neutral.gray900,
    backgroundColor: colors.white,
    outline: "none",
    transition: "border-color 0.2s ease",
    ...style,
  };

  const commonProps = {
    id,
    value,
    onChange,
    placeholder,
    required,
    style: inputStyles,
  };

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          style={{
            display: "block",
            marginBottom: "0.5rem",
            color: colors.neutral.gray700,
          }}
        >
          {label}
          {required && (
            <span style={{ color: colors.error, marginLeft: "0.25rem" }}>
              *
            </span>
          )}
        </label>
      )}
      {multiline ? (
        <textarea {...commonProps} rows={rows} />
      ) : (
        <input {...commonProps} type={type} min={min} max={max} />
      )}
      {error && (
        <p
          style={{
            color: colors.error,
            fontSize: typography.fontSize.sm,
            marginTop: "0.25rem",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

Input.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  required: PropTypes.bool,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  type: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  placeholder: PropTypes.string,
  style: PropTypes.object,
};

Input.defaultProps = {
  type: "text",
  required: false,
  multiline: false,
  rows: 3,
};

export default Input;
