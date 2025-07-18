document.addEventListener('DOMContentLoaded', () => {

    const ResumeBuilder = {
        
        init() {
            this.cacheDOMElements();
            this.bindEvents();
            this.updatePreview();
        },

        cacheDOMElements() {
            this.form = document.getElementById('resume-form');
            this.pdfBtn = document.getElementById('pdf-btn');
            this.addEducationBtn = document.getElementById('add-education-btn');
            this.educationEntries = document.getElementById('education-entries');
            this.preview = {
                name: document.getElementById('preview-name'),
                contact: document.getElementById('preview-contact'),
                education: document.getElementById('preview-education'),
                skills: document.getElementById('preview-skills'),
                experience: document.getElementById('preview-experience'),
                strengths: document.getElementById('preview-strengths'),
                hobbies: document.getElementById('preview-hobbies')
            };
        },

        bindEvents() {
            this.form.addEventListener('input', this.updatePreview.bind(this));
            this.pdfBtn.addEventListener('click', this.generatePDF.bind(this));
            this.addEducationBtn.addEventListener('click', this.addEducationEntry.bind(this));
            this.educationEntries.addEventListener('click', (e) => {
                if (e.target.classList.contains('remove-btn')) {
                    e.target.closest('.education-entry').remove();
                    this.updatePreview();
                }
            });
        },

        getFormValues() {
            const values = {};
            const formElements = this.form.elements;
            ['name', 'email', 'phone', 'address', 'skills', 'experience', 'strengths', 'hobbies'].forEach(id => {
                values[id] = formElements[id].value.trim();
            });

            values.education = Array.from(document.querySelectorAll('.education-entry')).map(entry => ({
                qualification: entry.querySelector('[name="qualification"]').value,
                institute: entry.querySelector('[name="institute"]').value,
                board: entry.querySelector('[name="board"]').value,
                year: entry.querySelector('[name="year"]').value,
                grade: entry.querySelector('[name="grade"]').value,
            }));
            return values;
        },

        updatePreview() {
            const values = this.getFormValues();
            
            this.preview.name.innerText = values.name || 'Your Name';
            this.preview.contact.innerText = [values.address, values.phone, values.email].filter(Boolean).join('\n');
            
            const createList = (text) => text.split('\n').filter(Boolean).map(item => `<li>${item}</li>`).join('');

            ['skills', 'experience', 'strengths', 'hobbies'].forEach(key => {
                if (values[key]) {
                    this.preview[key].innerHTML = `<h4>${key.toUpperCase()}</h4><ul>${createList(values[key])}</ul>`;
                } else {
                    this.preview[key].innerHTML = `<h4>${key.toUpperCase()}</h4><p class="placeholder-text">Your ${key} will appear here.</p>`;
                }
            });

            if (values.education.length > 0) {
                let tableHTML = `<table class="preview-education-table"><thead><tr><th>Qualification</th><th>Institute</th><th>Board</th><th>Year</th><th>Grade</th></tr></thead><tbody>`;
                values.education.forEach(edu => {
                    tableHTML += `<tr><td>${edu.qualification}</td><td>${edu.institute}</td><td>${edu.board}</td><td>${edu.year}</td><td>${edu.grade}</td></tr>`;
                });
                tableHTML += `</tbody></table>`;
                this.preview.education.innerHTML = tableHTML;
            } else {
                this.preview.education.innerHTML = `<p class="placeholder-text">Your education will appear here.</p>`;
            }
        },

        addEducationEntry() {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'education-entry';
            entryDiv.innerHTML = `
                <input type="text" name="qualification" placeholder="Qualification (e.g., B.Com)">
                <input type="text" name="institute" placeholder="Institute Name">
                <input type="text" name="board" placeholder="University / Board">
                <input type="text" name="year" placeholder="Year of Passing">
                <input type="text" name="grade" placeholder="Grade / Percentage">
                <button type="button" class="remove-btn">Remove</button>
            `;
            this.educationEntries.appendChild(entryDiv);
        },

        generatePDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
            const values = this.getFormValues();

            const leftMargin = 15, rightMargin = 210 - 15;
            let y = 20;

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.text("RESUME", doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
            y += 15;

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(24);
            doc.text(values.name, leftMargin, y);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            const contactInfo = [values.address, `WhatsApp No: ${values.phone}`, `Email: ${values.email}`].filter(Boolean).join('\n');
            doc.text(contactInfo, rightMargin, y, { align: 'right' });
            y += 15;

            const addSection = (title, content) => {
                if (content && content.trim()) {
                    doc.setFontSize(12);
                    doc.setFont('helvetica', 'bold');
                    doc.text(title.toUpperCase(), leftMargin, y);
                    doc.line(leftMargin, y + 1, rightMargin, y + 1);
                    y += 8;
                    
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(10);
                    const items = content.split('\n').filter(Boolean);
                    items.forEach(item => {
                        const splitItem = doc.splitTextToSize(`• ${item}`, rightMargin - leftMargin - 5);
                        doc.text(splitItem, leftMargin, y);
                        y += (splitItem.length * 4) + 2;
                    });
                    y += 5;
                }
            };
            
            if (values.education.length > 0) {
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text("EDUCATION", leftMargin, y);
                doc.line(leftMargin, y + 1, rightMargin, y + 1);
                y += 8;

                const head = [['Qualification', 'Institute', 'University/Board', 'Year', 'Grade']];
                const body = values.education.map(edu => [edu.qualification, edu.institute, edu.board, edu.year, edu.grade]);
                
                doc.autoTable({
                    startY: y, head: head, body: body,
                    headStyles: { fillColor: [51, 51, 51], textColor: 255 },
                    theme: 'grid',
                    margin: { left: leftMargin },
                    tableWidth: rightMargin - leftMargin,
                });
                y = doc.autoTable.previous.finalY + 10;
            }

            addSection("Skills", values.skills);
            addSection("Experience", values.experience);
            addSection("Strengths", values.strengths);
            addSection("Hobbies", values.hobbies);

            doc.save(`${values.name.replace(/\s+/g, '-') || 'resume'}.pdf`);
        }
    };

    ResumeBuilder.init();
});
