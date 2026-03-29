import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface IFormState {
    valid: boolean;
    errors: string;
}

export abstract class FormView<T> extends Component<IFormState & T> {
    protected submitButton: HTMLButtonElement;
    protected errorElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this.errorElement = ensureElement<HTMLElement>('.form__errors', container);
    }

    set errors(value: string) {
        this.errorElement.textContent = value;
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }
}