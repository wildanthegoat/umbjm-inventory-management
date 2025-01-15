import React from "react";
export const RoleBasedAccess = ({
  role = [],
  userRole = "",
  children,
  fallback = null
}) => {
  // Handle both array and string inputs for roles
  const roles = Array.isArray(role) ? role : [role];
  // Guard against undefined/null inputs
  if (!roles.length || !userRole) {
    console.warn("RoleBasedAccess: Missing required role or userRole prop");
    return null;
  }
  // Check if user has required role
  const hasAccess = roles.includes(userRole);  
  // Return fallback component or null if no access
  if (!hasAccess) {
    return fallback;
  }

  return <>{children}</>;
};
