// Hard-coded valid users and passwords
const validUsers = {
  "Vivek": "vivek@varanasi",
  "Shubham": "shubham_from_champaran",
  "Peeyush": "peeyush_from_agra"
};

// Get login page elements
const loginForm = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

// Get upload page elements
const userSpan = document.getElementById("userSpan");
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const downloadBtn = document.getElementById("downloadBtn");
const recentFilesList = document.getElementById("recentFilesList");

// Popup elements
const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popupMessage");
const closePopup = document.getElementById("closePopup");
const loader = document.getElementById("loader");
const progressElem = document.querySelector(".progress");

// Recent files array (simulate persistent recent files)
let recentFiles = [];

// ------------------------
// LOGIN PAGE LOGIC
// ------------------------
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    
    // Validate username and password
    if (validUsers[username] && validUsers[username] === password) {
      // Save username and redirect to upload page
      sessionStorage.setItem("loggedInUser", username);
      window.location.href = "upload.html";
    } else {
      errorMsg.textContent = "Invalid username or password.";
    }
  });
}

// ------------------------
// UPLOAD PAGE LOGIC
// ------------------------
if (userSpan) {
  const currentUser = sessionStorage.getItem("loggedInUser");
  if (!currentUser) {
    window.location.href = "index.html";
  } else {
    userSpan.textContent = currentUser;
  }
}

// Helper function to update the Recent Files list in the DOM
function updateRecentFiles() {
  recentFilesList.innerHTML = "";
  recentFiles.slice().reverse().forEach(file => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="file-name">${file.name}</span> <span class="file-date">${file.date}</span>`;
    recentFilesList.appendChild(li);
  });
}

// Simulate progress loader before showing popup
function showPopupWithLoader(message) {
  progressElem.style.width = "0%";
  loader.style.display = "block";
  popupMessage.textContent = "";
  popup.style.display = "flex";
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += 5;
    progressElem.style.width = progress + "%";
    
    if (progress >= 100) {
      clearInterval(interval);
      loader.style.display = "none";
      popupMessage.textContent = message;
    }
  }, 50);
}

// UPLOAD BUTTON LOGIC
if (uploadBtn) {
  uploadBtn.addEventListener("click", () => {
    const currentUser = sessionStorage.getItem("loggedInUser") || "Unknown User";
    let fileName = "DefaultFile.txt";
    
    if (fileInput && fileInput.files.length > 0) {
      fileName = fileInput.files[0].name;
    }
    
    const now = new Date();
    const fileEntry = {
      name: fileName,
      date: now.toLocaleString()
    };
    recentFiles.push(fileEntry);
    updateRecentFiles();
    
    showPopupWithLoader(`File "${fileName}" uploaded successfully by ${currentUser}!`);
  });
}

// DOWNLOAD BUTTON LOGIC
if (downloadBtn) {
  downloadBtn.addEventListener("click", () => {
    const currentUser = sessionStorage.getItem("loggedInUser") || "Unknown User";
    const selectedFile = document.getElementById("fileSelect").value;
    
    if (!selectedFile) {
      alert("Please select a file to download.");
      return;
    }
    
    const now = new Date();
    const fileEntry = {
      name: selectedFile,
      date: now.toLocaleString()
    };
    recentFiles.push(fileEntry);
    updateRecentFiles();
    
    showPopupWithLoader(`File "${selectedFile}" downloaded successfully by ${currentUser}!`);
  });
}

// POPUP LOGIC: Close the popup when the close button is clicked
if (closePopup) {
  closePopup.addEventListener("click", () => {
    popup.style.display = "none";
  });
}
