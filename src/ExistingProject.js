import React, { useState } from "react";
import { List, ListItem, ListItemText, Collapse, Typography } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import RefreshIcon from "@mui/icons-material/Refresh"; // Load icon

const API_BASE_URL = "https://l4siovyvze.execute-api.us-east-1.amazonaws.com/Prod";

const ViewProjects = () => {
  const [projects, setProjects] = useState([]); // Store project list
  const [open, setOpen] = useState(false); // Toggle dropdown visibility

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/list-projects`);
      const data = await response.json();

      if (data.projects) {
        setProjects(data.projects); // Store projects in state
      } else {
        setProjects([]); // No projects found
      }
    } catch (error) {
      console.error("❌ Error loading projects:", error);
    }
  };

  return (
    <List>
      {/* View Projects - Click to Load & Expand */}
      <ListItem button onClick={() => {
        fetchProjects(); // Fetch projects on click
        setOpen(!open);  // Toggle dropdown
      }}>
        <ListItemText primary=" View Projects" />
        <RefreshIcon sx={{ ml: 1 }} /> {/* Load icon */}
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      {/* Project List - Appears as a Dropdown */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <ListItem key={index} button>
              <ListItemText 
                primary={project.project_name} 
                secondary={`Created: ${new Date(project.created_at * 1000).toLocaleString()}`} 
              />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No projects available" />
          </ListItem>
        )}
      </Collapse>
    </List>
  );
};

export default ViewProjects;
