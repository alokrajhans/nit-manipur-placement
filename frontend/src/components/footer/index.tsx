"use client";

import React from "react";
import { Box, Typography, Container, Link, useMediaQuery } from "@mui/material";
import { media } from "@/src/utils/breakpoints";

const Footer: React.FC = () => {
  const isMobile = useMediaQuery("(max-width:460px)");

  return (
    <Container maxWidth="lg" >
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 3,
          mt: "auto",
          backgroundColor: (theme) =>
            theme.palette.mode === "light" ? "#f5f5f5" : "#333",
          textAlign: "center",
          ...(isMobile && {
            backgroundColor: "background.default",
            width: "100%",
            alignItems: "stretch",
            mr: "20px",
          }),
        }}
      >
        <Typography variant="body2" color="text.secondary">
          &copy; {new Date().getFullYear()} Alok Raj Hans. All rights reserved.{" "}
          <Link href="/rules" underline="hover">
            Rules of Placement.
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Footer;


// import React from "react";
// import { Box, Typography, Container, Link } from "@mui/material";
// import { media } from "@/src/utils/breakpoints";

// const Footer: React.FC = () => {
//   return (
//     <Container>
//       <Box
//         component="footer"
//         sx={{
//           py: 2,
//           px: 3,
//           mt: "auto",
//           backgroundColor: (theme) =>
//             theme.palette.mode === "light" ? "#f5f5f5" : "#333",
//           textAlign: "center",
//           [media.st] :{backgroundColor:"background.default",width:"265%", alignItems: 'stretch',mr:"20px"}
//       }}
//     >
//       <Typography variant="body2" color="text.secondary">
//         &copy; {new Date().getFullYear()} Alok Raj Hans. All rights reserved.{" "}
//         <Link href="/rules" underline="hover">
//           Rules of Placement.
//         </Link>
//       </Typography>
//     </Box>
//     </Container >
//   );
// };

// export default Footer;
