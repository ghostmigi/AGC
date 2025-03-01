import "./App.css";
import React from "react";
import Signup from "./auth/Signup";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Signin from "./auth/Signin";
import PrivateRoute from "./auth/PrivateRoute";
import PublicRoute from "./auth/PublicRoute";
import Terms from "./terms/Terms";
import Layout from "./sidebar/layout";
import Contact from "./contact/Contact";
import AddContact from "./contact/AddContact";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/contact"
          element={
            <PrivateRoute
              element={
                <Layout>
                  <Contact />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/addcontact"
          element={
            <PrivateRoute
              element={
                <Layout>
                  <AddContact />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/auth/signup"
          element={<PublicRoute element={<Signup />} />}
        />
        <Route
          path="/auth/signin"
          element={<PublicRoute element={<Signin />} />}
        />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<Navigate to="/auth/signin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
