const form = document.getElementById("resumeForm");
const resumeBox = document.getElementById("resumePreview");
const suggestionBox = document.getElementById("suggestionsBox");
const downloadBtn = document.getElementById("downloadBtn");
const toggleBtn = document.getElementById("themeToggle");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const dob = document.getElementById("dob").value;
  const education = document.getElementById("education").value;
  const skills = document.getElementById("skills").value;
  const job = document.getElementById("job").value;

  const preview = `
    <h2>${name}</h2>
    <p><strong>DOB:</strong> ${dob}</p>
    <p><strong>Education:</strong><br>${education.replace(/\n/g, "<br>")}</p>
    <p><strong>Skills:</strong> ${skills}</p>
    <p><strong>Applying for:</strong> ${job}</p>
  `;
  resumeBox.innerHTML = preview;
  downloadBtn.classList.remove("hidden");

  // Optional: call DeepSeek R1 API here for smarter suggestions
  const suggestions = getSuggestions(job);
  suggestionBox.innerHTML = `<h3>Suggestions:</h3><ul>${suggestions.map(s => `<li>${s}</li>`).join("")}</ul>`;
});

function getSuggestions(job) {
  const database = {
    "java developer": ["Learn Spring Boot", "Understand REST APIs", "Practice DSA", "Build GitHub Projects"],
    "frontend developer": ["Master JavaScript", "Learn React or Vue", "Responsive Design", "Practice UI/UX"],
    "data analyst": ["Excel & SQL", "Learn Python (Pandas)", "Power BI / Tableau", "Build Dashboards"],
  };
  return database[job.toLowerCase()] || ["Explore job requirements on LinkedIn", "Work on real-world projects", "Improve communication skills"];
}

downloadBtn.addEventListener("click", () => {
  const text = resumeBox.innerText;
  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "My_Resume.txt";
  link.click();
});

// Theme toggle
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});