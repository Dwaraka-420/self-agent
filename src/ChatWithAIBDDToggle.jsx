import React, { useState, useRef, useEffect } from "react";
import { TextField, Button, Paper, Typography, Box, MenuItem, Select } from "@mui/material";

const API_BASE_URL = "https://l4siovyvze.execute-api.us-east-1.amazonaws.com/Prod";

const ChatAndBDD = () => {
  const [projectName, setProjectName] = useState("");
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState("chat"); // "chat" or "bdd"
  const [bddTestCases, setBddTestCases] = useState("");
  const [showAutomationButton, setShowAutomationButton] = useState(false);
  const [isProjectSet, setIsProjectSet] = useState(false);
  const responseContainerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [automationScriptFile, setAutomationScriptFile] = useState(""); 
  const [showDeployButton, setShowDeployButton] = useState(false);
  const [deployResponse, setDeployResponse] = useState("");

  // ✅ Handle Proceed Button Click
  const handleProceed = () => {
    if (!projectName.trim()) {
      alert("Please enter a project name.");
      return;
    }
    setIsProjectSet(true);
  };
  // ✅ Function to Chat with AI (with polling support)
  const chatWithAI = async () => {
    if (!query.trim() || !projectName.trim()) {
      alert("❌ Project name and query are required!");
      return;
    }

    setLoading(true);
    // setResponses((prev) => [...prev, { type: "chat", query, response: "⏳ Processing AI response... Please wait." }]);

    try {
      // console.log("🟡 Sending Chat Request...", { projectName, query });

      const response = await fetch(`${API_BASE_URL}/chat-with-context`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName, query }),
      });

      if (!response.ok) {
        throw new Error(`❌ API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      // console.log("🔍 Initial API Response:", data);

      if (data.message) {
        // setResponses((prev) => [...prev, { type: "chat", query, response: data.message }]);

        // ✅ Start polling for AI response after 5 seconds
        setTimeout(() => fetchAIResponse(), 5000);
      } else {
        throw new Error("❌ Failed to process AI response.");
      }
    } catch (error) {
      // console.error("❌ Error chatting with AI:", error);
      // setResponses((prev) => [...prev, { type: "chat", query, response: `❌ Error chatting with AI: ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Function to poll AI response from DynamoDB
  const fetchAIResponse = async () => {
    if (!projectName.trim()) {
      alert("❌ Project name is required!");
      return;
    }

    try {
      console.log("🟡 Checking AI response...");
      const response = await fetch(`${API_BASE_URL}/fetch-ai-response?projectName=${projectName}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`❌ API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ AI Response from Polling:", data);

      let aiResponse = "⏳ AI is still processing. Try again later.";
      if (data.response && !data.response.includes("still processing")) {
        aiResponse = `🧠 AI: ${data.response}`;
      }

      setResponses((prev) => [...prev, { type: "chat", query: "Poll for AI response", response: aiResponse }]);
    } catch (error) {
      console.error("❌ Error fetching AI response:", error);
      setResponses((prev) => [...prev, { type: "chat", query, response: "❌ Error fetching AI response." }]);
    }
  };

  // ✅ Function to handle API calls (Calls chatWithAI for "Chat with AI")
  const handleSubmit = async () => {
    if (!query.trim() || !projectName.trim()) {
      alert("Project name and input are required!");
      return;
    }

    if (selectedFeature === "chat") {
      await chatWithAI();
      return;
    }

    // ✅ Generate BDD logic remains unchanged
    let requestBody = { projectName, bddScenario: query };

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/generate-bdd`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      console.log("📩 API Response:", data);

      let formattedResponse = data.bddTestCases
        ? data.bddTestCases.split("\n").map((line) => ` ${line.trim()}`).join("\n")
        : "No response received.";

      setResponses((prev) => [...prev, { type: "bdd", query, response: formattedResponse }]);

      if (data.bddTestCases) {
        setBddTestCases(data.bddTestCases);
        setShowAutomationButton(true);
      }

      setQuery("");
    } catch (error) {
      console.error("Error:", error);
      setResponses((prev) => [...prev, { type: "bdd", query, response: `❌ Error processing request. ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  };



  // ✅ Function to generate automation script
  const generateAutomationScript = async () => {
    if (!bddTestCases.trim()) {
      alert("❌ Please generate BDD test cases first before generating the automation script!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/generate-automation-script`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName, bddTestCases }),
      });

      const data = await res.json();
      console.log("✅ API Response for Automation Script:", data);

      let formattedResponse = data.automationScript
        ? `📜 **Generated Automation Script:**\n\n${data.automationScript}`
        : "❌ Failed to generate automation script.";

      setResponses((prev) => [...prev, { type: "automation", query: "Generated from BDD test cases", response: formattedResponse }]);
      if (data.s3File) {
        setAutomationScriptFile(data.s3File); // ✅ Store the automation script file path
        setShowDeployButton(true); // ✅ Enable Deploy Button
      }
    } catch (error) {
      console.error("❌ API Error:", error);
      setResponses((prev) => [...prev, { type: "automation", query: "Generated from BDD test cases", response: "❌ Error generating automation script." }]);
    }
  };
  // ✅ Function to Validate & Deploy Script via AWS CodeBuild
  const validateAndDeployScript = async () => {
    if (!automationScriptFile) {
      alert("❌ Please generate an automation script first!");
      return;
    }

    setDeployResponse("⏳ Starting validation & deployment via CodeBuild...");

    try {
      const response = await fetch(`${API_BASE_URL}/validating_script`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ s3File: automationScriptFile }),
      });

      if (!response.ok) {
        throw new Error(`❌ API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ CodeBuild Response:", data);

      // ✅ Store response message in state
      setDeployResponse(`✅ CodeBuild started! Check AWS CodeBuild for progress.\nBuild ID: ${data.buildId}`);

      // ✅ Add deploy response to `responses` list
      setResponses((prev) => [
        ...prev,
        { type: "deploy", query: "Validate & Deploy", response: `🚀 ${deployResponse}` },
      ]);
    } catch (error) {
      console.error("❌ Error in validation/deployment:", error);
      setDeployResponse(`❌ Error in validation/deployment: ${error.message}`);

      setResponses((prev) => [
        ...prev,
        { type: "deploy", query: "Validate & Deploy", response: `❌ ${error.message}` },
      ]);
    }
  };



  useEffect(() => {
    if (responseContainerRef.current) {
      responseContainerRef.current.scrollTop = responseContainerRef.current.scrollHeight;
    }
  }, [responses]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", padding: 3 }}>
       {showDeployButton && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button variant="contained" color="success" onClick={validateAndDeployScript}>
            🚀 Validate & Deploy
          </Button>
        </Box>
      )}
      {!isProjectSet && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <Paper elevation={3} sx={{ padding: 4, width: 400, textAlign: "center" }}>
            <Typography variant="h6">Enter Project Name</Typography>
            <TextField
              fullWidth
              label="Project Name"
              variant="outlined"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleProceed}>
              Proceed
            </Button>
          </Paper>
        </Box>
      )}

      {isProjectSet && (
        <>
          <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: "bold" }}>
            Chat with AI / Generate BDD - Project: {projectName}
          </Typography>

          <Paper
            elevation={3}
            ref={responseContainerRef}
            sx={{ flexGrow: 1, overflowY: "auto", maxHeight: "65vh", padding: 2, backgroundColor: "#f9f9f9", borderRadius: 2 }}
          >
            {responses.length > 0 ? (
              responses.map((item, index) => (
                <Box key={index} sx={{ marginBottom: 2 }}>
                  <Typography variant="subtitle2" color="primary">
                    {item.type === "chat"
                      ? "🧑‍💻 Chat Query:"
                      : item.type === "bdd"
                      ? "📝 BDD Scenario:"
                      : "🤖 Automation Script for:"}{" "}
                    {item.query}
                  </Typography>
                  <Typography variant="body1" sx={{ backgroundColor: "#fff", padding: 2, borderRadius: 2, whiteSpace: "pre-line" }}>
                    {item.response}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No messages yet.
              </Typography>
            )}
          </Paper>

          <Paper elevation={3} sx={{ padding: 3, position: "sticky", bottom: 0, width: "100%" }}>
            <Select
              fullWidth
              value={selectedFeature}
              onChange={(e) => {
                setSelectedFeature(e.target.value);
                if (e.target.value === "chat") {
                  setShowAutomationButton(false);
                }
              }}
              sx={{ marginBottom: 2 }}
            >
              <MenuItem value="chat">💬 Chat with AI</MenuItem>
              <MenuItem value="bdd">📝 Generate BDD</MenuItem>
            </Select>

            <TextField fullWidth label="Enter query" variant="outlined" value={query} onChange={(e) => setQuery(e.target.value)} sx={{ marginBottom: 1 }} />

            <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} disabled={loading}>
              {loading ? "Processing..." : selectedFeature === "chat" ? "Chat" : "Generate BDD"}
            </Button>
        {/* ✅ Show "Generate Automation Script" Button ONLY if BDD Test Cases exist & "Generate BDD" is selected */}
        {selectedFeature === "bdd" && showAutomationButton && (
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ marginTop: 2 }}
            onClick={generateAutomationScript}
          >
            🤖 Generate Automation Script
          </Button>
        )}
          </Paper>
        </>
      )}
    </Box>
  );
};

export default ChatAndBDD;
