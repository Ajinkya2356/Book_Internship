import {
  Box,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Select,
  Drawer,
  Typography,
  Pagination,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import BookCard from "./BookCard";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import YearSelector from "../common/YearSelector";
import BookCreationForm from "./BookCreationForm";
import { useSelector } from "react-redux";

const Books = () => {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [limit, setLimit] = useState(10);
  const [year, setYear] = useState(new Date().getFullYear());
  const [open, setOpen] = useState(false);
  const { books } = useSelector((state) => state.BOOK);
  return (
    <>
      <Container>
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "20px 0",
            flexWrap: "wrap",
          }}
        >
          <TextField
            variant="standard"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{
              padding: 10,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment>
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Box style={{ display: "flex", gap: 10 }}>
            <YearSelector setYear={setYear} year={year} />
            <TextField
              label="Page Limit"
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />

            <IconButton
              style={{ backgroundColor: "whitesmoke" }}
              onClick={() => setOpen(true)}
            >
              <AddIcon />
            </IconButton>
          </Box>
          <Drawer open={open} onClose={() => setOpen(false)} anchor="right">
            <BookCreationForm setOpen={setOpen} />
          </Drawer>
        </Box>
        <BookCard page={page} limit={limit} keyword={keyword} year={year} />
      </Container>
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: 50,
        }}
      >
        <Pagination
          count={books.totalPageCount}
          page={page}
          onChange={(e, value) => {
            setPage(value);
          }}
        />
      </Box>
    </>
  );
};

export default Books;
