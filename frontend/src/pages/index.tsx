import { useEffect } from "react";
import { useRouter } from "next/router";

export default function LandingPage() {
  const router = useRouter();
   
    router.replace("/login"); // redirect to /login
  
  return (
    // <Container sx={{ [media.st]: { color: "primary", backgroundColor: "background.default", width: "245%", alignItems: 'stretch', mr: "20px" } }}>
    //   {/* <Navbar/> */}
    //   <Typography sx={{ ml: "12vh", mt: "5vh",[media.st]:{fontSize:"35px"} }} variant="h3"><strong>Welcome to NIT Manipur Placement Portal</strong></Typography>
    // </Container>
    <></>
  );
}
