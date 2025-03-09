// script.js
document.addEventListener("DOMContentLoaded", function () {
  const sidebarItems = document.querySelectorAll(".sidebar-menu .menu-item");
  const contentSections = document.querySelectorAll(".content-section");

  // Retrieve last active section or default to "dashboard"
  const validSections = ["dashboard", "candidates", "resume-upload"];
  const savedSection = localStorage.getItem("activeSection");
  const defaultSection = validSections.includes(savedSection)
    ? savedSection
    : "dashboard";

  // Hide all sections and show only the last active one
  contentSections.forEach((section) => section.classList.remove("active"));
  document.getElementById(`${defaultSection}-section`).classList.add("active");

  // Function to handle sidebar clicks
  function handleSidebarClick(event) {
    event.preventDefault();

    // Remove active class from all sections
    sidebarItems.forEach((item) => item.classList.remove("active"));
    contentSections.forEach((section) => section.classList.remove("active"));

    // Set clicked section as active
    const targetSection = this.getAttribute("data-section");
    localStorage.setItem("activeSection", targetSection); // Store in localStorage

    document
      .querySelector(`[data-section="${targetSection}"]`)
      .classList.add("active");
    document.getElementById(`${targetSection}-section`).classList.add("active");
  }

  // Add click event listeners to sidebar items
  sidebarItems.forEach((item) => {
    item.addEventListener("click", handleSidebarClick);
  });

  // Resume Upload Section Logic
  const fileInput = document.getElementById("fileInput");
  const fileUpload = document.getElementById("fileUpload");
  const uploadText = document.getElementById("uploadText");
  const uploadHint = document.getElementById("uploadHint");
  const filePreview = document.getElementById("filePreview");
  const fileNameDisplay = document.getElementById("fileName");
  const removeFileBtn = document.getElementById("removeFile");

  fileInput.addEventListener("change", function () {
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];

      // Update UI
      fileUpload.classList.add("uploaded");
      uploadText.style.display = "none";
      uploadHint.style.display = "none";
      filePreview.style.display = "block";
      fileNameDisplay.textContent = `Uploaded: ${file.name}`;
    }
  });

  removeFileBtn.addEventListener("click", function () {
    // Clear file input
    fileInput.value = "";

    // Reset UI
    fileUpload.classList.remove("uploaded");
    uploadText.style.display = "block";
    uploadHint.style.display = "block";
    filePreview.style.display = "none";
  });
});

function resetResumeUploadSection() {
  const fileInput = document.getElementById("fileInput");
  const fileUpload = document.getElementById("fileUpload");
  const uploadText = document.getElementById("uploadText");
  const uploadHint = document.getElementById("uploadHint");
  const filePreview = document.getElementById("filePreview");
  const statusMessage = document.getElementById("statusMessage");
  const jobDesc = document.getElementById("jd");

  // Clear file input
  fileInput.value = "";

  // Reset UI
  fileUpload.classList.remove("uploaded");
  uploadText.style.display = "block";
  uploadHint.style.display = "block";
  filePreview.style.display = "none";
  statusMessage.textContent = "";
  jobDesc.value = "";
}

