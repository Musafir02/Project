// script.js
import jsPDF from "https://cdn.skypack.dev/jspdf";

const form = document.getElementById("resumeForm");
const suggestionOutput = document.getElementById("suggestionOutput");
const downloadBtn = document.getElementById("downloadBtn");

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  suggestionOutput.innerHTML = "<em>Loading suggestions...</em>";

  const name = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const father = document.getElementById("father").value;
  const mother = document.getElementById("mother").value;
  const sisters = document.getElementById("sisters").value;
  const marital = document.getElementById("marital").value;
  const otherQualifications = document.getElementById("otherQualifications").value;
  const skills = document.getElementById("skills").value;
  const experience = document.getElementById("experience").value;
  const languages = document.getElementById("languages").value;
  const strengths = document.getElementById("strengths").value;
  const hobbies = document.getElementById("hobbies").value;
  const job = document.getElementById("job").value;

  const selectedQuals = document.querySelectorAll(".edu-check:checked");
  let educationArray = [];

  selectedQuals.forEach((qual) => {
    const q = qual.value;
    const inst = document.querySelector(`[name='institute-${q}']`)?.value || "";
    const board = document.querySelector(`[name='board-${q}']`)?.value || "";
    const year = document.querySelector(`[name='year-${q}']`)?.value || "";
    const grade = document.querySelector(`[name='grade-${q}']`)?.value || "";
    educationArray.push({ qualification: q, institute: inst, board, year, grade });
  });

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 10;

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("RESUME", 105, y, null, null, "center");
  y += 10;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(name, 10, y);
  doc.setFont("helvetica", "normal");
  doc.text(`Email: ${email}`, 10, y + 6);
  doc.text(`Phone: ${phone}`, 120, y + 6);
  doc.text(`Address: ${address}`, 10, y + 12);

  y += 26;
  doc.setFont("helvetica", "bold");
  doc.text("Family Details", 10, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.text(`Father's Name: ${father}`, 10, y);
  y += 6;
  doc.text(`Mother's Name: ${mother}`, 10, y);
  y += 6;
  doc.text(`Sisters: ${sisters}`, 10, y);
  y += 6;
  doc.text(`Marital Status: ${marital}`, 10, y);

  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Education", 10, y);
  y += 6;
  doc.autoTable({
    startY: y,
    head: [["Qualification", "Institute", "Board/University", "Year", "Grade"]],
    body: educationArray.map(e => [e.qualification, e.institute, e.board, e.year, e.grade]),
    theme: "grid",
    margin: { left: 10, right: 10 },
    styles: { fontSize: 10 }
  });

  y = doc.lastAutoTable.finalY + 10;
  doc.setFont("helvetica", "bold");
  doc.text("Other Details", 10, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.text(`Other Qualifications: ${otherQualifications}`, 10, y);
  y += 6;
  doc.text(`Skills: ${skills}`, 10, y);
  y += 6;
  doc.text(`Experience: ${experience}`, 10, y);
  y += 6;
  doc.text(`Languages Known: ${languages}`, 10, y);
  y += 6;
  doc.text(`Strengths: ${strengths}`, 10, y);
  y += 6;
  doc.text(`Hobbies: ${hobbies}`, 10, y);
  y += 10;
  doc.text(`Job Applied For: ${job}`, 10, y);

  doc.save("resume.pdf");
  downloadBtn.classList.remove("hidden");

  // Suggestion API (DeepSeek)
  try {
    const prompt = `The user is applying for ${job}. Skills: ${skills}. Education: ${educationArray.map(e => e.qualification).join(", ")}. Experience: ${experience}. Suggest improvements.`;

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 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"
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "You are an expert career coach." },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    const suggestion = data.choices?.[0]?.message?.content || "No suggestions found.";
    suggestionOutput.innerHTML = `<div class='card animate-fade-in'><p>${suggestion}</p></div>`;
  } catch (err) {
    suggestionOutput.innerHTML = `<p style='color:red;'>❌ Failed to get suggestions from DeepSeek.</p>`;
  }
});