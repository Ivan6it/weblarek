import { Component } from "../base/Component";

interface IGallery {
    catalog: HTMLElement[];
}

export class Gallery extends Component<IGallery> {

    constructor(container: HTMLElement) {
        super(container);
    }

    set catalog(items: HTMLElement[]) {
        if (!items.length) {
            this.container.textContent = 'Нет доступных товаров';
        } else {
            this.container.replaceChildren(...items);
        }
    }
}