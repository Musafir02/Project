// ========== Element Selectors ==========
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

// ========== Live Update Preview ==========
function updatePreview() {
  previewName.textContent = nameInput.value || "Your Name";
  previewContact.textContent =
    `${emailInput.value || ""} | ${phoneInput.value || ""} | ${addressInput.value || ""}`.trim();

  previewSkills.innerHTML = formatList(skillsInput.value, "Your skills will appear here.");
  previewExperience.innerHTML = formatList(experienceInput.value, "Your experience will appear here.");
  previewStrengths.innerHTML = formatList(strengthsInput.value, "Your strengths will appear here.");
  previewHobbies.innerHTML = formatList(hobbiesInput.value, "Your hobbies will appear here.");
}

function formatList(text, placeholder) {
  const items = text.trim().split("\n").filter(Boolean);
  return items.length ? `<ul>${items.map(item => `<li>${item}</li>`).join("")}</ul>` : `<p class="placeholder-text">${placeholder}</p>`;
}

document.querySelectorAll(".live-update").forEach(input =>
  input.addEventListener("input", updatePreview)
);

// ========== Education Section ==========
function createEducationEntry() {
  const container = document.createElement("div");
  container.className = "edu-entry";
  container.style.marginBottom = "1rem";

  const degree = createInput("Degree (e.g. BTech)", "edu-degree");
  const college = createInput("Institute Name", "edu-college");
  const year = createInput("Year", "edu-year");
  const score = createInput("CGPA or %", "edu-score");

  const remove = document.createElement("button");
  remove.innerText = "❌";
  remove.style.marginLeft = "8px";
  remove.addEventListener("click", () => {
    container.remove();
    renderEducation();
  });

  [degree, college, year, score].forEach(input =>
    input.addEventListener("input", renderEducation)
  );

  container.append(degree, college, year, score, remove);
  educationEntries.appendChild(container);
}

function createInput(placeholder, className) {
  const input = document.createElement("input");
  input.placeholder = placeholder;
  input.className = className;
  input.style.marginRight = "5px";
  return input;
}

function renderEducation() {
  const entries = document.querySelectorAll(".edu-entry");
  if (!entries.length) {
    previewEducation.innerHTML = `<p class="placeholder-text">Your education will appear here.</p>`;
    return;
  }

  const html = Array.from(entries).map(entry => {
    const degree = entry.querySelector(".edu-degree").value;
    const college = entry.querySelector(".edu-college").value;
    const year = entry.querySelector(".edu-year").value;
    const score = entry.querySelector(".edu-score").value;
    return `<p><strong>${degree}</strong> - ${college} (${year}, ${score})</p>`;
  }).join("");

  previewEducation.innerHTML = html;
}

addEducationBtn.addEventListener("click", () => {
  createEducationEntry();
  renderEducation();
});

// ========== PDF Download ==========
document.getElementById("pdf-btn").addEventListener("click", () => {
  const resume = document.querySelector(".resume-paper");
  if (!resume) return alert("Resume preview not found!");

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "pt", "a4");

  pdf.html(resume, {
    callback: function (doc) {
      doc.save("resume.pdf");
    },
    x: 20,
    y: 20,
    html2canvas: {
      scale: 1,
      useCORS: true
    }
  });
});

// ========== Clear Form ==========
document.getElementById("clear-btn").addEventListener("click", () => {
  if (confirm("Clear all form data?")) {
    document.getElementById("resume-form").reset();
    document.querySelectorAll(".edu-entry").forEach(e => e.remove());
    updatePreview();
    renderEducation();
  }
});

// ========== Chatbot ==========
async function sendChat() {
  const input = document.getElementById("chat-input");
  const messages = document.getElementById("chatbox-messages");
  const userMsg = input.value.trim();
  if (!userMsg) return;

  messages.innerHTML += `<div><strong>You:</strong> ${userMsg}</div>`;
  input.value = "...";

  try {
    const res = await fetch("http://localhost:5000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg })
    });
    const data = await res.json();
    messages.innerHTML += `<div><strong>AI:</strong> ${data.reply}</div>`;
    input.value = "";
  } catch (err) {
    messages.innerHTML += `<div><strong>AI:</strong> Error connecting to server.</div>`;
    input.value = "";
  }

  messages.scrollTop = messages.scrollHeight;
}

// ========== Theme Toggle ==========
document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});