import './sources.css';
import { NewsSources } from '../../../types/index';

class Sources {
    draw(data: NewsSources[]): void {
        const fragment = document.createDocumentFragment();
        const sourceItemTemp = document.querySelector<HTMLTemplateElement>('#sourceItemTemp');

        data.forEach((item) => {
            if (sourceItemTemp) {
                const sourceClone = sourceItemTemp.content.cloneNode(true);
                if (!(sourceClone instanceof DocumentFragment)) {
                    throw new Error();
                }
                const sourceNameElement = sourceClone.querySelector<HTMLElement>('.source__item-name');
                const sourceItemElement = sourceClone.querySelector<HTMLElement>('.source__item');
                if (sourceNameElement && sourceItemElement) {
                    sourceNameElement.textContent = item.name;
                    sourceItemElement.setAttribute('data-source-id', item.id);
                    fragment.append(sourceClone);
                }
            }
        });

        const sourcesContainer = document.querySelector<HTMLElement>('.sources');
        sourcesContainer?.append(fragment);
    }
}

export default Sources;
