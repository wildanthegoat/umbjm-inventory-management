import { useState } from "react";

export const useGlobalFilter = (initialValue = "") => {
  const [globalFilter, setGlobalFilter] = useState(initialValue);

  const handleGlobalFilterChange = (event) => {
    setGlobalFilter(event.target.value);
  };

  const filterData = (data, filterKeys) => {
    if (!globalFilter) return data;
    return data.filter((item) =>
      filterKeys.some((key) =>
        item[key].toLowerCase().includes(globalFilter.toLowerCase())
      )
    );
  };

  return {
    globalFilter,
    setGlobalFilter,
    handleGlobalFilterChange,
    filterData,
  };
};
