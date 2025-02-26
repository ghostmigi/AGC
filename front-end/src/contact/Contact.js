import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  Button,
  Alert,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faEdit,
  faEye,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Paper,
  DialogContent,
  DialogTitle,
  DialogActions,
  Dialog,
  Typography,
} from "@mui/material";
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

const Contact = () => {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredTechnicians, setFilteredTechnicians] = useState([]);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [ticketIdToDelete, setTicketIdToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    Address: "",
    Age: "",
    city: "",
    job: "",
    department: "",
  });
  const [notification, setNotification] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  const [page, setPage] = useState(1);
  const ticketsPerPage = 15;

  const [selectedStatus, setSelectedStatus] = useState("");

  const fetchTicketsAndRole = async (navigate) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("User not authenticated");
        return;
      }

      const decodedToken = jwtDecode(token);
      setUserEmail(decodedToken.sub);

      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("authToken");
        navigate("/auth/login");
        return;
      }

      setUserRole(decodedToken.role || "USER");

      const [ticketsResponse, usersResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/contact", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const sortedTickets = ticketsResponse.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setTickets(sortedTickets);
      setUsers(usersResponse.data);

      const technicians = usersResponse.data.filter(
        (user) => user.role === "SUPPORT"
      );
      setFilteredTechnicians(technicians);
    } catch (error) {
      setError(
        `Failed to fetch data: ${
          error.response?.data?.message || "An error occurred"
        }`
      );
    }
  };

  useEffect(() => {
    fetchTicketsAndRole(navigate);
  }, [navigate]);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const handleDelete = (ticketId) => {
    setTicketIdToDelete(ticketId);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    if (ticketIdToDelete === null) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("User not authenticated");
        return;
      }

      await axios.delete(
        `http://localhost:5000/api/contact/${ticketIdToDelete}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTickets(tickets.filter((ticket) => ticket.id !== ticketIdToDelete));
      setNotification("Contact deleted successfully!");
      setShowNotification(true);
    } catch (error) {
      setError(
        `Failed to delete contact, ${
          error.response?.data?.message || "you don't have permission!"
        }`
      );
    } finally {
      setOpenDialog(false);
      setTicketIdToDelete(null);
    }
  };

  const cancelDelete = () => {
    setOpenDialog(false);
    setTicketIdToDelete(null);
  };

  const handleUpdate = (contact) => {
    setCurrentTicket(contact);
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      Address: contact.Address,
      Age: contact.Age,
      city: contact.city,
      job: contact.job,
      department: contact.department,
    });
    setEditModalOpen(true);
  };

  const handleModalToggle = () => {
    setModalOpen(!modalOpen);
  };

  const handleEditModalToggle = () => {
    setEditModalOpen(!editModalOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStatusFilterChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = "http://localhost:5000/api/contact";
    const token = localStorage.getItem("authToken");

    try {
      await axios.post(endpoint, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchTicketsAndRole();
      setNotification("Ticket added successfully !");
      setShowNotification(true);
      handleModalToggle();
    } catch (error) {
      setError(
        `Failed to add ticket: ${
          error.response?.data?.message || "An error occurred"
        }`
      );
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const endpoint = `http://localhost:5000/api/contact/${currentTicket.id}`;
    const token = localStorage.getItem("authToken");

    // Prepare data to be sent based on user role
    const dataToUpdate = {
      title: formData.title,
      description: formData.description,
      ...(userRole == "USER"
        ? {
            status: formData.status,
            assignedToEmail: formData.assignedToEmail,
            solution: formData.solution,
          }
        : {}),
    };

    try {
      await axios.put(endpoint, dataToUpdate, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchTicketsAndRole();
      setNotification("Ticket updated successfully !");
      setShowNotification(true);
      handleEditModalToggle();
    } catch (error) {
      setError(
        `Failed to update ticket: ${
          error.response?.data?.message || "An error occurred"
        }`
      );
    }
  };

  const handleView = (ticket) => {
    setCurrentTicket(ticket);
    setViewModalOpen(true);
  };

  const handleViewModalToggle = () => {
    setViewModalOpen(!viewModalOpen);
  };

  // Filter and pagination logic
  const filteredTickets = selectedStatus
    ? tickets.filter((ticket) => ticket.status === selectedStatus)
    : tickets;

  const indexOfLastTicket = page * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(
    indexOfFirstTicket,
    indexOfLastTicket
  );
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Container fluid className="h-100 p-5">
      <h2 className="mb-4">Manage Tickets</h2>
      {error && <Alert color="danger">{error}</Alert>}
      {showNotification && (
        <Alert color="success" className="notification-alert">
          {notification}
        </Alert>
      )}
      <Button
        color="primary"
        onClick={handleModalToggle}
        className="mb-5"
        style={{
          backgroundColor: "#635bff",
          borderColor: "#635bff",
          fontFamily: "Quicksand, sans-serif",
        }}
      >
        <FontAwesomeIcon icon={faAdd} /> Add Contact
      </Button>

      <StyledTableContainer className="mt-5" component={Paper}>
        {currentTickets.length === 0 ? (
          <Typography
            variant="h6"
            align="center"
            style={{
              margin: "20px",
              fontFamily: "Quicksand, sans-serif",
            }}
          >
            No tickets available.
          </Typography>
        ) : (
          <Table className="responsive-table mt-5">
            <TableHead>
              <TableRow>
                <StyledTableCell>Contact ID</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Phone</StyledTableCell>
                <StyledTableCell>Address</StyledTableCell>
                <StyledTableCell>Age</StyledTableCell>
                <StyledTableCell>City</StyledTableCell>
                <StyledTableCell>Job</StyledTableCell>
                <StyledTableCell>Department</StyledTableCell>
                <StyledTableCell>CreatedAt</StyledTableCell>
                {["ADMIN", "SUPPORT", "USER"].includes(userRole) && (
                  <StyledTableCell>Actions</StyledTableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {currentTickets.map((ticket) => (
                <StyledTableRow key={ticket.id}>
                  <StyledTableCell>{ticket.id}</StyledTableCell>
                  <StyledTableCell>{ticket.name}</StyledTableCell>
                  <StyledTableCell>{ticket.email}</StyledTableCell>
                  <StyledTableCell>{ticket.phone}</StyledTableCell>
                  <StyledTableCell>{ticket.address}</StyledTableCell>
                  <StyledTableCell>{ticket.age}</StyledTableCell>
                  <StyledTableCell>{ticket.city}</StyledTableCell>
                  <StyledTableCell>{ticket.job}</StyledTableCell>
                  <StyledTableCell>{ticket.department}</StyledTableCell>
                  <StyledTableCell>
                    {new Date(ticket.createdAt).toLocaleString()}
                  </StyledTableCell>
                  <StyledTableCell>
                    {userRole === "USER" && (
                      <>
                        <Button color="link" onClick={() => handleView(ticket)}>
                          <FontAwesomeIcon icon={faEye} />
                        </Button>
                        <Button
                          color="link"
                          onClick={() => handleUpdate(ticket)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button
                          color="link"
                          onClick={() => handleDelete(ticket.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </>
                    )}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </StyledTableContainer>

      {/* Modal for Adding Ticket */}
      <Modal isOpen={modalOpen} toggle={handleModalToggle}>
        <ModalHeader toggle={handleModalToggle}>Add New Ticket</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <TextField
              name="name"
              label="name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={handleChange}
              sx={{
                "& .MuiInputBase-input": {
                  fontFamily: "Quicksand, sans-serif",
                },
                "& .MuiInputLabel-root": {
                  fontFamily: "Quicksand, sans-serif",
                },
              }}
            />
            <TextField
              name="email"
              label="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              sx={{
                "& .MuiInputBase-input": {
                  fontFamily: "Quicksand, sans-serif",
                },
                "& .MuiInputLabel-root": {
                  fontFamily: "Quicksand, sans-serif",
                },
              }}
            />
            <TextField
              name="phone"
              label="phone"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.phone}
              onChange={handleChange}
              sx={{
                "& .MuiInputBase-input": {
                  fontFamily: "Quicksand, sans-serif",
                },
                "& .MuiInputLabel-root": {
                  fontFamily: "Quicksand, sans-serif",
                },
              }}
            />
            <TextField
              name="Address"
              label="Address"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.Address}
              onChange={handleChange}
              sx={{
                "& .MuiInputBase-input": {
                  fontFamily: "Quicksand, sans-serif",
                },
                "& .MuiInputLabel-root": {
                  fontFamily: "Quicksand, sans-serif",
                },
              }}
            />
            <TextField
              name="Age"
              label="Age"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.Age}
              onChange={handleChange}
              sx={{
                "& .MuiInputBase-input": {
                  fontFamily: "Quicksand, sans-serif",
                },
                "& .MuiInputLabel-root": {
                  fontFamily: "Quicksand, sans-serif",
                },
              }}
            />
            <TextField
              name="city"
              label="city"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.city}
              onChange={handleChange}
              sx={{
                "& .MuiInputBase-input": {
                  fontFamily: "Quicksand, sans-serif",
                },
                "& .MuiInputLabel-root": {
                  fontFamily: "Quicksand, sans-serif",
                },
              }}
            />
            <TextField
              name="job"
              label="job"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.job}
              onChange={handleChange}
              sx={{
                "& .MuiInputBase-input": {
                  fontFamily: "Quicksand, sans-serif",
                },
                "& .MuiInputLabel-root": {
                  fontFamily: "Quicksand, sans-serif",
                },
              }}
            />
            <TextField
              name="department"
              label="department"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.department}
              onChange={handleChange}
              sx={{
                "& .MuiInputBase-input": {
                  fontFamily: "Quicksand, sans-serif",
                },
                "& .MuiInputLabel-root": {
                  fontFamily: "Quicksand, sans-serif",
                },
              }}
            />
            <ModalFooter>
              <Button
                color="secondary"
                onClick={handleModalToggle}
                style={{
                  fontFamily: "Quicksand, sans-serif",
                }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                type="submit"
                style={{
                  backgroundColor: "#635bff",
                  borderColor: "#635bff",
                  fontFamily: "Quicksand, sans-serif",
                }}
              >
                Add Ticket
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </Modal>

      {/* Modal for Editing Ticket */}
      {currentTicket && (
        <Modal isOpen={editModalOpen} toggle={handleEditModalToggle}>
          <ModalHeader toggle={handleEditModalToggle}>Edit Ticket</ModalHeader>
          <ModalBody>
            <form onSubmit={handleUpdateSubmit}>
              <TextField
                name="name"
                label="name"
                variant="outlined"
                fullWidth
                multiline
                margin="normal"
                value={formData.name}
                onChange={handleChange}
                sx={{
                  "& .MuiInputBase-input": {
                    fontFamily: "Quicksand, sans-serif",
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "Quicksand, sans-serif",
                  },
                }}
              />
              <TextField
                name="email"
                label="email"
                variant="outlined"
                fullWidth
                multiline
                margin="normal"
                value={formData.email}
                onChange={handleChange}
                sx={{
                  "& .MuiInputBase-input": {
                    fontFamily: "Quicksand, sans-serif",
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "Quicksand, sans-serif",
                  },
                }}
              />
              <TextField
                name="phone"
                label="phone"
                variant="outlined"
                fullWidth
                multiline
                margin="normal"
                value={formData.phone}
                onChange={handleChange}
                sx={{
                  "& .MuiInputBase-input": {
                    fontFamily: "Quicksand, sans-serif",
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "Quicksand, sans-serif",
                  },
                }}
              />
              <TextField
                name="Address"
                label="Address"
                variant="outlined"
                fullWidth
                multiline
                margin="normal"
                value={formData.Address}
                onChange={handleChange}
                sx={{
                  "& .MuiInputBase-input": {
                    fontFamily: "Quicksand, sans-serif",
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "Quicksand, sans-serif",
                  },
                }}
              />
              <TextField
                name="Age"
                label="Age"
                variant="outlined"
                fullWidth
                multiline
                margin="normal"
                value={formData.Age}
                onChange={handleChange}
                sx={{
                  "& .MuiInputBase-input": {
                    fontFamily: "Quicksand, sans-serif",
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "Quicksand, sans-serif",
                  },
                }}
              />
              <TextField
                name="city"
                label="city"
                variant="outlined"
                fullWidth
                multiline
                margin="normal"
                value={formData.city}
                onChange={handleChange}
                sx={{
                  "& .MuiInputBase-input": {
                    fontFamily: "Quicksand, sans-serif",
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "Quicksand, sans-serif",
                  },
                }}
              />
              <TextField
                name="job"
                label="job"
                variant="outlined"
                fullWidth
                multiline
                margin="normal"
                value={formData.job}
                onChange={handleChange}
                sx={{
                  "& .MuiInputBase-input": {
                    fontFamily: "Quicksand, sans-serif",
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "Quicksand, sans-serif",
                  },
                }}
              />
              <TextField
                name="department"
                label="department"
                variant="outlined"
                fullWidth
                multiline
                margin="normal"
                value={formData.department}
                onChange={handleChange}
                sx={{
                  "& .MuiInputBase-input": {
                    fontFamily: "Quicksand, sans-serif",
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "Quicksand, sans-serif",
                  },
                }}
              />

              <ModalFooter>
                <Button
                  style={{
                    fontFamily: "Quicksand, sans-serif",
                  }}
                  color="secondary"
                  onClick={handleEditModalToggle}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  style={{
                    backgroundColor: "#635bff",
                    borderColor: "#635bff",
                    fontFamily: "Quicksand, sans-serif",
                  }}
                >
                  Save Ticket
                </Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </Modal>
      )}

      {/* Modal for viewing ticket details */}
      <Modal
        isOpen={viewModalOpen}
        toggle={handleViewModalToggle}
        style={{
          maxWidth: "800px",
          width: "80%",
          height: "auto",
          maxHeight: "80vh",
        }}
      >
        <ModalHeader toggle={handleViewModalToggle}>Details Ticket</ModalHeader>
        <ModalBody>
          <TextField
            label="name"
            value={currentTicket?.name || "N/A"}
            fullWidth
            InputProps={{ readOnly: true }}
            multiline
            style={{ marginBottom: 18 }}
            sx={{
              "& .MuiInputBase-input": {
                fontFamily: "Quicksand, sans-serif",
              },
              "& .MuiInputLabel-root": {
                fontFamily: "Quicksand, sans-serif",
              },
            }}
          />
          <TextField
            label="email"
            value={currentTicket?.email || "N/A"}
            fullWidth
            InputProps={{ readOnly: true }}
            multiline
            style={{ marginBottom: 18 }}
            sx={{
              "& .MuiInputBase-input": {
                fontFamily: "Quicksand, sans-serif",
              },
              "& .MuiInputLabel-root": {
                fontFamily: "Quicksand, sans-serif",
              },
            }}
          />
          <TextField
            label="phone"
            value={currentTicket?.phone || "N/A"}
            fullWidth
            InputProps={{ readOnly: true }}
            multiline
            style={{ marginBottom: 18 }}
            sx={{
              "& .MuiInputBase-input": {
                fontFamily: "Quicksand, sans-serif",
              },
              "& .MuiInputLabel-root": {
                fontFamily: "Quicksand, sans-serif",
              },
            }}
          />
          <TextField
            label="Address"
            value={currentTicket?.Address || "N/A"}
            fullWidth
            InputProps={{ readOnly: true }}
            multiline
            style={{ marginBottom: 18 }}
            sx={{
              "& .MuiInputBase-input": {
                fontFamily: "Quicksand, sans-serif",
              },
              "& .MuiInputLabel-root": {
                fontFamily: "Quicksand, sans-serif",
              },
            }}
          />
          <TextField
            label="Age"
            value={currentTicket?.Age || "N/A"}
            fullWidth
            InputProps={{ readOnly: true }}
            multiline
            style={{ marginBottom: 18 }}
            sx={{
              "& .MuiInputBase-input": {
                fontFamily: "Quicksand, sans-serif",
              },
              "& .MuiInputLabel-root": {
                fontFamily: "Quicksand, sans-serif",
              },
            }}
          />
          <TextField
            label="city"
            value={currentTicket?.city || "N/A"}
            fullWidth
            InputProps={{ readOnly: true }}
            multiline
            style={{ marginBottom: 18 }}
            sx={{
              "& .MuiInputBase-input": {
                fontFamily: "Quicksand, sans-serif",
              },
              "& .MuiInputLabel-root": {
                fontFamily: "Quicksand, sans-serif",
              },
            }}
          />
          <TextField
            label="job"
            value={currentTicket?.job || "N/A"}
            fullWidth
            InputProps={{ readOnly: true }}
            multiline
            style={{ marginBottom: 18 }}
            sx={{
              "& .MuiInputBase-input": {
                fontFamily: "Quicksand, sans-serif",
              },
              "& .MuiInputLabel-root": {
                fontFamily: "Quicksand, sans-serif",
              },
            }}
          />
          <TextField
            label="department"
            value={currentTicket?.department || "N/A"}
            fullWidth
            InputProps={{ readOnly: true }}
            multiline
            style={{ marginBottom: 18 }}
            sx={{
              "& .MuiInputBase-input": {
                fontFamily: "Quicksand, sans-serif",
              },
              "& .MuiInputLabel-root": {
                fontFamily: "Quicksand, sans-serif",
              },
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={handleViewModalToggle}
            style={{
              fontFamily: "Quicksand, sans-serif",
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
      <Dialog
        open={openDialog}
        onClose={cancelDelete}
        sx={{
          "& .MuiTypography-root": {
            fontFamily: "Quicksand, sans-serif",
          },
          "& .MuiButton-root": {
            fontFamily: "Quicksand, sans-serif",
          },
          "& .MuiDialogContent-root": {
            fontFamily: "Quicksand, sans-serif",
          },
          "& .MuiDialogTitle-root": {
            fontFamily: "Quicksand, sans-serif",
          },
          "& .MuiDialogActions-root": {
            fontFamily: "Quicksand, sans-serif",
          },
          "& .MuiPaper-root": {
            top: "10%",
            margin: "auto",
            position: "absolute",
          },
        }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this contact ?
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="danger">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Contact;
