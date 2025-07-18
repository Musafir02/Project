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

function updatePreview() {
  previewName.textContent = nameInput.value || "Your Name";
  previewContact.textContent = `${emailInput.value} | ${phoneInput.value} | ${addressInput.value}`.trim();
  previewSkills.innerHTML = formatList(skillsInput.value, "Your skills will appear here.");
  previewExperience.innerHTML = formatList(experienceInput.value, "Your experience will appear here.");
  previewStrengths.innerHTML = formatList(strengthsInput.value, "Your strengths will appear here.");
  previewHobbies.innerHTML = formatList(hobbiesInput.value, "Your hobbies will appear here.");
}
function formatList(text, placeholder) {
  const lines = text.trim().split("\n").filter(Boolean);
  return lines.length ? `<ul>${lines.map(item => `<li>${item}</li>`).join("")}</ul>` : `<p class="placeholder-text">${placeholder}</p>`;
}
document.querySelectorAll(".live-update").forEach(input => input.addEventListener("input", updatePreview));

const addEducationBtn = document.getElementById("add-education-btn");
const educationEntries = document.getElementById("education-entries");
addEducationBtn.addEventListener("click", () => {
  const container = document.createElement("div");
  container.className = "edu-entry";
  container.innerHTML = `
    <input placeholder="Qualification" class="edu-degree" />
    <input placeholder="Institute" class="edu-college" />
    <input placeholder="University/Board" class="edu-year" />
    <input placeholder="Year" class="edu-score" />
    <input placeholder="Grade" class="edu-grade" />
  `;
  educationEntries.appendChild(container);
  container.querySelectorAll("input").forEach(i => i.addEventListener("input", renderEducation));
  renderEducation();
});
function renderEducation() {
  const entries = document.querySelectorAll(".edu-entry");
  if (!entries.length) {
    previewEducation.innerHTML = `<p class="placeholder-text">Your education will appear here.</p>`;
    return;
  }
  const html = Array.from(entries).map(entry => {
    const d = entry.querySelector(".edu-degree").value;
    const c = entry.querySelector(".edu-college").value;
    const y = entry.querySelector(".edu-year").value;
    const yr = entry.querySelector(".edu-score").value;
    const g = entry.querySelector(".edu-grade").value;
    return `<p><strong>${d}</strong> - ${c}, ${y} (${yr}, ${g})</p>`;
  }).join("");
  previewEducation.innerHTML = html;
}

document.getElementById("clear-btn").addEventListener("click", () => {
  if (confirm("Clear all form data?")) {
    document.getElementById("resume-form").reset();
    educationEntries.innerHTML = "";
    updatePreview();
    renderEducation();
  }
});

document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Generate PDF
document.getElementById("pdf-btn").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const name = nameInput.value;
  const email = emailInput.value;
  const phone = phoneInput.value;
  const address = addressInput.value;

  doc.setFontSize(16);
  doc.text(name, 20, 20);
  doc.setFontSize(12);
  doc.text("RESUME", 105, 20, { align: "center" });
  doc.setFontSize(10);
  doc.text(address, 150, 20, { align: "right" });
  doc.text("WhatsApp No: " + phone, 150, 26, { align: "right" });
  doc.text("Email: " + email, 150, 32, { align: "right" });

  doc.setFontSize(12);
  doc.text("EDUCATION", 20, 45);
  const education = [];
  document.querySelectorAll(".edu-entry").forEach(entry => {
    const qual = entry.querySelector(".edu-degree").value;
    const inst = entry.querySelector(".edu-college").value;
    const uni = entry.querySelector(".edu-year").value;
    const year = entry.querySelector(".edu-score").value;
    const grade = entry.querySelector(".edu-grade").value;
    education.push([qual, inst, uni, year, grade]);
  });
  doc.autoTable({
    head: [["Qualification", "Institute", "University/Board", "Year", "Grade"]],
    body: education,
    startY: 50,
    theme: "grid",
    styles: { fontSize: 10 }
  });

  let y = doc.lastAutoTable.finalY + 10;
  y = writeSection(doc, "SKILLS", skillsInput.value, y);
  y = writeSection(doc, "EXPERIENCE", experienceInput.value, y);
  y = writeSection(doc, "STRENGTHS", strengthsInput.value, y);
  writeSection(doc, "HOBBIES", hobbiesInput.value, y);
  doc.save("resume.pdf");
});

function writeSection(doc, title, content, yOffset) {
  doc.setFontSize(12);
  doc.text(title, 20, yOffset);
  doc.setFontSize(10);
  const lines = content.trim().split("\n").filter(Boolean);
  lines.forEach((line, i) => {
    doc.text("• " + line, 25, yOffset + 6 + (i * 6));
  });
  return yOffset + 12 + (lines.length * 6);
}