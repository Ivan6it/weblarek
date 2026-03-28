import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected closeButton: HTMLButtonElement;
    protected contentContainer: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.contentContainer = ensureElement<HTMLElement>('.modal__content', container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);

        this.closeButton.addEventListener('click', () => {
            this.events.emit('modal:close');
        });

        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.events.emit('modal:close(Overlay)');
            }
        });
    }

    open(): void {
        this.container.classList.add('modal_active');
    }

    close(): void {
        this.container.classList.remove('modal_active');
    }

    getCurrentContent(): HTMLElement | null {
        return this.contentContainer.firstElementChild as HTMLElement || null;
    }

    render(data: IModal): HTMLElement {
        super.render(data);
        this.contentContainer.replaceChildren(data.content);
        return this.container;
    }

}