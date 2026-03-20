import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class ContactsView extends Component<{ email: string; phone: string }> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;
    protected submitButton: HTMLButtonElement;
    protected errorElement: HTMLElement;

    private isEmailTouched = false;
    private isPhoneTouched = false;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, events);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
        this.submitButton = ensureElement<HTMLButtonElement>('.button', container);
        this.errorElement = ensureElement<HTMLElement>('.form__errors', container);

        this.emailInput.addEventListener('focus', () => {
            this.isEmailTouched = true;
            if (this.errorElement.textContent) {
                this.hideError();
            }
        });

        this.phoneInput.addEventListener('focus', () => {
            this.isPhoneTouched = true;
            if (this.errorElement.textContent) {
                this.hideError();
            }
        });

        [this.emailInput, this.phoneInput].forEach(input => {
            input.addEventListener('input', () => {
                this.validate();
            });
        });

        this.emailInput.addEventListener('blur', () => {
            this.validateOnBlur();
        });

        this.phoneInput.addEventListener('blur', () => {
            this.validateOnBlur();
        });

        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.isEmailTouched = true;
            this.isPhoneTouched = true;
            this.validate(true);
            if (this.isValid()) {
                this.events.emit('contacts:submit', {
                    email: this.emailInput.value.trim(),
                    phone: this.phoneInput.value.trim()
                });
            }
        });

        this.validate();
    }

    private validateOnBlur() {
        const email = this.emailInput.value.trim();
        const phone = this.phoneInput.value.trim();

        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const isPhoneValid = /^\+7\s?\(?\d{3}\)?\s?\d{3}-?\d{2}-?\d{2}$/.test(phone.replace(/\s/g, ''));

        if (this.isEmailTouched && this.isPhoneTouched && !isEmailValid && !isPhoneValid) {
            this.showError('Необходимо указать email и номер телефона');
            return;
        }

        if (this.isEmailTouched && !isEmailValid) {
            this.showError('Необходимо указать email');
            return;
        }

        if (this.isPhoneTouched && !isPhoneValid) {
            this.showError('Необходимо указать номер телефона');
            return;
        }

        this.hideError();
    }

    private validate(forceShow = false) {
        const email = this.emailInput.value.trim();
        const phone = this.phoneInput.value.trim();

        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const isPhoneValid = /^\+7\s?\(?\d{3}\)?\s?\d{3}-?\d{2}-?\d{2}$/.test(phone.replace(/\s/g, ''));

        const isValid = isEmailValid && isPhoneValid;

        this.submitButton.disabled = !isValid;

        if (forceShow) {
            if (!isEmailValid && !isPhoneValid) {
                this.showError('Необходимо указать email и номер телефона');
            } else if (!isEmailValid) {
                this.showError('Необходимо указать email');
            } else if (!isPhoneValid) {
                this.showError('Необходимо указать номер телефона');
            } else {
                this.hideError();
            }
        }

        return isValid;
    }

    isValid(): boolean {
        const email = this.emailInput.value.trim();
        const phone = this.phoneInput.value.trim();
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const isPhoneValid = /^\+7\s?\(?\d{3}\)?\s?\d{3}-?\d{2}-?\d{2}$/.test(phone.replace(/\s/g, ''));
        return isEmailValid && isPhoneValid;
    }

    private showError(message: string) {
        this.errorElement.textContent = message;
    }

    private hideError() {
        this.errorElement.textContent = '';
    }

    render(): HTMLElement {
        this.emailInput.value = '';
        this.phoneInput.value = '';
        this.submitButton.disabled = true;
        this.isEmailTouched = false;
        this.isPhoneTouched = false;
        this.hideError();
        this.validate();
        return this.container;
    }
}