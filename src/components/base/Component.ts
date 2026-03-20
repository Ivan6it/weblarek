import { IEvents } from './Events';

export abstract class Component<T> {
    protected constructor(protected container: HTMLElement, protected events?: IEvents) {}

    get element(): HTMLElement {
        return this.container;
    }

    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt) element.alt = alt;
        }
    }

    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}