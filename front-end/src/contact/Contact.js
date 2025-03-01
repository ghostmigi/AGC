import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableHead,
  Paper,
  TableContainer,
  TableCell,
  TableRow,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Spinner } from "reactstrap";
import { styled } from "@mui/system";

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: "10px",
  fontFamily: "Quicksand, sans-serif",
  maxHeight: "650px",
  overflowY: "auto",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#f1f1f1",
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#888",
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#555",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontFamily: "Quicksand, sans-serif",
  fontSize: "16px",
  fontWeight: "400",
  color: "#333",
  textAlign: "center",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
}));

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/contact", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setContacts(response.data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [token]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("authToken"); // Get token from localStorage

    if (!token) {
      alert("Unauthorized: No token found. Please log in.");
      return;
    }

    console.log("Deleting contact with ID:", id);

    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await axios.delete(`http://localhost:5000/api/contact/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        });

        // Update the state to remove the deleted contact
        setContacts((prevContacts) =>
          prevContacts.filter((contact) => contact.id !== id)
        );

        alert(`Contact with ID ${id} deleted successfully!`);
      } catch (error) {
        console.error("Error deleting contact:", error);
        alert("Failed to delete contact. Please try again.");
      }
    }
  };

  if (loading) {
    return <Spinner color="primary">Loading...</Spinner>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ color: "#15b79e" }}>
            Contacts List
          </Typography>

          <StyledTableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>ID</StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Phone</StyledTableCell>
                  <StyledTableCell>Address</StyledTableCell>
                  <StyledTableCell>Age</StyledTableCell>
                  <StyledTableCell>City</StyledTableCell>
                  <StyledTableCell>Job</StyledTableCell>
                  <StyledTableCell>Department</StyledTableCell>
                  <StyledTableCell>Created At</StyledTableCell>
                  <StyledTableCell>Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {contacts.map((contact, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{contact.id}</StyledTableCell>
                    <StyledTableCell>{contact.name}</StyledTableCell>
                    <StyledTableCell>{contact.email}</StyledTableCell>
                    <StyledTableCell>{contact.phone}</StyledTableCell>
                    <StyledTableCell>{contact.address}</StyledTableCell>
                    <StyledTableCell>{contact.age}</StyledTableCell>
                    <StyledTableCell>{contact.city}</StyledTableCell>
                    <StyledTableCell>{contact.job}</StyledTableCell>
                    <StyledTableCell>{contact.department}</StyledTableCell>
                    <StyledTableCell>
                      {new Date(contact.createdAt).toLocaleString()}
                    </StyledTableCell>
                    <StyledTableCell>
                      <IconButton
                        color="primary"
                        // onClick={() => handleEdit(contact.id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(contact.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Contacts;
