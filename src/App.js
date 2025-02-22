import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Box, Drawer, List, ListItem, ListItemText, AppBar, Toolbar, Typography } from "@mui/material";
import CreateProject from "./CreateProject";
import ExistingProjects from "./ExistingProject";
import IndexedFiles from "./IndexedFiles";
import ChatWithAIBDDToggle from "./ChatWithAIBDDToggle"; // ✅ Import ChatWithAI_BDD component

const drawerWidth = 300;

const App = () => {
  const [existingProjects, setExistingProjects] = useState([]); // ✅ State for projects
  const [selectedSidebarOption, setSelectedSidebarOption] = useState(""); // ✅ Track selected sidebar option

  return (
    <Router>
      <AppBar position="fixed" sx={{ width: "100%", padding: "8px 16px" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold", color: "white" }}>
            AI Agent
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", marginTop: "64px", height: "calc(100vh - 64px)" }}>
        {/* ✅ Sidebar Positioned Below Navbar */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              marginTop: "81px", // Starts below the navbar
              height: "calc(100vh - 81px)",
            },
          }}
        >
          <List>
            {/* Navigate to Create Project */}
            <ListItem button component={Link} to="/create-project" >
              <ListItemText sx={{marginTop:5}} primary="Create New Project" />
            </ListItem>

            {/* <Divider /> */}

            {/* Existing Projects */}
            <ExistingProjects />

            {/* Navigate to Indexed Files */}
            <ListItem button component={Link} to="/indexed-files">
              <ListItemText primary="📄 Indexed Files" />
            </ListItem>

            {/* Navigate to ChatWithAI_BDD */}
            <ListItem
              button
              component={Link}
              to="/chat-with-ai"
              onClick={() => setSelectedSidebarOption("Chat with AI / BDD")} // ✅ Track selection
            >
              <ListItemText primary="💬 Chat with AI / BDD" />
            </ListItem>
          </List>
        </Drawer>

        {/* Main Content Area */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Routes>
            <Route path="/" element={<div>Select an option from the sidebar</div>} />
            <Route path="/create-project" element={<CreateProject setExistingProjects={setExistingProjects} />} />
            <Route path="/indexed-files" element={<IndexedFiles />} />
            {/* ✅ Pass selectedSidebarOption to ChatWithAIBDDToggle */}
            <Route path="/chat-with-ai" element={<ChatWithAIBDDToggle selectedSidebarOption={selectedSidebarOption} />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

export default App;
