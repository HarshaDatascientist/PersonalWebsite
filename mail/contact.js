/**
 * Contact Form Handler for Dr. Harsha A. Bhute Portfolio
 * Enhanced with diagnostics and error handling
 */

// =================================================================
// EmailJS Configuration
// =================================================================
const EMAILJS_CONFIG = {
    publicKey: 'YG76P2ZTGtTmSp2Gi',      // Your EmailJS public key
    serviceId: 'service_nko0ehm',        // Your service ID
    templateId: 'template_heq2mzb'       // Your template ID
};
// =================================================================
// Initialize EmailJS
// =================================================================
(function() {
    const initEmailJS = function() {
        if (typeof emailjs !== 'undefined') {
            try {
                emailjs.init(EMAILJS_CONFIG.publicKey);
                console.log('✓ EmailJS initialized successfully');
                console.log('✓ Using Public Key:', EMAILJS_CONFIG.publicKey);
            } catch (error) {
                console.error('✗ EmailJS initialization error:', error);
            }
        } else {
            console.error('✗ EmailJS library not loaded. Check if script tag is present.');
        }
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEmailJS);
    } else {
        initEmailJS();
    }
})();

// =================================================================
// Wait for DOM and EmailJS to be ready
// =================================================================
window.addEventListener('load', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('sendMessageButton');
    const alertContainer = document.getElementById('success');
    
    console.log('Form elements check:');
    console.log('- contactForm:', contactForm ? '✓ Found' : '✗ Not found');
    console.log('- submitBtn:', submitBtn ? '✓ Found' : '✗ Not found');
    console.log('- alertContainer:', alertContainer ? '✓ Found' : '✗ Not found');
    console.log('- emailjs library:', typeof emailjs !== 'undefined' ? '✓ Loaded' : '✗ Not loaded');
    
    if (!contactForm) {
        console.error('Contact form not found!');
        return;
    }
    
    // =================================================================
    // Form Submission Handler
    // =================================================================
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submitted - processing...');
        
        // Get button text
        const originalBtnText = submitBtn ? submitBtn.textContent : 'Send Message';
        
        // Disable submit button
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            submitBtn.style.opacity = '0.7';
        }
        
        // Clear previous alerts
        if (alertContainer) {
            alertContainer.innerHTML = '';
        }
        
        // Get form data
        const formData = {
            name: document.getElementById('name')?.value || '',
            email: document.getElementById('email')?.value || '',
            subject: document.getElementById('subject')?.value || '',
            message: document.getElementById('message')?.value || ''
        };
        
        console.log('Form data collected:', {
            name: formData.name ? '✓' : '✗',
            email: formData.email ? '✓' : '✗',
            subject: formData.subject ? '✓' : '✗',
            message: formData.message ? '✓' : '✗'
        });
        
        // Validate form data
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            showAlert('danger', 'Please fill in all required fields.');
            resetSubmitButton(submitBtn, originalBtnText);
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showAlert('danger', 'Please enter a valid email address.');
            resetSubmitButton(submitBtn, originalBtnText);
            return;
        }
        
        try {
            console.log('Attempting to send email via EmailJS...');
            const success = await sendWithEmailJS(formData);
            
            if (success) {
                console.log('✓ Email sent successfully!');
                showAlert('success', 'Thank you! Your message has been sent successfully. I\'ll get back to you soon!');
                contactForm.reset();
            }
        } catch (error) {
            console.error('✗ Error sending email:', error);
            
            // More detailed error message
            let errorMessage = 'Sorry, there was an error sending your message. ';
            
            if (error.text) {
                errorMessage += 'Error: ' + error.text + ' ';
            }
            
            if (error.status === 400) {
                errorMessage = 'Invalid request. Please check your EmailJS configuration. ';
            } else if (error.status === 401) {
                errorMessage = 'EmailJS authentication failed. Please verify your Public Key. ';
            } else if (error.status === 402) {
                errorMessage = 'EmailJS quota exceeded. Please check your account. ';
            } else if (error.status === 404) {
                errorMessage = 'EmailJS service or template not found. Please verify your IDs. ';
            }
            
            errorMessage += 'Please try again or email me directly at <a href="mailto:harsha.bhute@pccoepune.org">harsha.bhute@pccoepune.org</a>';
            
            showAlert('danger', errorMessage);
        } finally {
            resetSubmitButton(submitBtn, originalBtnText);
        }
    });
    
    // =================================================================
    // EmailJS Send Function
    // =================================================================
    async function sendWithEmailJS(formData) {
        // Check if EmailJS is loaded
        if (typeof emailjs === 'undefined') {
            throw new Error('EmailJS library not loaded. Please refresh the page.');
        }
        
        // Prepare template parameters
        const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
            to_name: 'Dr. Harsha A. Bhute',
            to_email: 'harsha.bhute@pccoepune.org'
        };
        
        console.log('Sending with EmailJS...');
        console.log('Service ID:', EMAILJS_CONFIG.serviceId);
        console.log('Template ID:', EMAILJS_CONFIG.templateId);
        console.log('Template params:', templateParams);
        
        try {
            const response = await emailjs.send(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.templateId,
                templateParams
            );
            
            console.log('EmailJS Response:', response);
            
            if (response.status === 200) {
                return true;
            } else {
                throw new Error('Unexpected response status: ' + response.status);
            }
        } catch (error) {
            console.error('EmailJS send error:', error);
            throw error;
        }
    }
    
    // =================================================================
    // Alert Display Function
    // =================================================================
    function showAlert(type, message) {
        if (!alertContainer) {
            console.error('Alert container not found');
            alert(message.replace(/<[^>]*>/g, '')); // Fallback to browser alert
            return;
        }
        
        const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
        const iconClass = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';
        
        alertContainer.innerHTML = `
            <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
                <i class="fas ${iconClass}"></i> ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `;
        
        // Scroll to alert
        alertContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto-dismiss success alerts after 7 seconds
        if (type === 'success') {
            setTimeout(() => {
                const alert = alertContainer.querySelector('.alert');
                if (alert) {
                    alert.classList.remove('show');
                    setTimeout(() => {
                        alertContainer.innerHTML = '';
                    }, 150);
                }
            }, 7000);
        }
    }
    
    // =================================================================
    // Reset Submit Button
    // =================================================================
    function resetSubmitButton(btn, originalText) {
        if (btn) {
            btn.disabled = false;
            btn.textContent = originalText || 'Send Message';
            btn.style.opacity = '1';
        }
    }
    
    // =================================================================
    // Form Validation Enhancements
    // =================================================================
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.classList.add('is-invalid');
            } else {
                this.classList.remove('is-invalid');
            }
        });
        
        emailField.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(this.value)) {
                    this.classList.remove('is-invalid');
                }
            }
        });
    }
    
    // =================================================================
    // Character Counter for Message
    // =================================================================
    const messageField = document.getElementById('message');
    const maxLength = 500;
    
    if (messageField) {
        messageField.addEventListener('input', function() {
            const currentLength = this.value.length;
            const remaining = maxLength - currentLength;
            
            let counter = document.getElementById('charCounter');
            if (!counter) {
                counter = document.createElement('small');
                counter.id = 'charCounter';
                counter.className = 'form-text text-muted';
                this.parentElement.appendChild(counter);
            }
            
            if (remaining < 0) {
                counter.className = 'form-text text-danger';
                counter.textContent = `Character limit exceeded by ${Math.abs(remaining)}`;
                this.value = this.value.substring(0, maxLength);
            } else if (remaining < 50) {
                counter.className = 'form-text text-warning';
                counter.textContent = `${remaining} characters remaining`;
            } else {
                counter.className = 'form-text text-muted';
                counter.textContent = `${currentLength}/${maxLength} characters`;
            }
        });
    }
});

// =================================================================
// Diagnostic Information
// =================================================================
console.log('%c Contact Form Script Loaded ', 'background: #4CAF50; color: white; font-weight: bold; padding: 5px;');
console.log('EmailJS Configuration:');
console.log('├─ Public Key:', EMAILJS_CONFIG.publicKey ? '✓ Set' : '✗ Missing');
console.log('├─ Service ID:', EMAILJS_CONFIG.serviceId ? '✓ Set' : '✗ Missing');
console.log('└─ Template ID:', EMAILJS_CONFIG.templateId ? '✓ Set' : '✗ Missing');
