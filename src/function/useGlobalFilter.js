import { useState } from "react";

export const useGlobalFilter = (initialValue = "") => {
  const [globalFilter, setGlobalFilter] = useState(initialValue);

  const handleGlobalFilterChange = (event) => {
    setGlobalFilter(event.target.value);
  };

  const filterData = (data, filterKeys) => {
    if (!globalFilter) return data;

    return data.filter((item) =>
      filterKeys.some((key) => {
        const keys = key.split(".");
        let value = item;

        // Traverse nested fields
        for (const k of keys) {
          value = value?.[k];
          if (value === undefined) break;
        }

        return value
          ? value.toString().toLowerCase().includes(globalFilter.toLowerCase())
          : false;
      })
    );
  };

  return {
    globalFilter,
    setGlobalFilter,
    handleGlobalFilterChange,
    filterData,
  };
};

