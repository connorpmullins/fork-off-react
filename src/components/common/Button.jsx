import React from "react";
import PropTypes from "prop-types";
import { colors, typography, spacing, borderRadius } from "../../styles/theme";

const VARIANTS = {
  primary: {
    backgroundColor: colors.primary.main,
    color: colors.neutral.white,
    hoverBg: colors.primary.dark,
    activeBg: colors.primary.light,
  },
  secondary: {
    backgroundColor: colors.secondary.main,
    color: colors.neutral.white,
    hoverBg: colors.secondary.dark,
    activeBg: colors.secondary.light,
  },
  outline: {
    backgroundColor: "transparent",
    color: colors.primary.main,
    border: `2px solid ${colors.primary.main}`,
    hoverBg: colors.primary.light,
    hoverColor: colors.neutral.white,
  },
  ghost: {
    backgroundColor: "transparent",
    color: colors.primary.main,
    hoverBg: colors.neutral.gray100,
  },
};

const SIZES = {
  sm: {
    padding: `${spacing[2]} ${spacing[3]}`,
    fontSize: typography.fontSize.sm,
    minWidth: "80px",
  },
  md: {
    padding: `${spacing[3]} ${spacing[4]}`,
    fontSize: typography.fontSize.base,
    minWidth: "120px",
  },
  lg: {
    padding: `${spacing[3]} ${spacing[4]}`,
    fontSize: typography.fontSize.base,
    minWidth: "140px",
  },
};

const Button = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  children,
  onClick,
  type = "button",
  className = "",
  tooltip = "",
}) => {
  const variantStyles = VARIANTS[variant];
  const sizeStyles = SIZES[size];

  const tooltipStyles = {
    position: "absolute",
    bottom: "calc(100% + 8px)",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: colors.neutral.gray800,
    color: colors.neutral.white,
    padding: `${spacing[2]} ${spacing[3]}`,
    borderRadius: borderRadius.md,
    fontSize: typography.fontSize.sm,
    whiteSpace: "nowrap",
    opacity: 0,
    visibility: "hidden",
    transition: "all 150ms ease-in-out",
    zIndex: 10,
    "&::after": {
      content: '""',
      position: "absolute",
      top: "100%",
      left: "50%",
      transform: "translateX(-50%)",
      border: "6px solid transparent",
      borderTopColor: colors.neutral.gray800,
    },
  };

  const containerStyles = {
    position: "relative",
    display: fullWidth ? "block" : "inline-block",
    width: fullWidth ? "100%" : "auto",
  };

  const baseStyles = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeight.medium,
    borderRadius: borderRadius.md,
    transition: "all 150ms ease-in-out",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    width: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    border: "none",
    outline: "none",
    ...variantStyles,
    ...sizeStyles,
  };

  return (
    <div
      style={containerStyles}
      onMouseEnter={(e) => {
        if (disabled && tooltip) {
          const tooltipEl = e.currentTarget.querySelector("[data-tooltip]");
          if (tooltipEl) {
            tooltipEl.style.opacity = "1";
            tooltipEl.style.visibility = "visible";
          }
        }
      }}
      onMouseLeave={(e) => {
        if (disabled && tooltip) {
          const tooltipEl = e.currentTarget.querySelector("[data-tooltip]");
          if (tooltipEl) {
            tooltipEl.style.opacity = "0";
            tooltipEl.style.visibility = "hidden";
          }
        }
      }}
      data-testid={`${children.toLowerCase().replace(/\s+/g, "-")}-button-container`}
    >
      {disabled && tooltip && (
        <div style={tooltipStyles} data-tooltip>
          {tooltip}
        </div>
      )}
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        style={baseStyles}
        className={className}
      >
        {children}
      </button>
    </div>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(["primary", "secondary", "outline", "ghost"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  className: PropTypes.string,
  tooltip: PropTypes.string,
};

export default Button;
