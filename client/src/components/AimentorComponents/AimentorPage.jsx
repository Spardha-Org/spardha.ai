import React, { useState } from "react";
import {
  CssBaseline,
  Typography,
  InputBase,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { agents } from "./Ai_agents";

export default function AimentorPage() {
  const navigate = useNavigate();

  // State for the search query
  const [searchQuery, setSearchQuery] = useState("");

  // Filter agents based on the search query
  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen mb-10">
      <div className="">
        <CssBaseline />
        <Container maxWidth="lg" className="mt-4">
          <Box className="mb-6 text-center">
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              className="bg-gradient-to-r from-pink-500 to-orange-400 text-transparent bg-clip-text"
            >
              Spardha.ai for UPSC
            </Typography>
            <Typography variant="h6" className="text-gray-400">
              Your AI-powered study companions for UPSC preparation
            </Typography>
          </Box>
          <div className="relative mb-4 border-2 border-black rounded-xl">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon className="text-gray-500" />
            </div>
            <InputBase
              placeholder="Search for an AI agent..."
              inputProps={{ "aria-label": "search agents" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
              className="w-full pl-12 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
            />
          </div>
          <Grid container spacing={3} justifyContent="center">
            {filteredAgents.map((agent, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card
                  className="transition-all transform hover:translate-y-[-5px] hover:shadow-lg"
                  onClick={() =>
                    navigate(`/prejoin?usecase_id=${agent.usecase_id}`)
                  }
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={agent.image}
                    alt={agent.name}
                    className="object-cover"
                  />
                  <CardContent className="bg-gray-800 text-white">
                    <Typography variant="h6" className="text-primary">
                      {agent.name}
                    </Typography>
                    <Typography variant="body2" className="text-gray-400">
                      {agent.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>
    </div>
  );
}

// Agents data with images
