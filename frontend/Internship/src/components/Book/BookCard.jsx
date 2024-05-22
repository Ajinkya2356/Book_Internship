import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {
  Box,
  CardActionArea,
  Chip,
  CircularProgress,
  Container,
  Drawer,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { deleteBook, getBooks } from "../../Redux/book/bookSlice";
import UpdateForm from "./UpdateForm";
import { Pagination } from "@mui/material";
export default function BookCard({ page, limit, keyword, year }) {
  const dispatch = useDispatch();
  const [update, setUpdate] = React.useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.USER);
  const { books, loading } = useSelector((state) => state.BOOK);
  React.useEffect(() => {
    dispatch(getBooks(page, limit, keyword, year));
  }, [page, limit, keyword, year, isAuthenticated]);
  return (
    <>
      <Container
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          books?.books?.map((book, index) => (
            <Card sx={{ minWidth: 345, maxWidth: 345 }} key={index}>
              <CardActionArea>
                <CardContent>
                  {isAuthenticated && user?._id == book?.author?._id && (
                    <Box
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <IconButton onClick={() => setUpdate(true)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => dispatch(deleteBook(book._id))}
                      >
                        <DeleteIcon style={{ color: "red" }} />
                      </IconButton>
                    </Box>
                  )}
                  <Drawer
                    open={update}
                    onClose={() => setUpdate(false)}
                    anchor="right"
                  >
                    <UpdateForm setUpdate={setUpdate} book={book} />
                  </Drawer>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    textOverflow="ellipsis"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {book.title}
                    <Chip label={book.genre} />
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textOverflow={"ellipsis"}
                  >
                    {book.description}
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    Author : {book?.author?.username}
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    Published In : {book?.year}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))
        )}
      </Container>
      
    </>
  );
}
