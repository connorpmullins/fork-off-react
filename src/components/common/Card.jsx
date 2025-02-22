import React from "react";
import PropTypes from "prop-types";
import { colors, spacing, borderRadius, shadows } from "../../styles/theme";

const Card = ({
  children,
  padding = "4",
  elevation = "md",
  className = "",
  onClick,
  hoverable = false,
  ...props
}) => {
  const paddingMap = {
    2: "0.5rem",
    4: "1rem",
    6: "1.5rem",
    8: "2rem",
  };

  const elevationMap = {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    lg: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  };

  const baseStyles = {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: paddingMap[padding],
    boxShadow: elevationMap[elevation],
    transition: "all 150ms ease-in-out",
    cursor: onClick || hoverable ? "pointer" : "default",
    "&:hover": hoverable && {
      transform: "translateY(-2px)",
      boxShadow: shadows.lg,
    },
    ...props.style,
  };

  return (
    <div
      style={baseStyles}
      className={className}
      onClick={onClick}
      role={onClick ? "button" : "none"}
      tabIndex={onClick ? 0 : -1}
      {...props}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  padding: PropTypes.oneOf(["2", "4", "6", "8"]),
  elevation: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
  onClick: PropTypes.func,
  hoverable: PropTypes.bool,
};

export default Card;
