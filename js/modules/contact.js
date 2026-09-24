import { SITE_CONFIG } from '../config/site-config.js';
import { qs, qsa } from '../utils/helpers.js';

const ERROR_MESSAGES = {
    name: 'Por favor ingresa tu nombre.',
    email: 'Por favor ingresa un correo válido.',
    phone: 'Por favor ingresa un número de teléfono válido.',
    message: 'Por favor escribe tu mensaje.',
};

export const initContact = () => {
    const form = qs('#contactForm');
    if (!form) return;

    const submitBtn = qs('#submitBtn');
    const btnText = qs('.btn-text', submitBtn);
    const btnLoading = qs('.btn-loading', submitBtn);
    const formStatus = qs('#formStatus');

    const showError = (field) => {
        const errorSpan = qs(`#error-${field.name}`);
        if (!errorSpan) return;

        errorSpan.textContent = ERROR_MESSAGES[field.name] || field.validationMessage;
        errorSpan.classList.add('visible');
        field.classList.add('invalid');
    };

    const clearError = (field) => {
        const errorSpan = qs(`#error-${field.name}`);
        if (!errorSpan) return;

        errorSpan.textContent = '';
        errorSpan.classList.remove('visible');
        field.classList.remove('invalid');
    };

    const validateField = (field) => {
        clearError(field);
        const isValid = field.checkValidity();

        if (field.name === 'phone') {
            const phoneIsValid = /^\d{7,15}$/.test(field.value.replace(/\s/g, ''));
            if (phoneIsValid) return true;
            showError(field);
            return false;
        }

        if (!isValid) {
            showError(field);
            return false;
        }
        return true;
    };

    const validateForm = () => {
        let isFormValid = true;
        qsa('input, textarea', form).forEach((field) => {
            if (!validateField(field)) isFormValid = false;
        });
        return isFormValid;
    };

    const setLoading = (isLoading) => {
        submitBtn.disabled = isLoading;
        btnText.hidden = isLoading;
        btnLoading.hidden = !isLoading;
    };

    const showStatus = (type, message) => {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.hidden = false;
    };

    qsa('input, textarea', form).forEach((field) => {
        field.addEventListener('input', () => clearError(field));
        field.addEventListener('blur', () => validateField(field));
    });

    const sendSimulated = () => new Promise((resolve) => {
        setTimeout(resolve, 1200);
    });

    const sendEmailJS = async (formData) => {
        const emailjsAvailable = window.emailjs
            && SITE_CONFIG.emailjs.PUBLIC_KEY
            && SITE_CONFIG.emailjs.SERVICE_ID
            && SITE_CONFIG.emailjs.TEMPLATE_ID;

        if (!emailjsAvailable) return false;

        window.emailjs.init(SITE_CONFIG.emailjs.PUBLIC_KEY);

        await window.emailjs.send(SITE_CONFIG.emailjs.SERVICE_ID, SITE_CONFIG.emailjs.TEMPLATE_ID, {
            from_name: formData.get('name'),
            from_email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message'),
            to_email: SITE_CONFIG.email,
        });

        return true;
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            showStatus('error', 'Por favor corrige los campos marcados en rojo.');
            return;
        }

        setLoading(true);
        formStatus.hidden = true;

        try {
            const formData = new FormData(form);
            const sentWithEmailJS = await sendEmailJS(formData);
            if (!sentWithEmailJS) await sendSimulated();

            showStatus('success', '¡Mensaje enviado con éxito! Te contactaremos pronto.');
            form.reset();
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
            showStatus('error', 'Ocurrió un error al enviar tu mensaje. Inténtalo de nuevo o escríbenos por WhatsApp.');
        } finally {
            setLoading(false);
        }
    });
};
