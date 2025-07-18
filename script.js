// script.js

function generateSuggestions() {
  const job = document.getElementById("job").value;
  const skills = document.getElementById("skills").value;
  const experience = document.getElementById("experience").value;

  const prompt = `The user wants to apply for the job role '${job}' with skills '${skills}' and experience '${experience}'. Suggest 5 skills, certifications, or topics to learn to be more competitive.`;

  document.getElementById("suggestions").innerText = "Generating suggestions...";

  fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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",
      "Content-Type": "application/json",
      "HTTP-Referer": "https://musafir02.github.io/Project",
      "X-Title": "Smart Resume Maker"
    },
    body: JSON.stringify({
      model: "openai/gpt-4o",
      messages: [{ role: "user", content: prompt }]
    })
  })
    .then(res => res.json())
    .then(data => {
      const text = data.choices?.[0]?.message?.content || "No suggestions found.";
      document.getElementById("suggestions").innerText = text;
    })
    .catch(() => {
      document.getElementById("suggestions").innerText = "Failed to fetch suggestions.";
    });
}

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 10;

  function write(label, value) {
    doc.setFont("helvetica", "bold");
    doc.text(label, 10, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, 60, y);
    y += 10;
  }

  write("Name:", document.getElementById("name").value);
  write("Email:", document.getElementById("email").value);
  write("Phone:", document.getElementById("phone").value);
  write("Address:", document.getElementById("address").value);
  write("Father:", document.getElementById("father").value);
  write("Mother:", document.getElementById("mother").value);
  write("Sisters:", document.getElementById("sisters").value);
  write("Marital Status:", document.getElementById("marital").value);

  // Education table
  doc.setFont("helvetica", "bold");
  doc.text("Education", 10, y);
  y += 10;
  const edu = collectEducationData();
  doc.autoTable({
    startY: y,
    head: [["Qualification", "Percentage/CGPA"]],
    body: edu.map(e => [e.degree, e.grade]),
    theme: 'grid'
  });
  y = doc.previousAutoTable.finalY + 10;

  write("Other Qualifications:", document.getElementById("qualifications").value);
  write("Skills:", document.getElementById("skills").value);
  write("Experience:", document.getElementById("experience").value);
  write("Languages:", document.getElementById("languages").value);
  write("Strengths:", document.getElementById("strengths").value);
  write("Hobbies:", document.getElementById("hobbies").value);
  write("Job Role:", document.getElementById("job").value);

  doc.save("Resume.pdf");
}

function collectEducationData() {
  const education = [];
  document.querySelectorAll('input[name="education"]:checked').forEach((cb) => {
    const grade = document.querySelector(`.edu-grade[data-for="${cb.value}"]`).value.trim();
    education.push({ degree: cb.value, grade: grade || "N/A" });
  });
  return education;
}

// Toggle education grade inputs
const educationCheckboxes = document.querySelectorAll('input[name="education"]');
educationCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const gradeInput = document.querySelector(`.edu-grade[data-for="${checkbox.value}"]`);
    if (checkbox.checked) {
      gradeInput.classList.remove("hidden");
    } else {
      gradeInput.classList.add("hidden");
      gradeInput.value = "";
    }
  });
});