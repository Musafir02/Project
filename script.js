// Updated script.js with autosave, theme toggle, PDF spinner, and better UX

document.addEventListener('DOMContentLoaded', () => { const ResumeBuilder = { init() { this.cacheDOMElements(); this.bindEvents(); this.loadFromLocalStorage(); },

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
        this.form.addEventListener('input', () => {
            this.updatePreview();
            this.saveToLocalStorage();
        });

        this.pdfBtn.addEventListener('click', () => {
            this.generatePDF();
        });

        this.addEducationBtn.addEventListener('click', () => {
            this.addEducationEntry();
        });

        this.educationEntries.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-btn')) {
                e.target.closest('.education-entry').remove();
                this.updatePreview();
                this.saveToLocalStorage();
            }
        });

        document.getElementById("toggle-theme").addEventListener("click", () => {
            document.body.classList.toggle("dark");
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

    addEducationEntry(entryData = {}) {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'education-entry';
        entryDiv.innerHTML = `
            <input type="text" name="qualification" placeholder="Qualification (e.g., B.Com)" value="${entryData.qualification || ''}">
            <input type="text" name="institute" placeholder="Institute Name" value="${entryData.institute || ''}">
            <input type="text" name="board" placeholder="University / Board" value="${entryData.board || ''}">
            <input type="text" name="year" placeholder="Year of Passing" value="${entryData.year || ''}">
            <input type="text" name="grade" placeholder="Grade / Percentage" value="${entryData.grade || ''}">
            <button type="button" class="remove-btn">Remove</button>
        `;
        this.educationEntries.appendChild(entryDiv);
    },

    saveToLocalStorage() {
        const values = this.getFormValues();
        localStorage.setItem("resumeData", JSON.stringify(values));
    },

    loadFromLocalStorage() {
        const data = JSON.parse(localStorage.getItem("resumeData"));
        if (!data) return;

        ['name', 'email', 'phone', 'address', 'skills', 'experience', 'strengths', 'hobbies'].forEach(id => {
            this.form.elements[id].value = data[id] || '';
        });

        this.educationEntries.innerHTML = '';
        (data.education || []).forEach(entry => {
            this.addEducationEntry(entry);
        });
        this.updatePreview();
    },

    generatePDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
        const values = this.getFormValues();

        this.pdfBtn.disabled = true;
        this.pdfBtn.querySelector('.btn-text').classList.add('hidden');
        this.pdfBtn.querySelector('.spinner').classList.remove('hidden');

        const leftMargin = 15, rightMargin = 210 - 15;
        let y = 20;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text("RESUME", doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
        y += 15;

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
                startY: y,
                head: head,
                body: body,
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

        setTimeout(() => {
            doc.save(`${values.name.replace(/\s+/g, '-') || 'resume'}.pdf`);
            this.pdfBtn.disabled = false;
            this.pdfBtn.querySelector('.btn-text').classList.remove('hidden');
            this.pdfBtn.querySelector('.spinner').classList.add('hidden');
        }, 500);
    }
};

ResumeBuilder.init();

});

