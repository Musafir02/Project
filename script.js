import jsPDF from "https://cdn.skypack.dev/jspdf";

const form = document.getElementById("resumeForm"); const previewBox = document.getElementById("resumePreview"); const downloadBtn = document.getElementById("downloadBtn"); const suggestionsBox = document.getElementById("suggestionsBox");

form.addEventListener("submit", async function (e) { e.preventDefault();

const name = document.getElementById("name").value; const email = document.getElementById("email").value; const phone = document.getElementById("phone").value; const address = document.getElementById("address").value; const father = document.getElementById("father").value; const mother = document.getElementById("mother").value; const sisters = document.getElementById("sisters").value; const marital = document.getElementById("marital").value; const otherQualifications = document.getElementById("otherQualifications").value; const skills = document.getElementById("skills").value; const experience = document.getElementById("experience").value; const languages = document.getElementById("languages").value; const strengths = document.getElementById("strengths").value; const hobbies = document.getElementById("hobbies").value; const job = document.getElementById("job").value;

const selectedQuals = document.querySelectorAll(".edu-check:checked"); let educationArray = [];

selectedQuals.forEach((qual) => { const q = qual.value; const inst = document.querySelector([name='institute-${q}']).value; const board = document.querySelector([name='board-${q}']).value; const year = document.querySelector([name='year-${q}']).value; const grade = document.querySelector([name='grade-${q}']).value; educationArray.push({ qualification: q, institute: inst, board, year, grade }); });

const { jsPDF } = window.jspdf; const doc = new jsPDF(); let y = 10;

doc.setFontSize(16); doc.setFont("helvetica", "bold"); doc.text("RESUME", 105, y, null, null, "center");

y += 10; doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text(name, 10, y); doc.setFont("helvetica", "normal"); doc.text(Email: ${email}, 10, y + 6); doc.text(Phone: ${phone}, 120, y + 6); doc.text(Address: ${address}, 10, y + 12);

y += 24; doc.setFont("helvetica", "bold"); doc.text("Family Details", 10, y); y += 6; doc.setFont("helvetica", "normal"); doc.text(Father's Name: ${father}, 10, y); y += 6; doc.text(Mother's Name: ${mother}, 10, y); y += 6; doc.text(Sisters: ${sisters}, 10, y); y += 6; doc.text(Marital Status: ${marital}, 10, y);

y += 10; doc.setFont("helvetica", "bold"); doc.text("EDUCATION", 10, y); y += 6;

doc.setFont("helvetica", "normal"); doc.autoTable({ startY: y, head: [["Qualification", "Institute", "Board/University", "Year", "Grade"]], body: educationArray.map((edu) => [ edu.qualification, edu.institute, edu.board, edu.year, edu.grade, ]), theme: "grid", styles: { fontSize: 10 }, margin: { left: 10, right: 10 }, });

y = doc.lastAutoTable.finalY + 10;

doc.setFont("helvetica", "bold"); doc.text("Other Qualifications", 10, y); y += 6; doc.setFont("helvetica", "normal"); doc.text(otherQualifications, 10, y);

y += 10; doc.setFont("helvetica", "bold"); doc.text("Skills", 10, y); y += 6; doc.setFont("helvetica", "normal"); doc.text(skills, 10, y);

y += 10; doc.setFont("helvetica", "bold"); doc.text("Experience", 10, y); y += 6; doc.setFont("helvetica", "normal"); doc.text(doc.splitTextToSize(experience, 180), 10, y); y += doc.getTextDimensions(experience).h + 10;

doc.setFont("helvetica", "bold"); doc.text("Languages Known", 10, y); y += 6; doc.setFont("helvetica", "normal"); doc.text(languages, 10, y);

y += 10; doc.setFont("helvetica", "bold"); doc.text("Strengths", 10, y); y += 6; doc.setFont("helvetica", "normal"); doc.text(strengths, 10, y);

y += 10; doc.setFont("helvetica", "bold"); doc.text("Hobbies", 10, y); y += 6; doc.setFont("helvetica", "normal"); doc.text(hobbies, 10, y);

y += 10; doc.setFont("helvetica", "bold"); doc.text("Job Applied For", 10, y); y += 6; doc.setFont("helvetica", "normal"); doc.text(job, 10, y);

doc.save("resume.pdf");

// 🧠 DeepSeek Suggestion Integration suggestionsBox.innerHTML = "<em>Loading suggestions...</em>"; try { const prompt = The user is applying for the job role: ${job}.\n\nHere is their background:\nSkills: ${skills}\nEducation: ${educationArray.map(e => e.qualification).join(", ")}\nExperience: ${experience}\nStrengths: ${strengths}.\n\nSuggest career tips and what to learn to increase chances.;

const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer YOUR_DEEPSEEK_API_KEY"
  },
  body: JSON.stringify({
    model: "deepseek-chat",
    messages: [
      { role: "system", content: "You are a helpful AI career assistant." },
      { role: "user", content: prompt }
    ]
  })
});

const result = await response.json();
const suggestion = result.choices?.[0]?.message?.content || "No suggestion generated.";
suggestionsBox.innerHTML = `<h3>💡 Career Suggestions</h3><p>${suggestion}</p>`;

} catch (error) { console.error("Suggestion error:", error); suggestionsBox.innerHTML = "<strong>Suggestion error:</strong> Unable to get response from DeepSeek."; } });

