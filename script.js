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

  // Preview
  previewBox.innerHTML = `
    <h2>${data.name}</h2>
    <p><strong>Email:</strong> ${data.email} &nbsp;&nbsp; <strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Address:</strong> ${data.address}</p>
    <hr>
    <h3>Family Details</h3>
    <p>Father: ${data.father}<br>Mother: ${data.mother}<br>Sisters: ${data.sisters}<br>Marital Status: ${data.marital}</p>
    <h3>Education</h3><p>${data.education}</p>
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

// PDF Export
downloadBtn.addEventListener("click", () => {
  const data = downloadBtn.data;
  const doc = new jsPDF();
  let y = 10;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(data.name, 10, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Email: ${data.email}        Phone: ${data.phone}`, 10, y);
  y += 6;
  doc.text(`Address: ${data.address}`, 10, y);
  y += 8;

  const section = (title, content) => {
    doc.setFont("helvetica", "bold");
    doc.text(title, 10, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(content, 180);
    doc.text(lines, 10, y);
    y += lines.length * 6 + 2;
  };

  section("Family Details", `Father: ${data.father}\nMother: ${data.mother}\nSisters: ${data.sisters}\nMarital Status: ${data.marital}`);
  section("Education", data.education);
  section("Other Qualifications", data.otherQualifications);
  section("Skills", data.skills);
  section("Experience", data.experience);
  section("Languages Known", data.languages);
  section("Strengths", data.strengths);
  section("Hobbies", data.hobbies);
  section("Job Applied For", data.job);

  doc.save(`${data.name.replace(/\\s+/g, '_')}_Resume.pdf`);
});

// 🔌 DeepSeek Integration
async function getSuggestionsFromDeepSeek(job, skills) {
  const suggestionsBox = document.getElementById("suggestionsBox");
  suggestionsBox.innerHTML = "⏳ Fetching career suggestions...";

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
            content: "You are a career advisor. Suggest useful skills, certifications, and project ideas based on the job and user skills."
          },
          {
            role: "user",
            content: `I'm applying for the job: ${job}. My current skills: ${skills}. Please give a list of improvements to increase my chances of getting hired.`
          }
        ]
      })
    });

    const result = await response.json();
    const message = result.choices?.[0]?.message?.content || "No response.";
    suggestionsBox.innerHTML = `<h3>🧠 Career Suggestions</h3><p>${message.replace(/\\n/g, '<br>')}</p>`;
  } catch (err) {
    console.error("DeepSeek API error:", err);
    suggestionsBox.innerHTML = `<p>⚠️ Failed to load suggestions. Please check your API key or network.</p>`;
  }
}