const form = document.getElementById("resumeForm");
const previewBox = document.getElementById("resumePreview");
const downloadBtn = document.getElementById("downloadBtn");
const { jsPDF } = window.jspdf;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const get = id => document.getElementById(id).value;

  const data = {
    name: get("name"),
    email: get("email"),
    phone: get("phone"),
    address: get("address"),
    father: get("father"),
    mother: get("mother"),
    sisters: get("sisters"),
    marital: get("marital"),
    education: get("education"),
    otherQualifications: get("otherQualifications"),
    skills: get("skills"),
    experience: get("experience"),
    languages: get("languages"),
    strengths: get("strengths"),
    hobbies: get("hobbies"),
    job: get("job")
  };

  previewBox.innerHTML = `
    <h2>${data.name}</h2>
    <p><strong>Email:</strong> ${data.email} &nbsp;&nbsp; <strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Address:</strong> ${data.address}</p>
    <hr>
    <h3>Family Details</h3>
    <ul>
      <li><strong>Father:</strong> ${data.father}</li>
      <li><strong>Mother:</strong> ${data.mother}</li>
      <li><strong>Sisters:</strong> ${data.sisters}</li>
      <li><strong>Marital Status:</strong> ${data.marital}</li>
    </ul>
    <h3>Education</h3>
    <p>${data.education}</p>
    <h3>Other Qualifications</h3><p>${data.otherQualifications}</p>
    <h3>Skills</h3><p>${data.skills}</p>
    <h3>Experience</h3><p>${data.experience}</p>
    <h3>Languages Known</h3><p>${data.languages}</p>
    <h3>Strengths</h3><p>${data.strengths}</p>
    <h3>Hobbies</h3><p>${data.hobbies}</p>
    <h3>Job Applied For</h3><p>${data.job}</p>
  `;

  downloadBtn.classList.remove("hidden");
  downloadBtn.data = data;

  await getSuggestionsFromDeepSeek(data.job, data.skills);
});

// PDF Export with professional formatting
downloadBtn.addEventListener("click", () => {
  const data = downloadBtn.data;
  const doc = new jsPDF();
  let y = 10;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("RESUME", 105, y, { align: "center" });
  y += 10;

  // Top Section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(data.name, 10, y);
  doc.setFont("helvetica", "normal");
  y += 6;
  doc.text(`WhatsApp No.: ${data.phone}`, 10, y);
  y += 6;
  doc.text(`E-mail: ${data.email}`, 10, y);
  y += 6;
  doc.text(data.address, 10, y);
  y += 8;
  doc.line(10, y, 200, y);
  y += 6;

  const section = (title, content) => {
    doc.setFont("helvetica", "bold");
    doc.text(title, 10, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(content, 190);
    doc.text(lines, 10, y);
    y += lines.length * 6 + 4;
  };

  // Sections
  section("Family Details", `• Fathers Name: ${data.father}\n• Mothers Name: ${data.mother}\n• Sisters: ${data.sisters}\n• Marital Status: ${data.marital}`);

  // Education table (static headers + dynamic rows from textarea)
  doc.setFont("helvetica", "bold");
  doc.text("EDUCATION:", 10, y);
  y += 6;

  const headers = ["Qualification", "Institute", "University", "Year", "Grade"];
  const rows = data.education.split("\\n").map(line => line.split("|"));
  doc.setFontSize(10);
  headers.forEach((h, i) => doc.text(h, 10 + i * 40, y));
  y += 6;
  doc.setFont("helvetica", "normal");
  rows.forEach(row => {
    row.forEach((cell, i) => doc.text(cell.trim(), 10 + i * 40, y));
    y += 6;
  });
  y += 4;

  section("Other Qualification", data.otherQualifications);
  section("SKILLS", data.skills);
  section("Experience", data.experience);
  section("Language Known", data.languages);
  section("STRENGTHS", data.strengths);
  section("Hobbies", data.hobbies);
  section("Job Applied For", data.job);

  doc.save(`${data.name.replace(/\\s+/g, '_')}_Resume.pdf`);
});

// AI Skill Suggestions (DeepSeek)
async function getSuggestionsFromDeepSeek(job, skills) {
  const box = document.getElementById("suggestionsBox");
  box.innerHTML = "<p>⏳ Generating suggestions...</p>";

  try {
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer YOUR_REAL_API_KEY",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are a helpful career advisor that gives practical suggestions to improve resume and job readiness."
          },
          {
            role: "user",
            content: `I'm applying for ${job}. My skills: ${skills}. What should I learn, build, or do to get hired?`
          }
        ]
      })
    });

    const json = await res.json();
    const msg = json.choices?.[0]?.message?.content || "No suggestion received.";
    box.innerHTML = `<h3>🧠 Career Suggestions</h3><p>${msg.replace(/\\n/g, '<br>')}</p>`;
  } catch (e) {
    console.error(e);
    box.innerHTML = "<p>⚠️ Could not fetch suggestions. Check your API key or internet.</p>";
  }
}