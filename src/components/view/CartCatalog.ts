import { ensureElement } from "../../utils/utils";
import { cardView } from "./CardView";
import { categoryMap } from '../../utils/constants';
import { IBasketActions } from "../../types";

interface ICartCatalogData {
    image: string;
    category: string;
}

export class CartCatalog extends cardView<ICartCatalogData>  {
    imageElement: HTMLImageElement;
    categoryElement: HTMLElement;

    constructor(container: HTMLElement, actions: IBasketActions) {
        super(container);

        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);

        this.container.addEventListener('click', () => {
            actions.OnClick();
        });
    }

    set image(src: string) {
        this.setImage(this.imageElement, src);
    }

    set category(value: string) {
        this.categoryElement.className = 'card__category';
        const style = categoryMap[value as keyof typeof categoryMap];
        this.categoryElement.classList.add(style);
        this.categoryElement.textContent = value;
    }
}