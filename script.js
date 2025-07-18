document.addEventListener('DOMContentLoaded', () => {
    
  const elements = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    address: document.getElementById('address'),
    father: document.getElementById('father'),
    mother: document.getElementById('mother'),
    marital: document.getElementById('marital'),
    qualifications: document.getElementById('qualifications'),
    skills: document.getElementById('skills'),
    experience: document.getElementById('experience'),
    languages: document.getElementById('languages'),
    strengths: document.getElementById('strengths'),
    hobbies: document.getElementById('hobbies'),
    pdfBtn: document.getElementById('pdf-btn'),
    educationCheckboxes: document.querySelectorAll('input[name="education"]')
  };

  elements.pdfBtn.addEventListener('click', generatePDF);
  
  elements.educationCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const gradeInput = document.querySelector(`.edu-grade[data-for="${checkbox.value}"]`);
      gradeInput.classList.toggle('hidden', !checkbox.checked);
      if (!checkbox.checked) {
        gradeInput.value = '';
      }
    });
  });

  function generatePDF() {
    elements.pdfBtn.disabled = true;
    elements.pdfBtn.innerText = "Generating...";

    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      let y = 20;
      const leftMargin = 15;
      const valueMargin = 70;

      const writeLine = (label, value) => {
        if (value) {
          doc.setFont("helvetica", "bold");
          doc.text(label, leftMargin, y);
          doc.setFont("helvetica", "normal");
          const textLines = doc.splitTextToSize(value, 120);
          doc.text(textLines, valueMargin, y);
          y += (textLines.length * 5) + 5;
        }
      };
      
      const writeSectionHeader = (title) => {
          doc.setFontSize(16);
          doc.setFont("helvetica", "bold");
          doc.text(title, leftMargin, y);
          y += 10;
          doc.setLineWidth(0.5);
          doc.line(leftMargin, y - 5, 200, y - 5);
      };

      doc.setFontSize(22);
      doc.setFont("times", "bold");
      doc.text(elements.name.value, doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
      y += 10;
      
      const contactInfo = `${elements.email.value} | ${elements.phone.value} | ${elements.address.value}`;
      doc.setFontSize(11);
      doc.setFont("times", "normal");
      doc.text(contactInfo, doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
      y += 15;

      const resumeSections = [
        { title: "Personal Details", fields: [
            { label: "Father's Name:", value: elements.father.value },
            { label: "Mother's Name:", value: elements.mother.value },
            { label: "Marital Status:", value: elements.marital.value },
        ]},
        { title: "Skills & Qualifications", fields: [
            { label: "Skills:", value: elements.skills.value },
            { label: "Other Qualifications:", value: elements.qualifications.value },
            { label: "Languages:", value: elements.languages.value },
        ]},
        { title: "Experience", fields: [
            { label: "", value: elements.experience.value },
        ]},
      ];
      
      resumeSections.forEach(section => {
          if (section.fields.some(field => field.value)) {
              writeSectionHeader(section.title);
              section.fields.forEach(field => writeLine(field.label, field.value));
              y += 5;
          }
      });

      const eduData = collectEducationData();
      if (eduData.length > 0) {
        writeSectionHeader("Education");
        doc.autoTable({
          startY: y,
          head: [['Qualification', 'Percentage/CGPA']],
          body: eduData.map(e => [e.degree, e.grade]),
          theme: 'grid',
          headStyles: { fillColor: [76, 76, 255] }
        });
      }
      
      doc.save(`${elements.name.value || 'Resume'}.pdf`);

    } catch(error) {
      console.error("Failed to generate PDF:", error);
      alert("An error occurred while generating the PDF.");
    } finally {
      elements.pdfBtn.disabled = false;
      elements.pdfBtn.innerText = "Generate PDF Resume";
    }
  }

  function collectEducationData() {
    const education = [];
    elements.educationCheckboxes.forEach((cb) => {
      if (cb.checked) {
        const gradeInput = document.querySelector(`.edu-grade[data-for="${cb.value}"]`);
        education.push({ degree: cb.value, grade: gradeInput.value.trim() || "N/A" });
      }
    });
    return education;
  }
});
