// import React, { useState } from "react";
// import { TextField, Button, Select, MenuItem, Paper, Typography } from "@mui/material";

// const API_BASE_URL = "https://l4siovyvze.execute-api.us-east-1.amazonaws.com/Prod";

// const CreateProject = ({ setExistingProjects }) => {
//   const [projectName, setProjectName] = useState("");
//   const [folderType, setFolderType] = useState("brds");
//   const [file, setFile] = useState(null);

//   const createProject = async () => {
//     if (!projectName.trim()) {
//       alert("Project name is required!");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/create-project`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ projectName }),
//       });

//       const data = await response.json();
//       if (data.error) throw new Error(data.error);

//       // Add new project dynamically
//       setExistingProjects((prev) => [...prev, projectName]);
//       setProjectName(""); // Clear input field
//       alert("✅ Project Created Successfully!");
//     } catch (error) {
//       alert(`❌ Error: ${error.message}`);
//     }
//   };

//   const uploadFile = async () => {
//     if (!file || !projectName) {
//       alert("Please select a file and enter a project name.");
//       return;
//     }

//     try {
//       // Step 1: Request Pre-Signed URL
//       const res = await fetch(`${API_BASE_URL}/generate-presigned-url`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ projectName, folderType, fileName: file.name }),
//       });

//       const { uploadURL, s3Key } = await res.json();

//       // Step 2: Upload File to S3
//       await fetch(uploadURL, {
//         method: "PUT",
//         headers: { "Content-Type": "application/octet-stream" },
//         body: file,
//       });

//       alert(`✅ File uploaded successfully to ${s3Key}`);
//     } catch (error) {
//       alert(`❌ Error Uploading File: ${error.message}`);
//     }
//   };

//   return (
//     <Paper elevation={3} sx={{ padding: 3 }}>
//       <Typography variant="h6">Create New Project</Typography>
//       <TextField
//         fullWidth
//         label="Enter project name"
//         variant="outlined"
//         value={projectName}
//         onChange={(e) => setProjectName(e.target.value)}
//         sx={{ mt: 1 }}
//       />
//       <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={createProject}>
//         Create Project
//       </Button>

//       <Typography variant="h6" sx={{ mt: 3 }}>Upload Files</Typography>
//       <Select fullWidth value={folderType} onChange={(e) => setFolderType(e.target.value)} sx={{ mt: 1 }}>
//         <MenuItem value="brds">BRDs</MenuItem>
//         <MenuItem value="codebase">Codebase</MenuItem>
//       </Select>
//       <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{ marginTop: "10px" }} />
//       <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={uploadFile}>
//         Upload File
//       </Button>
//     </Paper>
//   );
// };

// export default CreateProject;


// import React, { useState } from "react";
// import { TextField, Button, Select, MenuItem, Paper, Typography, Alert, Box } from "@mui/material";

// const API_BASE_URL = "https://l4siovyvze.execute-api.us-east-1.amazonaws.com/Prod";

// const CreateProject = ({ setExistingProjects }) => {
//   const [projectName, setProjectName] = useState("");
//   const [isProjectCreated, setIsProjectCreated] = useState(false);
//   const [folderType, setFolderType] = useState("brds");
//   const [file, setFile] = useState(null);
//   const [projectMessage, setProjectMessage] = useState("");
//   const [projectMessageType, setProjectMessageType] = useState("success");
//   const [uploadMessage, setUploadMessage] = useState("");
//   const [uploadMessageType, setUploadMessageType] = useState("success");

//   // ✅ Create Project Function
//   const createProject = async () => {
//     if (!projectName.trim()) {
//       setProjectMessage("⚠️ Project name is required!");
//       setProjectMessageType("error");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/create-project`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ projectName }),
//       });

//       const data = await response.json();
//       if (data.error) throw new Error(data.error);

//       setExistingProjects((prev) => [...prev, projectName]); // ✅ Add to Sidebar
//       setIsProjectCreated(true); // ✅ Show Upload Section
//       setProjectMessage("✅ Project Created Successfully!");
//       setProjectMessageType("success");
//     } catch (error) {
//       setProjectMessage(`❌ Error: ${error.message}`);
//       setProjectMessageType("error");
//     }
//   };

