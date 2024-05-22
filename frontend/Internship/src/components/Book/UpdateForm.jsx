import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createBook, updateBook } from "../../Redux/book/bookSlice";

function UpdateForm({ setUpdate, book }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.USER);
  const [bookData, setBookData] = useState({
    title: book.title,
    description: book.description,
    author: user?._id,
    genre: book.genre,
    year: book.year,
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "year") {
      value = Number(value);
    }
    setBookData({ ...bookData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateBook(book._id, bookData));
  };

  return (
    <Grid container style={{ maxWidth: 300, padding: 10 }}>
      <Grid item>
        <Paper style={{ padding: "20px" }}>
          <Typography variant="h5" gutterBottom>
            Create Book
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              variant="outlined"
              value={bookData.title}
              onChange={handleChange}
              style={{ marginBottom: "20px" }}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              variant="outlined"
              value={bookData.description}
              onChange={handleChange}
              style={{ marginBottom: "20px" }}
            />
            <FormControl
              fullWidth
              variant="outlined"
              style={{ marginBottom: "20px" }}
            >
              <InputLabel id="genre-label">Genre</InputLabel>
              <Select
                labelId="genre-label"
                id="genre-select"
                name="genre"
                value={bookData.genre}
                onChange={handleChange}
                label="Genre"
              >
                <MenuItem value="comedy">Comedy</MenuItem>
                <MenuItem value="drama">Drama</MenuItem>
                <MenuItem value="science-fiction">Science Fiction</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Year"
              name="year"
              type="number"
              variant="outlined"
              value={bookData.year}
              onChange={handleChange}
              style={{ marginBottom: "20px" }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={() => setUpdate(false)}
            >
              Update
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default UpdateForm;
