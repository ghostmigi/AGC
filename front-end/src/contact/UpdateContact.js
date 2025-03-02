import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Container, TextField, Button, Typography, Paper, Box } from "@mui/material";

const UpdateContact = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    age: "",
    city: "",
    job: "",
    department: "",
  });

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`http://localhost:5000/api/contact/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { updatedAt, createdAt, ...filteredData } = response.data;
        setFormData(filteredData);
      } catch (error) {
        console.error("Error fetching contact:", error);
      }
    };

    fetchContact();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(`http://localhost:5000/api/contact/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/contact");
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={6} sx={{ padding: 4 }}>
        <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
          Edit Contact
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {Object.keys(formData).map((field) => (
            <TextField
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
          ))}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Update Contact
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UpdateContact;
