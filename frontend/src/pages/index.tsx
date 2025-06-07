import { Typography, Container } from "@mui/material";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  return (
    <Container>
      <Navbar/>
      <Typography variant="h3">Welcome to NIT Manipur Placement Portal</Typography>
    </Container>
  );
}
