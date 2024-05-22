import React, { useState } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

function YearSelector({ setYear, year }) {
  const handleChange = (event) => {
    setYear(event.target.value);
  };

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= currentYear - 10; i--) {
    years.push(i);
  }

  return (
    <FormControl fullWidth style={{ minWidth: 100 }}>
      <InputLabel id="year-label">Year</InputLabel>
      <Select
        labelId="year-label"
        id="year-select"
        value={year}
        onChange={handleChange}
        label="Year"
      >
        {years.map((year) => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default YearSelector;
