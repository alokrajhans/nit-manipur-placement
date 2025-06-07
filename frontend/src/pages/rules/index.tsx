import type { NextPage } from "next";
import React from "react";
import {
  Container,
  Typography,
  Box,
  CssBaseline,
  createTheme,
  ThemeProvider,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Navbar from "@/src/components/Navbar";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#eee",
      secondary: "#bbb",
    },
  },
});

const rules: string[] = [
  "Students must register before applying to any company.",
  "Maintain minimum attendance of 75% to be eligible.",
  "Any disciplinary action may lead to disqualification.",
  "Students can apply for up to 3 companies simultaneously.",
  "Provide all required documents before the deadline.",
  "Late submissions will not be entertained.",
  "Follow all instructions provided by the placement team.",
  "Keep your profile information up-to-date.",
  "Participation in mock interviews is mandatory.",
  "No malpractice or cheating will be tolerated.",
];

const RulesOfPlacement: NextPage = () => {
  return (
    <Container>
    <ThemeProvider theme={darkTheme}>
        {/* <Box>
            <Navbar/>
        </Box> */}
      <CssBaseline />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, backgroundColor: "background.paper" }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Rules of Placement
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Please read the following rules carefully before participating in
            the placement process:
          </Typography>

          <List>
            {rules.map((rule, index) => (
              <ListItem key={index} divider>
                <ListItemText primary={`${index + 1}. ${rule}`} />
              </ListItem>
            ))}
          </List>

          <Box mt={3}>
            <Typography variant="body2" color="text.secondary" align="center">
              For any queries, contact the placement cell.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
    </Container>
  );
};

export default RulesOfPlacement;
