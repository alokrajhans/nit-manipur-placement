"use client";

import React from "react";
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

const branchData = [
  { branch: "CSE", interested: 50, placed: 35 },
  { branch: "ECE", interested: 40, placed: 20 },
  { branch: "EE", interested: 30, placed: 15 },
  { branch: "ME", interested: 25, placed: 10 },
  { branch: "CE", interested: 20, placed: 8 },
];

const COLORS = ["#0088FE", "#00C49F"];

const totalOffers = branchData.reduce((acc, b) => acc + b.placed, 0);
const totalInterested = branchData.reduce((acc, b) => acc + b.interested, 0);
const notPlaced = totalInterested - totalOffers;

export default function AnalyticsPage() {
  return (
    <Container>
      <Box>
        <Navbar />
      </Box>
      <Grid container spacing={4} mt={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, backgroundColor: "#1e1e1e", color: "#fff" }}>
            <Typography variant="h6">Total Job Offers</Typography>
            <Typography variant="h4">{totalOffers}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, backgroundColor: "#1e1e1e", color: "#fff" }}>
            <Typography variant="h6">Students Not Placed</Typography>
            <Typography variant="h4">{notPlaced}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, backgroundColor: "#1e1e1e", color: "#fff" }}>
            <Typography variant="h6">Total Interested Studebts</Typography>
            <Typography variant="h4">{totalInterested}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h4" mt={4} mb={2}>
        Placement Analytics
      </Typography>

      <Grid container spacing={4}>
        {branchData.map((branch) => {
          const percentage = (
            (branch.placed / branch.interested) *
            100
          ).toFixed(1);
          return (
            <Grid item xs={12} md={6} lg={4} key={branch.branch}>
              <Paper sx={{ p: 2, backgroundColor: "#1e1e1e", color: "#fff" }}>
                <Typography variant="h6">{branch.branch}</Typography>
                <Typography>
                  Interested Students: {branch.interested}
                </Typography>
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
              { name: "Placed", value: totalOffers },
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
