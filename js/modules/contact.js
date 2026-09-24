import { qs, qsa } from '../utils/helpers.js';

const ERROR_MESSAGES = {
    name: 'Por favor ingresa tu nombre completo.',
    email: 'Por favor ingresa un correo electrónico válido.',
    phone: 'Por favor ingresa un número de teléfono válido (mínimo 7 dígitos).',
    interest: 'Por favor selecciona el área de tu interés.',
    message: 'Por favor escribe tu mensaje explicando tu requerimiento.',
};

export const initContact = () => {
    const form = qs('#contactForm');
    if (!form) return;

    const formFields = qs('#formFields', form);
    const formSuccessCard = qs('#formSuccessCard', form);
    const formErrorBanner = qs('#formErrorBanner', form);
    const submitBtn = qs('#submitBtn', form);
    const btnText = qs('.btn-text', submitBtn);
    const btnLoading = qs('.btn-loading', submitBtn);
    const resetFormBtn = qs('#resetFormBtn', form);

    const showError = (field) => {
        const errorSpan = qs(`#error-${field.name}`, form);
        if (!errorSpan) return;

        errorSpan.textContent = ERROR_MESSAGES[field.name] || field.validationMessage;
        errorSpan.classList.add('visible');
        field.classList.add('invalid');
    };

    const clearError = (field) => {
        const errorSpan = qs(`#error-${field.name}`, form);
        if (!errorSpan) return;

        errorSpan.textContent = '';
        errorSpan.classList.remove('visible');
        field.classList.remove('invalid');
    };

    const validateField = (field) => {
        clearError(field);

        if (field.name === 'name') {
            const isValid = field.value.trim().length >= 2;
            if (!isValid) {
                showError(field);
                return false;
            }
            return true;
        }

        if (field.name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isValid = emailRegex.test(field.value.trim());
            if (!isValid) {
                showError(field);
                return false;
            }
            return true;
        }

        if (field.name === 'phone') {
            const digits = field.value.replace(/\D/g, '');
            const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]{6,15}$/;
            const isValid = digits.length >= 7 && digits.length <= 15 && phoneRegex.test(field.value.trim());
            if (!isValid) {
                showError(field);
                return false;
            }
            return true;
        }

        if (field.name === 'interest') {
            const isValid = field.value.trim() !== '';
            if (!isValid) {
                showError(field);
                return false;
            }
            return true;
        }

        if (field.name === 'message') {
            const isValid = field.value.trim().length >= 8;
            if (!isValid) {
                showError(field);
                return false;
            }
            return true;
        }

        return true;
    };

    const validateForm = () => {
        let isFormValid = true;
        let firstInvalidField = null;

        qsa('input:not([name="bot-field"]):not([type="hidden"]), select, textarea', form).forEach((field) => {
            if (!validateField(field)) {
                isFormValid = false;
                if (!firstInvalidField) firstInvalidField = field;
            }
        });

        if (firstInvalidField) {
            firstInvalidField.focus();
        }

        return isFormValid;
    };

    const setLoading = (isLoading) => {
        submitBtn.disabled = isLoading;
        btnText.hidden = isLoading;
        btnLoading.hidden = !isLoading;
    };

    const showSuccess = () => {
        if (formFields) formFields.hidden = true;
        if (formErrorBanner) formErrorBanner.hidden = true;
        if (formSuccessCard) formSuccessCard.hidden = false;
    };

    const showErrorBanner = () => {
        if (formErrorBanner) formErrorBanner.hidden = false;
    };

    const resetForm = () => {
        form.reset();
        qsa('input, select, textarea', form).forEach((field) => clearError(field));
        if (formSuccessCard) formSuccessCard.hidden = true;
        if (formErrorBanner) formErrorBanner.hidden = true;
        if (formFields) formFields.hidden = false;
        setLoading(false);
    };

    // Listeners de validación interactiva
    qsa('input:not([name="bot-field"]):not([type="hidden"]), select, textarea', form).forEach((field) => {
        field.addEventListener('input', () => {
            clearError(field);
            if (formErrorBanner) formErrorBanner.hidden = true;
        });
        field.addEventListener('change', () => {
            clearError(field);
            if (formErrorBanner) formErrorBanner.hidden = true;
        });
        field.addEventListener('blur', () => {
            if (field.value.trim() !== '') {
                validateField(field);
            }
        });
    });

    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', () => {
            resetForm();
        });
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Honeypot antispam: si viene relleno, descartar silenciosamente
        const botField = form.elements['bot-field'];
        if (botField && botField.value) {
            showSuccess();
            return;
        }

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        if (formErrorBanner) formErrorBanner.hidden = true;

        try {
            const formData = new FormData(form);
            const searchParams = new URLSearchParams(formData).toString();

            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: searchParams,
            });

            if (response.ok || response.status === 200 || response.status === 303) {
                showSuccess();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Error al procesar el formulario de contacto.');
            showErrorBanner();
        } finally {
            setLoading(false);
        }
    });
};
