import { Validators } from "@angular/forms";

export const FORM_VALIDATORS = {
    NAME: [
        Validators.required,
        Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
    ],
    PHONE: [
        Validators.required,
        Validators.pattern(/^\d{10}$/)
    ],
    ADDRESS: [
        Validators.required,
        Validators.pattern(/^[A-Za-z0-9\s.,#\-°]+$/)
    ],
    CLASSIFICATION: [
        Validators.required,
        Validators.pattern(/^[A-Da-d]$/)
    ]
};