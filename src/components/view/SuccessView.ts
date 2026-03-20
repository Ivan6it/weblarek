import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Modal } from './Modal';

interface ISuccessData {
    total: number;
}

export class SuccessView extends Component<ISuccessData> {
    protected totalElement: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents, private modal: Modal) {
        super(container, events);

        this.totalElement = ensureElement<HTMLElement>('.order-success__description', container);
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);

        this.closeButton.addEventListener('click', () => {
            this.modal.close();
        });
    }

    set total(value: number) {
        this.totalElement.textContent = `Списано ${value} синапсов`;
    }

    render(data?: ISuccessData): HTMLElement {
        super.render(data);
        return this.container;
    }
}