import { Typography, Container } from "@mui/material";
import Navbar from "../components/Navbar";
import { media } from "../utils/breakpoints";

export default function LandingPage() {
  return (
    <Container sx={{ [media.st]: { color: "primary", backgroundColor: "background.default", width: "245%", alignItems: 'stretch', mr: "20px" } }}>
      {/* <Navbar/> */}
      <Typography sx={{ ml: "12vh", mt: "5vh",[media.st]:{fontSize:"35px"} }} variant="h3"><strong>Welcome to NIT Manipur Placement Portal</strong></Typography>
    </Container>
  );
}
