import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface IFormState {
    valid: boolean;
    errors: string[];
}

export abstract class FormView<T> extends Component<IFormState> { // <T> используют дочерние классы
    protected submitButton: HTMLButtonElement;
    protected error: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this.error = ensureElement<HTMLElement>('.form__errors', container);
    }

    submitValidation(value: boolean): void {
        this.submitButton.disabled = !value;
    }

    setError(value: string): void {
        this.error.innerHTML = value;
    }
}