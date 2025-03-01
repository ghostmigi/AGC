import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
} from "@mui/material";

const AddContact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Phone: "",
    Address: "",
    Age: "",
    City: "",
    Job: "",
    Department: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = "http://localhost:5000/api/Contact";
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        navigate("/contact", { state: { registrationSuccess: true } });
      }
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(to right, #2196F3, #9C27B0)",
      }}
    >
      <Paper elevation={6} sx={{ padding: 4, borderRadius: 3, width: "100%" }}>
        <Typography
          variant="h5"
          align="center"
          fontWeight="bold"
          color="primary"
          gutterBottom
        >
          Add Contact
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {["Name", "Email", "Phone", "Address", "Age", "City", "Job", "Department"].map(
            (field) => (
              <TextField
                key={field}
                label={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            )
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, py: 1.5, fontSize: "1rem", borderRadius: 2 }}
          >
            Save Contact
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddContact;