//   // ✅ Upload File Function
//   const uploadFile = async () => {
//     if (!file || !isProjectCreated) {
//       setUploadMessage("⚠️ Please create a project first before uploading files.");
//       setUploadMessageType("error");
//       return;
//     }

//     try {
//       // Step 1: Request Pre-Signed URL
//       const res = await fetch(`${API_BASE_URL}/generate-presigned-url`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ projectName, folderType, fileName: file.name }),
//       });

//       const { uploadURL, s3Key } = await res.json();

//       // Step 2: Upload File to S3
//       await fetch(uploadURL, {
//         method: "PUT",
//         headers: { "Content-Type": "application/octet-stream" },
//         body: file,
//       });

//       setUploadMessage(`✅ File uploaded successfully to ${s3Key}`);
//       setUploadMessageType("success");
//       setFile(null); // ✅ Clear file input
//     } catch (error) {
//       setUploadMessage(`❌ Error Uploading File: ${error.message}`);
//       setUploadMessageType("error");
//     }
//   };

//   return (
//     <Paper elevation={3} sx={{ padding: 3 }}>
//       <Typography variant="h6">Create New Project</Typography>

//       {/* ✅ Project Name Field (Disabled After Creation) */}
//       <TextField
//         fullWidth
//         label="Enter project name"
//         variant="outlined"
//         value={projectName}
//         onChange={(e) => setProjectName(e.target.value)}
//         disabled={isProjectCreated} // ✅ Prevent changing name after creation
//         sx={{ mt: 1 }}
//       />

//       <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={createProject} disabled={isProjectCreated}>
//         Create Project
//       </Button>

//       {/* ✅ Success/Error Message for Project Creation */}
//       {projectMessage && (
//         <Box sx={{ mt: 2 }}>
//           <Alert severity={projectMessageType}>{projectMessage}</Alert>
//         </Box>
//       )}

//       {/* ✅ Upload Files Section - Appears Only After Project is Created */}
//       {isProjectCreated && (
//         <>
//           <Typography variant="h6" sx={{ mt: 4 }}>Upload Files</Typography>
//           <Select fullWidth value={folderType} onChange={(e) => setFolderType(e.target.value)} sx={{ mt: 1 }}>
//             <MenuItem value="brds">BRDs</MenuItem>
//             <MenuItem value="codebase">Codebase</MenuItem>
//           </Select>

//           <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{ marginTop: "10px" }} />

//           <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={uploadFile}>
//             Upload File
//           </Button>

//           {/* ✅ Success/Error Message for File Upload */}
//           {uploadMessage && (
//             <Box sx={{ mt: 2 }}>
//               <Alert severity={uploadMessageType}>{uploadMessage}</Alert>
//             </Box>
//           )}
//         </>
//       )}
//     </Paper>
//   );
// };

// export default CreateProject;
// import React, { useState } from "react";
// import { TextField, Button, Select, MenuItem, Paper, Typography, Alert, Box } from "@mui/material";

// const API_BASE_URL = "https://l4siovyvze.execute-api.us-east-1.amazonaws.com/Prod";

// const CreateProject = ({ setExistingProjects }) => {
//   const [projectName, setProjectName] = useState("");
//   const [isProjectCreated, setIsProjectCreated] = useState(false);
//   const [folderType, setFolderType] = useState("brds");
//   const [uploadMessage, setUploadMessage] = useState("");
//   const [uploadMessageType, setUploadMessageType] = useState("success");

//   // ✅ Create Project Function
//   const createProject = async () => {
//     if (!projectName.trim()) {
//       setUploadMessage("⚠️ Project name is required!");
//       setUploadMessageType("error");
//       return;
//     }

//     const safeProjectName = projectName.trim();

//     try {
//       const response = await fetch(`${API_BASE_URL}/create-project`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ projectName: safeProjectName }),
//       });

//       const data = await response.json();
//       if (data.error) throw new Error(data.error);

