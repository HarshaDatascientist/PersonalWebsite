/**
 * Contact Form Handler for Dr. Harsha A. Bhute Portfolio
 * EmailJS Configuration - Ready to Use
 */

const EMAILJS_CONFIG = {
    publicKey:  'YG76P2ZTGtTmSp2Gi',
    serviceId:  'service_nko0ehm',
    templateId: 'template_2nkbzxj'
};

(function() {
    const initEmailJS = function() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init(EMAILJS_CONFIG.publicKey);
            console.log('✓ EmailJS initialized successfully');
        } else {
            console.warn('✗ EmailJS library not loaded yet');
        }
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEmailJS);
    } else {
        initEmailJS();
    }
})();

const contactForm     = document.getElementById('contactForm');
const submitBtn       = document.getElementById('sendMessageButton');
const alertContainer  = document.getElementById('success');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right:8px;"></i>Sending...';
        }

        if (alertContainer) alertContainer.innerHTML = '';

        // Match template variables: {{name}}, {{from_name}}, {{from_email}}, {{title}}, {{message}}
        const formData = {
            name:       document.getElementById('name')    ? document.getElementById('name').value.trim()    : '',
            email:      document.getElementById('email')   ? document.getElementById('email').value.trim()   : '',
            subject:    document.getElementById('subject') ? document.getElementById('subject').value.trim() : '',
            message:    document.getElementById('message') ? document.getElementById('message').value.trim() : ''
        };

        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            showAlert('danger', 'Please fill in all required fields.');
            resetBtn(originalBtnText);
            return;
        }

        try {
            const success = await sendEmail(formData);
            if (success) {
                showAlert('success', 'Thank you! Your message has been sent successfully. I\'ll get back to you soon!');
                contactForm.reset();
            }
        } catch (err) {
            console.error('Send error:', err);
            showAlert('danger', 'Something went wrong. Please email directly: <a href="mailto:harsha.bhute@pccoepune.org">harsha.bhute@pccoepune.org</a>');
        } finally {
            resetBtn(originalBtnText);
        }
    });
}

async function sendEmail(formData) {
    if (typeof emailjs === 'undefined') throw new Error('EmailJS not loaded');

    // Template variables must match your EmailJS template exactly
    const templateParams = {
        name:       formData.name,          // {{name}} in template
        from_name:  formData.name,          // {{from_name}} in template
        from_email: formData.email,         // {{from_email}} in template (Reply To)
        title:      formData.subject,       // {{title}} in template subject line
        message:    formData.message,       // {{message}} in template body
        to_email:   'harsha.bhute@pccoepune.org'
    };

    console.log('Sending with params:', templateParams);
    const response = await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams);
    console.log('EmailJS response:', response);
    return response.status === 200;
}

function showAlert(type, message) {
    if (!alertContainer) return;
    const cls  = type === 'success' ? 'alert-success' : 'alert-danger';
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';
    alertContainer.innerHTML = `
        <div class="alert ${cls} alert-dismissible fade show" role="alert" style="margin-bottom:20px; border-radius:8px;">
            <i class="fas ${icon}" style="margin-right:8px;"></i>${message}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>`;
    alertContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    if (type === 'success') {
        setTimeout(() => {
            const a = alertContainer.querySelector('.alert');
            if (a) { a.classList.remove('show'); setTimeout(() => alertContainer.innerHTML = '', 150); }
        }, 5000);
    }
}

function resetBtn(originalText) {
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// Real-time email validation
const emailField = document.getElementById('email');
if (emailField) {
    emailField.addEventListener('blur', function() {
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value);
        this.classList.toggle('is-invalid', this.value && !ok);
    });
    emailField.addEventListener('input', function() {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)) this.classList.remove('is-invalid');
    });
}

// Character counter for message
const messageField = document.getElementById('message');
if (messageField) {
    messageField.addEventListener('input', function() {
        const max = 500, rem = max - this.value.length;
        let counter = document.getElementById('charCounter');
        if (!counter) {
            counter = document.createElement('small');
            counter.id = 'charCounter';
            this.parentElement.appendChild(counter);
        }
        if (rem < 0) {
            counter.className = 'form-text text-danger';
            counter.textContent = `Limit exceeded by ${Math.abs(rem)}`;
            this.value = this.value.substring(0, max);
        } else if (rem < 50) {
            counter.className = 'form-text text-warning';
            counter.textContent = `${rem} characters remaining`;
        } else {
            counter.className = 'form-text text-muted';
            counter.textContent = `${this.value.length}/${max} characters`;
        }
    });
}

console.log('✓ Contact form script loaded');
console.log('EmailJS Config:', {
    publicKey:  EMAILJS_CONFIG.publicKey  ? '✓' : '✗',
    serviceId:  EMAILJS_CONFIG.serviceId  ? '✓' : '✗',
    templateId: EMAILJS_CONFIG.templateId ? '✓' : '✗'
});
