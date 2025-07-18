// ---------- Element Refs ----------
const nameInput       = document.getElementById("name");
const emailInput      = document.getElementById("email");
const phoneInput      = document.getElementById("phone");
const addressInput    = document.getElementById("address");
const dobInput        = document.getElementById("dob");
const skillsInput     = document.getElementById("skills");
const experienceInput = document.getElementById("experience");
const strengthsInput  = document.getElementById("strengths");
const hobbiesInput    = document.getElementById("hobbies");

const previewName       = document.getElementById("preview-name");
const previewContact    = document.getElementById("preview-contact");
const previewEducation  = document.getElementById("preview-education");
const previewSkills     = document.getElementById("preview-skills");
const previewExperience = document.getElementById("preview-experience");
const previewStrengths  = document.getElementById("preview-strengths");
const previewHobbies    = document.getElementById("preview-hobbies");

// ---------- Live Preview ----------
function formatList(text, placeholder) {
  const items = text.trim().split("\n").filter(Boolean);
  return items.length
    ? `<ul>${items.map(i => `<li>${i}</li>`).join("")}</ul>`
    : `<p class="placeholder-text">${placeholder}</p>`;
}

function updatePreview() {
  previewName.textContent = nameInput.value || "Your Name";

  const gender  = document.querySelector('input[name="gender"]:checked')?.value;
  const marital = document.querySelector('input[name="marital"]:checked')?.value;
  const extras  = [];
  if (dobInput.value) extras.push(`DOB: ${dobInput.value}`);
  if (gender)         extras.push(gender);
  if (marital)        extras.push(marital);

  previewContact.textContent =
    `${emailInput.value} | ${phoneInput.value} | ${addressInput.value}` +
    (extras.length ? `\n${extras.join(" | ")}` : "");

  previewSkills.innerHTML     = formatList(skillsInput.value,     "Your skills will appear here.");
  previewExperience.innerHTML = formatList(experienceInput.value, "Your experience will appear here.");
  previewStrengths.innerHTML  = formatList(strengthsInput.value,  "Your strengths will appear here.");
  previewHobbies.innerHTML    = formatList(hobbiesInput.value,    "Your hobbies will appear here.");
}

document.querySelectorAll(".live-update").forEach(el =>
  el.addEventListener("input", updatePreview)
);

// ---------- Education ----------
const educationContainer = document.getElementById("education-entries");

document.getElementById("add-education-btn").addEventListener("click", addEducationEntry);

function addEducationEntry() {
  const div = document.createElement("div");
  div.className = "edu-entry";
  div.innerHTML = `
    <select class="edu-type">
      <option value="SSC">SSC</option>
      <option value="HSC">HSC</option>
      <option value="Degree">Degree</option>
    </select>
    <input placeholder="Institute" class="edu-college" />
    <input placeholder="Year"      class="edu-year" />
    <input placeholder="Percentage" class="edu-score" />
    <button class="remove-edu">❌</button>
  `;

  const typeSelect = div.querySelector(".edu-type");
  const scoreInput = div.querySelector(".edu-score");

  function syncPlaceholder() {
    scoreInput.placeholder = typeSelect.value === "Degree" ? "CGPA" : "Percentage";
  }
  typeSelect.addEventListener("change", () => {
    syncPlaceholder();
    renderEducation();
  });
  syncPlaceholder();

  div.querySelectorAll("input, select").forEach(el =>
    el.addEventListener("input", renderEducation)
  );
  div.querySelector(".remove-edu").addEventListener("click", () => {
    div.remove();
    renderEducation();
  });

  educationContainer.appendChild(div);
  renderEducation();
}

function renderEducation() {
  const entries = document.querySelectorAll(".edu-entry");
  if (!entries.length) {
    previewEducation.innerHTML = `<p class="placeholder-text">Your education will appear here.</p>`;
    return;
  }

  let html = "";
  entries.forEach(entry => {
    const type    = entry.querySelector(".edu-type").value;
    const college = entry.querySelector(".edu-college").value;
    const year    = entry.querySelector(".edu-year").value;
    const score   = entry.querySelector(".edu-score").value;
    const label   = type === "Degree" ? "CGPA" : "%";
    html += `<p><strong>${type}</strong> - ${college} (${year}, ${label}: ${score})</p>`;
  });
  previewEducation.innerHTML = html;
}

// ---------- PDF ----------
document.getElementById("pdf-btn").addEventListener("click", () => {
  const resume = document.getElementById("resume-paper");
  html2pdf().from(resume).set({
    margin: 0.5,
    filename: `${nameInput.value || 'resume'}.pdf`,
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
  }).save();
});

// ---------- Clear ----------
document.getElementById("clear-btn").addEventListener("click", () => {
  if (confirm("Clear all form data?")) {
    document.getElementById("resume-form").reset();
    educationContainer.innerHTML = "";
    updatePreview();
    renderEducation();
  }
});

// ---------- Chatbot ----------
async function sendChat() {
  const input = document.getElementById("chat-input");
  const messages = document.getElementById("chatbox-messages");
  const text = input.value.trim();
  if (!text) return;

  messages.innerHTML += `<div><strong>You:</strong> ${text}</div>`;
  input.value = "...";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });
    const data = await res.json();
    messages.innerHTML += `<div><strong>AI:</strong> ${data.reply}</div>`;
  } catch (e) {
    messages.innerHTML += `<div><strong>AI:</strong> ⚠️ Server error.</div>`;
  }
  input.value = "";
  messages.scrollTop = messages.scrollHeight;
}

// ---------- Theme ----------
document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Initial render
updatePreview();
renderEducation();