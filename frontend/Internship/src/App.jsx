import Navbar from "./components/common/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Books from "./components/Book/Books";
import Profile from "./components/User/Profile";
import Register from "./components/User/Register";
import Login from "./components/User/Login";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearErrors, loadUser } from "./Redux/user/userSlice";
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser());
    dispatch(clearErrors());
  }, []);
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Books />} />
          <Route path="/me" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
