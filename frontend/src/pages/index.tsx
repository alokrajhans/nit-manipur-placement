import { Typography, Container } from "@mui/material";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  return (
    <Container>
      {/* <Navbar/> */}
      <Typography sx={{ml:"12vh",mt:"5vh"}}variant="h3"><strong>Welcome to NIT Manipur Placement Portal</strong></Typography>
    </Container>
  );
}
