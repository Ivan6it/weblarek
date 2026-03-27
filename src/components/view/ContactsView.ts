import { FormView } from './FormView';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IContactsData {
    email: string;
    phone: string;
}

export class ContactsView extends FormView<IContactsData> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);

        this.emailInput.addEventListener('input', () => {
            events.emit('contacts:email', {
                email: this.emailInput.value,
            });
        });

        this.phoneInput.addEventListener('input', () => {
            events.emit('contacts:phone', {
                phone: this.phoneInput.value,
            });
        });

        this.submitButton.addEventListener('click', (event) => {
            event.preventDefault();
            events.emit('success:submit');
        });
    }

    get element(): HTMLElement {
        return this.container;
    }

    clear(): void {
        this.emailInput.value = '';
        this.phoneInput.value = '';
    }
}