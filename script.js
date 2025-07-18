document.addEventListener('DOMContentLoaded', () => {

    /**
     * Main object to encapsulate all functionality for the Resume Builder.
     */
    const ResumeBuilder = {
        
        // Configuration for selectors and default texts
        config: {
            form: '#resume-form',
            liveUpdateSelector: '.live-update',
            educationCheckboxSelector: 'input[name="education"]',
            pdfButton: '#pdf-btn',
            placeholders: {
                name: 'Your Name',
                email: 'your.email@example.com',
                phone: 'Your Phone Number',
                address: 'Your City, State',
                skills: 'Your skills will appear here.',
                experience: 'Your work experience will appear here.',
                education: '<li>Your education details will appear here.</li>'
            }
        },

        // Object to hold cached DOM elements
        elements: {},

        /**
         * Initializes the application.
         */
        init() {
            this.cacheDOMElements();
            this.bindEvents();
            this.updatePreview(); // Initial update to set default placeholders
        },

        /**
         * Caches all required DOM elements for better performance.
         */
        cacheDOMElements() {
            this.elements.form = document.querySelector(this.config.form);
            this.elements.pdfBtn = document.querySelector(this.config.pdfButton);
            this.elements.btnText = this.elements.pdfBtn.querySelector('.btn-text');
            this.elements.spinner = this.elements.pdfBtn.querySelector('.spinner');
            
            // Cache all preview elements
            this.elements.preview = {};
            const previewElements = document.querySelectorAll('[id^="preview-"]');
            previewElements.forEach(el => {
                const key = el.id.split('-')[1];
                this.elements.preview[key] = el;
            });
        },

        /**
         * Binds all necessary event listeners.
         */
        bindEvents() {
            // Use event delegation for form inputs for efficiency
            this.elements.form.addEventListener('input', this.handleFormUpdate.bind(this));
            this.elements.form.addEventListener('change', this.handleFormUpdate.bind(this));
            
            this.elements.pdfBtn.addEventListener('click', this.generatePDF.bind(this));
        },

        /**
         * Handles input and change events on the form to trigger a preview update.
         */
        handleFormUpdate(event) {
            // Check if the target element should trigger a live update
            if (event.target.matches(this.config.liveUpdateSelector) || event.target.matches(this.config.educationCheckboxSelector)) {
                this.updatePreview();
            }

            // Toggle visibility for grade inputs when a checkbox changes
            if (event.target.matches(this.config.educationCheckboxSelector)) {
                const gradeInput = document.querySelector(`.edu-grade[data-for="${event.target.value}"]`);
                if (gradeInput) {
                    gradeInput.classList.toggle('hidden', !event.target.checked);
                    if (!event.target.checked) {
                        gradeInput.value = '';
                    }
                }
            }
        },

        /**
         * Gathers all values from the form fields.
         * @returns {object} An object containing all form data.
         */
        getFormValues() {
            const values = {};
            const formData = new FormData(this.elements.form);
            for (const [key, value] of formData.entries()) {
                values[key] = value.trim();
            }
            
            // Manually add education data since it's checkbox-based
            values.education = [];
            document.querySelectorAll('input[name="education"]:checked').forEach(cb => {
                const gradeInput = document.querySelector(`.edu-grade[data-for="${cb.value}"]`);
                values.education.push({
                    degree: cb.value,
                    grade: gradeInput.value.trim() || 'N/A'
                });
            });

            return values;
        },

        /**
         * Updates the entire live preview panel with current form data.
         */
        updatePreview() {
            const values = this.getFormValues();
            
            this.elements.preview.name.innerText = values.name || this.config.placeholders.name;
            this.elements.preview.email.innerText = values.email || this.config.placeholders.email;
            this.elements.preview.phone.innerText = values.phone || this.config.placeholders.phone;
            this.elements.preview.address.innerText = values.address || this.config.placeholders.address;
            this.elements.preview.skills.innerText = values.skills || this.config.placeholders.skills;
            this.elements.preview.experience.innerText = values.experience || this.config.placeholders.experience;
            
            // Update education section
            if (values.education.length === 0) {
                this.elements.preview.education.innerHTML = this.config.placeholders.education;
            } else {
                this.elements.preview.education.innerHTML = values.education
                    .map(edu => `<li><strong>${edu.degree}:</strong> ${edu.grade}</li>`)
                    .join('');
            }
        },

        /**
         * Generates and downloads the resume as a PDF file.
         */
        generatePDF() {
            this.setLoadingState(true);

            try {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
                const values = this.getFormValues();
                
                const leftMargin = 20;
                const rightMargin = 210 - leftMargin;
                let y = 20; // Y-position cursor

                // --- Set Document Properties ---
                doc.setProperties({
                    title: `Resume - ${values.name || 'User'}`,
                    subject: 'Resume created with Live Resume Builder.',
                    author: 'Live Resume Builder',
                });

                // --- PDF Header ---
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(26);
                doc.text(values.name || this.config.placeholders.name, doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
                y += 8;
                
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(11);
                const contactInfo = [values.email, values.phone, values.address].filter(Boolean).join(' | ');
                doc.text(contactInfo, doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
                y += 10;
                doc.setDrawColor(226, 232, 240); // --border-color
                doc.line(leftMargin, y, rightMargin, y);
                y += 12;

                // --- Section Helper ---
                const addSection = (title, content) => {
                    if (content && content.trim()) {
                        doc.setFontSize(16);
                        doc.setFont('helvetica', 'bold');
                        doc.text(title, leftMargin, y);
                        y += 8;
                        doc.setFontSize(11);
                        doc.setFont('helvetica', 'normal');
                        const splitContent = doc.splitTextToSize(content, rightMargin - leftMargin);
                        doc.text(splitContent, leftMargin, y);
                        y += (splitContent.length * 5) + 10; // Adjust spacing after section
                    }
                };

                // --- Add Content Sections ---
                addSection("Professional Experience", values.experience);
                addSection("Skills", values.skills);
                
                // --- Education Table Section ---
                if (values.education.length > 0) {
                    doc.setFontSize(16);
                    doc.setFont('helvetica', 'bold');
                    doc.text("Education", leftMargin, y);
                    y += 8;

                    const eduData = values.education.map(edu => [edu.degree, edu.grade]);
                    doc.autoTable({
                        startY: y,
                        head: [['Qualification', 'Percentage/CGPA']],
                        body: eduData,
                        theme: 'grid',
                        headStyles: { fillColor: [0, 92, 153] }, // --primary-color
                        margin: { left: leftMargin },
                        tableWidth: rightMargin - leftMargin,
                    });
                    y = doc.autoTable.previous.finalY + 10;
                }
                
                // --- PDF Footer ---
                const pageCount = doc.internal.getNumberOfPages();
                for(let i = 1; i <= pageCount; i++) {
                    doc.setPage(i);
                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'italic');
                    const date = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
                    const footerText = `Generated on ${date} | Page ${i} of ${pageCount}`;
                    doc.text(footerText, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
                }

                // --- Save the PDF ---
                const filename = (values.name || 'resume').replace(/\s+/g, '-').toLowerCase();
                doc.save(`${filename}.pdf`);

            } catch (error) {
                console.error("Failed to generate PDF:", error);
                alert("Sorry, there was an error generating the PDF. Please check the console for details.");
            } finally {
                this.setLoadingState(false);
            }
        },

        /**
         * Toggles the loading state of the PDF button.
         * @param {boolean} isLoading - Whether to show the loading state.
         */
        setLoadingState(isLoading) {
            this.elements.pdfBtn.disabled = isLoading;
            this.elements.btnText.classList.toggle('hidden', isLoading);
            this.elements.spinner.classList.toggle('hidden', !isLoading);
        }
    };

    // Start the application
    ResumeBuilder.init();
});
