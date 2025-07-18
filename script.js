document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("resume-form");
  const educationInputs = document.getElementById("education-inputs");
  const suggestionOutput = document.getElementById("suggestions");

  const educationOptions = ["SSC", "HSC", "B.Com", "M.Com", "DTL"];

  // Dynamically add inputs when checkbox is selected
  educationOptions.forEach(level => {
    document.getElementById(level.toLowerCase()).addEventListener("change", function () {
      const divId = `edu-${level.toLowerCase()}`;
      let existing = document.getElementById(divId);
      if (this.checked && !existing) {
        const div = document.createElement("div");
        div.id = divId;
        div.className = "card";
        div.innerHTML = `
          <label>${level} Institute:</label>
          <input type="text" name="${level}_institute">
          <label>${level} Board:</label>
          <input type="text" name="${level}_board">
          <label>${level} Year:</label>
          <input type="text" name="${level}_year">
          <label>${level} Grade / %:</label>
          <input type="text" name="${level}_grade">
        `;
        educationInputs.appendChild(div);
      } else if (!this.checked && existing) {
        existing.remove();
      }
    });
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));

    // Gather education
    data.education = educationOptions.filter(opt => form[opt.toLowerCase()].checked).map(opt => {
      return {
        level: opt,
        institute: form[`${opt}_institute`]?.value || '',
        board: form[`${opt}_board`]?.value || '',
        year: form[`${opt}_year`]?.value || '',
        grade: form[`${opt}_grade`]?.value || ''
      };
    });

    // Generate PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 10;

    doc.setFontSize(18);
    doc.text(`${data.name}'s Resume`, 10, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Email: ${data.email}`, 10, y);
    doc.text(`Phone: ${data.phone}`, 130, y);
    y += 10;
    doc.text(`Address: ${data.address}`, 10, y);
    y += 10;

    doc.setFont(undefined, "bold");
    doc.text("Family Details:", 10, y);
    y += 7;
    doc.setFont(undefined, "normal");
    doc.text(`Father: ${data.father}`, 10, y);
    doc.text(`Mother: ${data.mother}`, 70, y);
    y += 7;
    doc.text(`Sisters: ${data.sisters}`, 10, y);
    doc.text(`Marital: ${data.marital}`, 70, y);
    y += 10;

    doc.setFont(undefined, "bold");
    doc.text("Education:", 10, y);
    y += 7;
    doc.setFont(undefined, "normal");
    data.education.forEach(ed => {
      doc.text(`${ed.level}: ${ed.institute}, ${ed.board}, ${ed.year}, ${ed.grade}`, 10, y);
      y += 7;
    });

    y += 5;
    doc.setFont(undefined, "bold");
    doc.text("Other Qualifications:", 10, y);
    y += 7;
    doc.setFont(undefined, "normal");
    doc.text(`${data.otherQualifications}`, 10, y);
    y += 7;

    doc.setFont(undefined, "bold");
    doc.text("Skills:", 10, y);
    y += 7;
    doc.setFont(undefined, "normal");
    doc.text(`${data.skills}`, 10, y);
    y += 7;

    doc.setFont(undefined, "bold");
    doc.text("Experience:", 10, y);
    y += 7;
    doc.setFont(undefined, "normal");
    doc.text(`${data.experience}`, 10, y);
    y += 7;

    doc.setFont(undefined, "bold");
    doc.text("Languages Known:", 10, y);
    y += 7;
    doc.setFont(undefined, "normal");
    doc.text(`${data.languages}`, 10, y);
    y += 7;

    doc.setFont(undefined, "bold");
    doc.text("Strengths:", 10, y);
    y += 7;
    doc.setFont(undefined, "normal");
    doc.text(`${data.strengths}`, 10, y);
    y += 7;

    doc.setFont(undefined, "bold");
    doc.text("Hobbies:", 10, y);
    y += 7;
    doc.setFont(undefined, "normal");
    doc.text(`${data.hobbies}`, 10, y);
    y += 7;

    doc.setFont(undefined, "bold");
    doc.text("Job Applied For:", 10, y);
    y += 7;
    doc.setFont(undefined, "normal");
    doc.text(`${data.job}`, 10, y);
    y += 10;

    doc.save("resume.pdf");

    // Suggestions from OpenRouter API
    suggestionOutput.innerText = "Thinking...";

    const prompt = `Suggest what user should learn based on education: ${JSON.stringify(data.education)}, skills: ${data.skills}, experience: ${data.experience}, and job: ${data.job}`;

    const headers = {
      "Authorization": "Bearer <YOUR_OPENROUTER_API_KEY>",
      "Content-Type": "application/json",
      "HTTP-Referer": "https://musafir02.github.io/Project",
      "X-Title": "Smart Resume Maker"
    };

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: "openai/gpt-4o",
          messages: [{ role: "user", content: prompt }]
        })
      });

      const result = await response.json();
      const suggestion = result.choices?.[0]?.message?.content || "No suggestion found.";
      suggestionOutput.innerText = suggestion;
    } catch (err) {
      suggestionOutput.innerText = "Failed to fetch suggestion.";
    }
  });
});