//       setExistingProjects((prev) => [...prev, safeProjectName]);
//       setIsProjectCreated(true);
//       setUploadMessage("✅ Project Created Successfully!");
//       setUploadMessageType("success");
//     } catch (error) {
//       setUploadMessage(`❌ Error: ${error.message}`);
//       setUploadMessageType("error");
//     }
//   };

//   // ✅ Upload Files & Folders Function
//   const uploadFiles = async () => {
//     const fileInput = document.getElementById("fileUpload");
//     const files = Array.from(fileInput.files);
//     const safeProjectName = projectName.trim();

//     if (!files.length || !safeProjectName) {
//       setUploadMessage("⚠️ Please select files/folders and enter a project name.");
//       setUploadMessageType("error");
//       return;
//     }

//     const filePaths = files.map(file => file.webkitRelativePath || file.name);

//     console.log("📁 Uploading files for project:", safeProjectName);
//     console.log("Selected Files:", files);
//     console.log("File Paths Sent to Backend:", filePaths);

//     try {
//       // Step 1: Request Pre-Signed URLs
//       const res = await fetch(`${API_BASE_URL}/generate-presigned-url`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ projectName: safeProjectName, folderType, filePaths }),
//       });

//       if (!res.ok) {
//         throw new Error(`Failed to get signed URLs. Status: ${res.status}`);
//       }

//       const { uploadURLs } = await res.json();

//       // Step 2: Upload Files to Pre-Signed URLs
//       for (const file of files) {
//         const filePath = file.webkitRelativePath || file.name;
//         if (uploadURLs[filePath]) {
//           await fetch(uploadURLs[filePath], {
//             method: "PUT",
//             headers: { "Content-Type": "application/octet-stream" },
//             body: file,
//           });
//         }
//       }

//       setUploadMessage("✅ Files and folders uploaded successfully!");
//       setUploadMessageType("success");
//     } catch (error) {
//       console.error("❌ Upload Error:", error);
//       setUploadMessage(`❌ Error Uploading Files: ${error.message}`);
//       setUploadMessageType("error");
//     }
//   };

//   return (
//     <Paper elevation={3} sx={{ padding: 3 }}>
//       <Typography variant="h6">Create New Project</Typography>

//       {/* ✅ Project Name Input */}
//       <TextField
//         fullWidth
//         label="Enter project name"
//         variant="outlined"
//         value={projectName}
//         onChange={(e) => setProjectName(e.target.value)}
//         disabled={isProjectCreated}
//         sx={{ mt: 1 }}
//       />

//       <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={createProject} disabled={isProjectCreated}>
//         Create Project
//       </Button>

//       {/* ✅ Success/Error Messages */}
//       {uploadMessage && (
//         <Box sx={{ mt: 2 }}>
//           <Alert severity={uploadMessageType}>{uploadMessage}</Alert>
//         </Box>
//       )}

//       {/* ✅ File Upload Section (Visible After Project Creation) */}
//       {isProjectCreated && (
//         <>
//           <Typography variant="h6" sx={{ mt: 4 }}>Upload Files / Folders</Typography>
//           <Select fullWidth value={folderType} onChange={(e) => setFolderType(e.target.value)} sx={{ mt: 1 }}>
//             <MenuItem value="brds">BRDs</MenuItem>
//             <MenuItem value="codebase">Codebase</MenuItem>
//           </Select>

//           <input type="file" id="fileUpload" multiple webkitdirectory directory style={{ marginTop: "10px" }} />

//           <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={uploadFiles}>
//             Upload Files
//           </Button>

//           {/* ✅ Success/Error Message for File Upload */}
//           {uploadMessage && (
//             <Box sx={{ mt: 2 }}>
//               <Alert severity={uploadMessageType}>{uploadMessage}</Alert>
//             </Box>
//           )}
//         </>
//       )}
//     </Paper>
//   );
// };

// export default CreateProject;
import React, { useState } from "react";
import { TextField, Button, Select, MenuItem, Paper, Typography, Alert, Box } from "@mui/material";

const API_BASE_URL = "https://l4siovyvze.execute-api.us-east-1.amazonaws.com/Prod";

