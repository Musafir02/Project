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

  // Resume preview
  const htmlPreview = `
    <h2>${data.name}</h2>
    <p><strong>Email:</strong> ${data.email} | <strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Address:</strong> ${data.address}</p>
    <hr/>
    <h3>👪 Family Details</h3>
    <p>Father: ${data.father} <br>Mother: ${data.mother} <br>Sisters: ${data.sisters} <br>Marital Status: ${data.marital}</p>

    <h3>🎓 Education</h3>
    <p>${data.education.replace(/\\n/g, '<br>')}</p>

    <h3>📜 Other Qualifications</h3>
    <p>${data.otherQualifications.replace(/\\n/g, '<br>')}</p>

    <h3>💼 Skills</h3>
    <p>${data.skills}</p>

    <h3>🧾 Experience</h3>
    <p>${data.experience.replace(/\\n/g, '<br>')}</p>

    <h3>🌐 Languages Known</h3>
    <p>${data.languages}</p>

    <h3>💪 Strengths</h3>
    <p>${data.strengths}</p>

    <h3>🎯 Hobbies</h3>
    <p>${data.hobbies}</p>

    <h3>🔎 Applying For</h3>
    <p>${data.job}</p>
  `;
  previewBox.innerHTML = htmlPreview;
  downloadBtn.classList.remove("hidden");
  downloadBtn.data = data;

  // AI Career Suggestions
  await getSuggestionsFromDeepSeek(data.job, data.skills);
});

// Generate PDF
downloadBtn.addEventListener("click", () => {
  const data = downloadBtn.data;
  const doc = new jsPDF();
  const margin = 10;
  let y = 10;

  const addSection = (title, content) => {
    doc.setFont("helvetica", "bold");
    doc.text(title, margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(content, 180);
    doc.text(lines, margin, y);
    y += lines.length * 6 + 2;
  };

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(data.name, margin, y);
  y += 8;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Email: ${data.email}    Phone: ${data.phone}`, margin, y);
  y += 6;
  doc.text(`Address: ${data.address}`, margin, y);
  y += 8;

  addSection("Family Details", `Father: ${data.father}\nMother: ${data.mother}\nSisters: ${data.sisters}\nMarital Status: ${data.marital}`);
  addSection("Education", data.education);
  addSection("Other Qualifications", data.otherQualifications);
  addSection("Skills", data.skills);
  addSection("Experience", data.experience);
  addSection("Languages Known", data.languages);
  addSection("Strengths", data.strengths);
  addSection("Hobbies", data.hobbies);
  addSection("Job Applied For", data.job);

  doc.save(`${data.name.replace(/\\s+/g, '_')}_Resume.pdf`);
});

// DeepSeek AI Suggestion
async function getSuggestionsFromDeepSeek(job, skills) {
  const suggestionsBox = document.getElementById("suggestionsBox");
  suggestionsBox.innerHTML = "<p>⏳ Generating suggestions using AI...</p>";

  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are a helpful career coach who suggests missing skills and improvements to help someone get hired based on the job role and their current skills."
          },
          {
            role: "user",
            content: `I'm applying for a ${job} position. My current skills are: ${skills}. What skills, courses, or projects should I work on to improve my chances of getting hired?`
          }
        ]
      })
    });

    const data = await response.json();
    const suggestion = data.choices?.[0]?.message?.content || "No suggestions received.";
    suggestionsBox.innerHTML = `<h3>🤖 Career Suggestions</h3><p>${suggestion.replace(/\\n/g, '<br>')}</p>`;
  } catch (err) {
    suggestionsBox.innerHTML = `<p>⚠️ Failed to load suggestions. Please try again later.</p>`;
    console.error(err);
  }
}