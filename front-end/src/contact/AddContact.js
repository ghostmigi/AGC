import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
    <div>
      <h1>Add Contact</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="Name"
          placeholder="Name"
          value={formData.Name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="Email"
          placeholder="Email"
          value={formData.Email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Phone"
          placeholder="Phone"
          value={formData.Phone}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Address"
          placeholder="Address"
          value={formData.Address}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Age"
          placeholder="Age"
          value={formData.Age}
          onChange={handleChange}
        />
        <input
          type="text"
          name="City"
          placeholder="City"
          value={formData.City}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Job"
          placeholder="Job"
          value={formData.Job}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Department"
          placeholder="Department"
          value={formData.Department}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddContact;