const CreateProject = ({ setExistingProjects }) => {
  const [projectName, setProjectName] = useState("");
  const [isProjectCreated, setIsProjectCreated] = useState(false);
  const [folderType, setFolderType] = useState("brds");
  const [projectMessage, setProjectMessage] = useState("");
  const [projectMessageType, setProjectMessageType] = useState("success");
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadMessageType, setUploadMessageType] = useState("success");

  // ✅ Create Project Function
  const createProject = async () => {
    if (!projectName.trim()) {
      setProjectMessage("⚠️ Project name is required!");
      setProjectMessageType("error");
      return;
    }

    const safeProjectName = projectName.trim();

    try {
      const response = await fetch(`${API_BASE_URL}/create-project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName: safeProjectName }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setExistingProjects((prev) => [...prev, safeProjectName]);
      setIsProjectCreated(true);
      setProjectMessage("✅ Project Created Successfully!");
      setProjectMessageType("success");
    } catch (error) {
      setProjectMessage(`❌ Error: ${error.message}`);
      setProjectMessageType("error");
    }
  };

  // ✅ Upload Files & Folders Function
  const uploadFiles = async () => {
    const fileInput = document.getElementById("fileUpload");
    const files = Array.from(fileInput.files);
    const safeProjectName = projectName.trim();

    if (!files.length || !safeProjectName) {
      setUploadMessage("⚠️ Please select files/folders and enter a project name.");
      setUploadMessageType("error");
      return;
    }

    const filePaths = files.map(file => file.webkitRelativePath || file.name);

    try {
      // Step 1: Request Pre-Signed URLs
      const res = await fetch(`${API_BASE_URL}/generate-presigned-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName: safeProjectName, folderType, filePaths }),
      });

      if (!res.ok) {
        throw new Error(`Failed to get signed URLs. Status: ${res.status}`);
      }

      const { uploadURLs } = await res.json();

      // Step 2: Upload Files to Pre-Signed URLs
      for (const file of files) {
        const filePath = file.webkitRelativePath || file.name;
        if (uploadURLs[filePath]) {
          await fetch(uploadURLs[filePath], {
            method: "PUT",
            headers: { "Content-Type": "application/octet-stream" },
            body: file,
          });
        }
      }

      setUploadMessage("✅ Files and folders uploaded successfully!");
      setUploadMessageType("success");
    } catch (error) {
      setUploadMessage(`❌ Error Uploading Files: ${error.message}`);
      setUploadMessageType("error");
    }
  };

  return (
    <>
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
    <Paper elevation={3} sx={{ padding: 4, width: 400, textAlign: "center" }}>
      <Typography variant="h6">Create New Project</Typography>

      {/* ✅ Project Name Input */}
      <TextField
        fullWidth
        label="Enter project name"
        variant="outlined"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        disabled={isProjectCreated}
        sx={{ mt: 1 }}
      />

      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={createProject} disabled={isProjectCreated}>
        Create Project
      </Button>

      {/* ✅ Project Creation Message */}
      {projectMessage && (
        <Box sx={{ mt: 2 }}>
          <Alert severity={projectMessageType}>{projectMessage}</Alert>
        </Box>
      )}

      {/* ✅ File Upload Section (Visible After Project Creation) */}
      {isProjectCreated && (
        <>
          <Typography variant="h6" sx={{ mt: 4 }}>Upload Files / Folders</Typography>
          <Select fullWidth value={folderType} onChange={(e) => setFolderType(e.target.value)} sx={{ mt: 1 }}>
            <MenuItem value="brds">BRDs</MenuItem>
            <MenuItem value="codebase">Codebase</MenuItem>
          </Select>

          <input type="file" id="fileUpload" multiple webkitdirectory directory style={{ marginTop: "10px" }} />

          <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={uploadFiles}>
            Upload Files
          </Button>

          {/* ✅ File Upload Success/Error Message */}
          {uploadMessage && (
            <Box sx={{ mt: 2 }}>
              <Alert severity={uploadMessageType}>{uploadMessage}</Alert>
            </Box>
          )}
        </>
      )}
    </Paper>
    </Box>
    </>
  );
};

export default CreateProject;
