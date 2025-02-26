import React from "react";
import { Container, Typography, Box, Link } from "@mui/material";

const Terms = () => {
  return (
    <Container maxWidth="md" sx={{ padding: "2rem" }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Terms and Conditions
      </Typography>
      <Typography variant="body1" paragraph>
        Welcome to <strong>DGSSI</strong>. These Terms and Conditions outline
        the rules and regulations for the use of our website and services. By
        accessing or using our site, you agree to comply with these terms.
        Please read them carefully.
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom>
        1. Acceptance of Terms
      </Typography>
      <Typography variant="body1" paragraph>
        By using our website, you agree to these Terms and Conditions. If you do
        not agree, please do not use our site. We may update these terms from
        time to time, and your continued use of the site constitutes acceptance
        of any changes.
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom>
        2. User Responsibilities
      </Typography>
      <Typography variant="body1" paragraph>
        You are responsible for maintaining the confidentiality of your account
        and password. You agree to notify us immediately of any unauthorized use
        of your account. You are also responsible for all activities that occur
        under your account.
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom>
        3. Intellectual Property
      </Typography>
      <Typography variant="body1" paragraph>
        All content on our website, including text, graphics, logos, and images,
        is the property of <strong>DGSSI</strong> or its content suppliers and
        is protected by copyright, trademark, and other intellectual property
        laws. You may not use, reproduce, or distribute any content without our
        express written permission.
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom>
        4. Limitation of Liability
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>DGSSI</strong> shall not be liable for any indirect, incidental,
        special, or consequential damages arising from or related to your use of
        the website. Our total liability for any claim arising from your use of
        the site shall not exceed the amount paid by you, if any, for accessing
        the site.
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom>
        5. Governing Law
      </Typography>
      <Typography variant="body1" paragraph>
        These Terms and Conditions are governed by and construed in accordance
        with the laws of the State of Rabat, without regard to its conflict of
        law principles. Any disputes arising under these terms shall be subject
        to the exclusive jurisdiction of the courts located in Rabat.
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom>
        6. Changes to Terms
      </Typography>
      <Typography variant="body1" paragraph>
        We reserve the right to update or modify these Terms and Conditions at
        any time without prior notice. It is your responsibility to review these
        terms periodically for any changes. Your continued use of the site after
        any changes constitutes your acceptance of the new terms.
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom>
        7. Contact Information
      </Typography>
      <Typography variant="body1" paragraph>
        If you have any questions about these Terms and Conditions, please
        contact us at:
      </Typography>
      <Box mb={2}>
        <Typography variant="body1" paragraph>
          <strong>Email:</strong>{" "}
          <Link href="mailto:contact-macert@dgssi.gov.ma">
            contact-macert@dgssi.gov.ma
          </Link>
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Phone:</strong> Tél :+212 5 37 57 21 47
        </Typography>
      </Box>
      <Typography variant="body1" paragraph>
        Thank you for using our website and services. We hope you have a
        positive experience.
      </Typography>
    </Container>
  );
};

export default Terms;
