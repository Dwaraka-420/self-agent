import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paper, TextField, Button, List, ListItem, ListItemText, Collapse, Typography, CircularProgress, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const API_BASE_URL = "https://l4siovyvze.execute-api.us-east-1.amazonaws.com/Prod";

const IndexedFiles = () => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [indexedFiles, setIndexedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const fetchIndexedFiles = async () => {
    if (!projectName.trim()) {
      setError("❌ Project name is required!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/fetch-files?projectName=${projectName}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) throw new Error(`Error fetching files. Status: ${res.status}`);

      const data = await res.json();
      console.log("Indexed Files API Response:", data);

      if (data.files && Array.isArray(data.files)) {
        setIndexedFiles(data.files);
      } else {
        setIndexedFiles([]);
      }
    } catch (error) {
      console.error("Error fetching indexed files:", error);
      setError("❌ Failed to fetch indexed files.");
    }

    setLoading(false);
  };

  return (
    <Box sx={{ width: "100%", height: "100vh", padding: 4 }}>
      <Paper elevation={3} sx={{ padding: 3, maxWidth: "1000px", marginBottom: 3 }}>
        {/* Project Name Input */}
        <TextField
          fullWidth
          label="Enter Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
          margin="normal"
        />

        {/* Load Indexed Files Button */}
        <Button variant="contained" color="primary" onClick={fetchIndexedFiles} sx={{ marginBottom: 2 }}>
          Load Indexed Files
        </Button>

        {/* Clickable Title for Expand/Collapse */}
        <Typography
          variant="h6"
          style={{ cursor: "pointer", display: "flex", alignItems: "center", marginTop: "10px" }}
          onClick={() => setOpen(!open)}
        >
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />} View Indexed Files
        </Typography>

        <Collapse in={open}>
          <List component="nav">
            {loading ? (
              <ListItem>
                <CircularProgress size={24} />
                <ListItemText primary="Loading..." />
              </ListItem>
            ) : error ? (
              <ListItem>
                <ListItemText primary={error} style={{ color: "red" }} />
              </ListItem>
            ) : indexedFiles.length > 0 ? (
              indexedFiles.map((file, index) => (
                <ListItem key={index} button>
                  <ListItemText primary={`📄 ${file.file_name}`} />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No indexed files found for this project." />
              </ListItem>
            )}
          </List>
        </Collapse>
      </Paper>
    </Box>
  );
};

export default IndexedFiles;
