// ======= Elements =======
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");
const skillsInput = document.getElementById("skills");
const experienceInput = document.getElementById("experience");
const strengthsInput = document.getElementById("strengths");
const hobbiesInput = document.getElementById("hobbies");

const previewName = document.getElementById("preview-name");
const previewContact = document.getElementById("preview-contact");
const previewEducation = document.getElementById("preview-education");
const previewSkills = document.getElementById("preview-skills");
const previewExperience = document.getElementById("preview-experience");
const previewStrengths = document.getElementById("preview-strengths");
const previewHobbies = document.getElementById("preview-hobbies");

const addEducationBtn = document.getElementById("add-education-btn");
const educationEntries = document.getElementById("education-entries");

// ======= Live Updates =======
function updatePreview() {
  previewName.textContent = nameInput.value || "Your Name";
  previewContact.textContent =
    `${emailInput.value || ""} ${phoneInput.value || ""} ${addressInput.value || ""}`.trim();

  const skills = skillsInput.value.trim().split("\n").filter(Boolean);
  previewSkills.innerHTML = skills.length
    ? `<ul>${skills.map(s => `<li>${s}</li>`).join("")}</ul>`
    : `<p class="placeholder-text">Your skills will appear here.</p>`;

  const exp = experienceInput.value.trim().split("\n").filter(Boolean);
  previewExperience.innerHTML = exp.length
    ? `<ul>${exp.map(e => `<li>${e}</li>`).join("")}</ul>`
    : `<p class="placeholder-text">Your experience will appear here.</p>`;

  const str = strengthsInput.value.trim().split("\n").filter(Boolean);
  previewStrengths.innerHTML = str.length
    ? `<ul>${str.map(s => `<li>${s}</li>`).join("")}</ul>`
    : `<p class="placeholder-text">Your strengths will appear here.</p>`;

  const hob = hobbiesInput.value.trim().split("\n").filter(Boolean);
  previewHobbies.innerHTML = hob.length
    ? `<ul>${hob.map(h => `<li>${h}</li>`).join("")}</ul>`
    : `<p class="placeholder-text">Your hobbies will appear here.</p>`;
}

// Attach live update listeners
document.querySelectorAll(".live-update").forEach(input =>
  input.addEventListener("input", updatePreview)
);

// ======= Education Entries =======
function createEducationEntry() {
  const container = document.createElement("div");
  container.className = "edu-entry";
  container.style.marginBottom = "1rem";

  const degree = document.createElement("input");
  degree.placeholder = "Degree (e.g. BTech)";
  degree.className = "edu-degree";
  degree.style.marginRight = "5px";

  const college = document.createElement("input");
  college.placeholder = "Institute Name";
  college.className = "edu-college";
  college.style.marginRight = "5px";

  const score = document.createElement("input");
  score.placeholder = "CGPA or %";
  score.className = "edu-score";

  const remove = document.createElement("button");
  remove.innerText = "❌";
  remove.style.marginLeft = "8px";
  remove.addEventListener("click", () => {
    container.remove();
    renderEducation();
  });

  [degree, college, score].forEach(input =>
    input.addEventListener("input", renderEducation)
  );

  container.append(degree, college, score, remove);
  educationEntries.appendChild(container);
}

// Render all education entries to preview
function renderEducation() {
  const entries = document.querySelectorAll(".edu-entry");
  if (!entries.length) {
    previewEducation.innerHTML = `<p class="placeholder-text">Your education will appear here.</p>`;
    return;
  }

  const html = Array.from(entries).map(entry => {
    const degree = entry.querySelector(".edu-degree").value;
    const college = entry.querySelector(".edu-college").value;
    const score = entry.querySelector(".edu-score").value;
    return `<p><strong>${degree}</strong> - ${college} (${score})</p>`;
  }).join("");

  previewEducation.innerHTML = html;
}

addEducationBtn.addEventListener("click", () => {
  createEducationEntry();
  renderEducation();
});

// ======= Theme Toggle =======
document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// ======= PDF Download =======
document.getElementById("pdf-btn").addEventListener("click", async () => {
  const btn = document.getElementById("pdf-btn");
  const spinner = btn.querySelector(".spinner");
  const text = btn.querySelector(".btn-text");

  spinner?.classList.remove("hidden");
  text?.classList.add("hidden");

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text(`Resume - ${nameInput.value}`, 10, 10);
  doc.html(document.querySelector(".resume-paper"), {
    callback: function (doc) {
      doc.save(`${nameInput.value || "resume"}.pdf`);
      spinner?.classList.add("hidden");
      text?.classList.remove("hidden");
    },
    x: 10,
    y: 20
  });
});