async function uploadResume() {
  const uploadButton = document.getElementById("uploadButton");
  const loadingSpinner = document.getElementById("loadingSpinner");
  const statusMessage = document.getElementById("statusMessage");
  const fileInput = document.getElementById("fileInput");
  const jobDesc = document.getElementById("jd");

  // Show loading spinner and disable button
  loadingSpinner.style.display = "block";
  statusMessage.style.display = "none";
  uploadButton.disabled = true;

  // Validate file and job description
  if (!fileInput.files[0] || !jobDesc.value.trim()) {
    alert("Please upload a resume and enter a job description.");

    // Reset spinner and button state
    loadingSpinner.style.display = "none";
    uploadButton.disabled = false;
    return;
  }

  let formData = new FormData();
  formData.append("resume", fileInput.files[0]);
  formData.append("job_desc", jobDesc.value);

  try {
    let response = await fetch("https://hiresync-backend.onrender.com/upload", {
      method: "POST",
      body: formData,
    });

    let result = await response.json();

    // Show success message
    statusMessage.textContent =
      "Resume processed successfully! Match Score: " + result.score;
    statusMessage.style.display = "block";
    statusMessage.classList.remove("error");

    // Debugging: Log server response
    // console.log("Server Response:", result);

    // Refresh candidate list and update count
    fetchCandidates();
  } catch (error) {
    console.error("Error uploading resume:", error);
    document.getElementById("scoreDisplay").innerText =
      "Error processing resume.";

    // Show error message
    statusMessage.textContent = "Error processing resume. Please try again.";
    statusMessage.style.display = "block";
    statusMessage.classList.add("error");
  } finally {
    // Re-enable the upload button and hide the loading spinner
    uploadButton.disabled = false;
    loadingSpinner.style.display = "none";
    resetResumeUploadSection();
    alert("Score updated, check your dashboard");
  }
}

async function fetchCandidates() {
  try {
    let response = await fetch(
      "https://hiresync-backend.onrender.com/candidates"
    );
    let candidates = await response.json();
    // console.log("Candidates fetched:", candidates);

    // Update the candidate table
    let candidatesTableBody = document.querySelector("#candidates-tab tbody");
    candidatesTableBody.innerHTML = ""; // Clear previous content

    candidates.forEach((candidate) => {
      let row = document.createElement("tr");

      // Populate the row with candidate data
      row.innerHTML = `
        <td>${candidate.name}</td>
        <td><div class="match-score ${getMatchScoreClass(
          candidate.match_score
        )}">${candidate.match_score}%</div></td>
        <td>${
          candidate.applied_on || new Date().toLocaleDateString()
        }</td> <!-- Use actual applied date if available -->
        <td>
            <div class="action-btn delete-btn" onclick="deleteCandidate('${
              candidate.name
            }')">
              <i class="fas fa-trash"></i>
            </div>
          </div>
        </td>
      `;

      candidatesTableBody.appendChild(row);
    });

    // Calculate and display the number of candidates
    const candidateCount = candidates.length;
    document.querySelector(".stat-card .stat-value").innerText = candidateCount;

    // Calculate and display the highest score
    const highestScore = calculateHighestScore(candidates);
    document.querySelectorAll(".stat-card .stat-value")[1].innerText =
      highestScore; // Update the "Highest Score" stat
  } catch (error) {
    console.error("Error fetching candidates:", error);
    document.querySelector(".stat-card .stat-value").innerText = "Error";
    document.querySelectorAll(".stat-card .stat-value")[1].innerText = "Error"; // Handle error for highest score
  }
}

// Function to delete a candidate
async function deleteCandidate(candidateName) {
  if (confirm("Are you sure you want to delete this candidate?")) {
    try {
      let response = await fetch(
        `https://hiresync-backend.onrender.com/candidates/${candidateName}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Candidate deleted successfully!");
        // Refresh the candidate list
        fetchCandidates();
      } else {
        alert("Failed to delete candidate. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting candidate:", error);
      alert("An error occurred while deleting the candidate.");
    }
  }
}

// Helper function to calculate the highest score from the candidate list
function calculateHighestScore(candidates) {
  if (candidates.length === 0) return 0; // If no candidates, return 0

  let highestScore = candidates[0].match_score;
  for (let i = 1; i < candidates.length; i++) {
    if (candidates[i].match_score > highestScore) {
      highestScore = candidates[i].match_score;
    }
  }
  return highestScore;
}

// Helper function to determine the match score class (e.g., high-match, medium-match)
function getMatchScoreClass(score) {
  if (score >= 90) return "high-match";
  if (score >= 70) return "medium-match";
  return "low-match";
}

// Ensure the page loads with the latest candidates
document.addEventListener("DOMContentLoaded", fetchCandidates);
