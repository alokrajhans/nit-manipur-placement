"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/src/components/Navbar";
import { Box, Container, Typography, Grid, Paper } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getInterestedStudents } from "@/src/service/interestedStudents";
import { getSelectedStudents } from "@/src/service/selectedStudents";
import { media } from "@/src/utils/breakpoints";

const COLORS = ["#0088FE", "#00C49F"];

export default function AnalyticsPage() {
  const [branchData, setBranchData] = useState<
    { branch: string; interested: number; placed: number }[]
  >([]);
  const [totalInterested, setTotalInterested] = useState(0);
  const [totalPlaced, setTotalPlaced] = useState(0);
  const [totalOffers, setTotalOffers] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const interested = await getInterestedStudents();
      const selected = await getSelectedStudents();

      const interestedBranchCount: Record<string, number> = {};
      const placedBranchCount: Record<string, number> = {};

      let totalOffersCount = 0;

      interested.forEach((student) => {
        const branch = student.Branch || "Other";
        interestedBranchCount[branch] = (interestedBranchCount[branch] || 0) + 1;
      });

      selected.forEach((student) => {
        const branch = student.Branch || "Other";
        placedBranchCount[branch] = (placedBranchCount[branch] || 0) + 1;
        totalOffersCount += student.offers || 0;
      });

      const allBranches = new Set([
        ...Object.keys(interestedBranchCount),
        ...Object.keys(placedBranchCount),
      ]);

      const branchData = Array.from(allBranches).map((branch) => ({
        branch,
        interested: interestedBranchCount[branch] || 0,
        placed: placedBranchCount[branch] || 0,
      }));

      setBranchData(branchData);
      setTotalInterested(interested.length);
      setTotalPlaced(selected.length);
      setTotalOffers(totalOffersCount);
    };

    fetchData();
  }, []);

  const notPlaced = totalInterested - totalPlaced;

  return (
    <Container sx={{ [media.st]: { color: "primary", backgroundColor: "background.default", width: "100%", alignItems: 'stretch', mr: "20px",mt:"-30px" } }}>
      {/* <Box>
        <Navbar />
      </Box> */}
      <Grid container spacing={4} mt={4} sx={{ [media.st]: { flexWrap: "nowrap" } }}>
        <Grid item xs={12} md={4} sx={{
          [media.st]: {
            flexBasis: "33.33%",
            maxWidth: "33.33%",
          },
        }}>
          <Paper sx={{ p: 2, backgroundColor: "#1e1e1e", color: "#fff" }}>
            <Typography variant="h6">Total Job Offers</Typography>
            <Typography variant="h4">{totalOffers}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4} sx={{
          [media.st]: {
            flexBasis: "33.33%",
            maxWidth: "33.33%",
          },
        }}>
          <Paper sx={{ p: 2, backgroundColor: "#1e1e1e", color: "#fff" }}>
            <Typography variant="h6">Students Placed</Typography>
            <Typography variant="h4">{totalPlaced}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4} sx={{
          [media.st]: {
            flexBasis: "33.33%",
            maxWidth: "33.33%",
          },
        }}>
          <Paper sx={{ p: 2, backgroundColor: "#1e1e1e", color: "#fff" }}>
            <Typography variant="h6">Total Interested Students</Typography>
            <Typography variant="h4">{totalInterested}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h4" mt={4} mb={2}>
        Placement Analytics
      </Typography>

      <Grid container spacing={2} wrap="nowrap" sx={{ overflowX: 'auto' }}>
        {branchData.map((branch) => {
          const percentage = branch.interested
            ? ((branch.placed / branch.interested) * 100).toFixed(1)
            : "0.0";
          return (
            <Grid item xs="auto" key={branch.branch} ml={"15px"} >
              <Paper sx={{ p: 2, minWidth: 200, backgroundColor: "#1e1e1e", color: "#fff" }}>
                <Typography variant="h6">{branch.branch}</Typography>
                <Typography>Interested Students: {branch.interested}</Typography>
                <Typography>Placed Students: {branch.placed}</Typography>
                <Typography>Placement %: {percentage}%</Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>


      <Typography variant="h5" mt={6} mb={2}>
        Branch-wise Placement Chart
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={branchData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="branch" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="interested" fill="#8884d8" />
          <Bar dataKey="placed" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>

      <Typography variant="h5" mt={6} mb={2}>
        Overall Placement Distribution
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={[
              { name: "Placed", value: totalPlaced },
              { name: "Not Placed", value: notPlaced },
            ]}
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            dataKey="value"
          >
            {COLORS.map((color, index) => (
              <Cell key={`cell-${index}`} fill={color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Container>
  );
}
