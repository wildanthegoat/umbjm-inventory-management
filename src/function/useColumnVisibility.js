import { useState } from "react";

export const useColumnVisibility = (initialColumns) => {
  const [visibleColumns, setVisibleColumns] = useState(initialColumns);
  const handleColumnVisibilityChange = (column) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };
  return {
    visibleColumns,
    handleColumnVisibilityChange,
  };
};
