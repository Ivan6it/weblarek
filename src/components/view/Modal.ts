import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class Modal extends Component<unknown> {
    private modalContainer: HTMLElement;
    private closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        this.modalContainer = container;
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);

        this.closeButton.addEventListener('click', () => {
            this.close();
        });

        this.modalContainer.addEventListener('click', (e) => {
            if (e.target === this.modalContainer) {
                this.close();
            }
        });
    }

    open() {
        this.modalContainer.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close() {
        this.modalContainer.classList.remove('modal_active');
        this.events.emit('modal:close');
    }

    isOpen(): boolean {
        return this.modalContainer.classList.contains('modal_active');
    }

    render(content: HTMLElement): HTMLElement {
        const modalContent = this.modalContainer.querySelector('.modal__content');
        if (!modalContent) {
            console.error('Элемент .modal__content не найден');
            return this.modalContainer;
        }
        modalContent.replaceWith(content);
        content.classList.add('modal__content');
        this.open();
        return this.modalContainer;
    }
}