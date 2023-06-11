import './news.css';
import { NewsArticle } from '../../../types/index';

class News {
    draw(data: NewsArticle[]): void {
        const news: NewsArticle[] = data.length >= 10 ? data.filter((_item, idx) => idx < 10) : data;

        const fragment: DocumentFragment = document.createDocumentFragment();
        const newsItemTemp: HTMLTemplateElement | null = document.querySelector('#newsItemTemp');

        news.forEach((item, idx) => {
            if (newsItemTemp) {
                const newsClone: DocumentFragment = newsItemTemp.content.cloneNode(true) as DocumentFragment;

                if (idx % 2) newsClone.querySelector('.news__item')?.classList.add('alt');

                const metaPhotoElement: HTMLElement | null = newsClone.querySelector('.news__meta-photo');
                if (metaPhotoElement) {
                    metaPhotoElement.style.backgroundImage = `url(${item.urlToImage || 'img/news_placeholder.jpg'})`;
                }
                const metaAuthorElement: HTMLElement | null = newsClone.querySelector('.news__meta-author');
                if (metaAuthorElement) {
                    metaAuthorElement.textContent = item.author || item.source.name;
                }
                const metaDateElement: HTMLElement | null = newsClone.querySelector('.news__meta-date');
                if (metaDateElement) {
                    metaDateElement.textContent = item.publishedAt.slice(0, 10).split('-').reverse().join('-');
                }

                const descriptionTitleElement: HTMLElement | null = newsClone.querySelector('.news__description-title');
                if (descriptionTitleElement) {
                    descriptionTitleElement.textContent = item.title;
                }
                const descriptionSourceElement: HTMLElement | null = newsClone.querySelector(
                    '.news__description-source'
                );
                if (descriptionSourceElement) {
                    descriptionSourceElement.textContent = item.source.name;
                }
                const descriptionContentElement: HTMLElement | null = newsClone.querySelector(
                    '.news__description-content'
                );
                if (descriptionContentElement) {
                    descriptionContentElement.textContent = item.description;
                }
                const readMoreElement: HTMLAnchorElement | null = newsClone.querySelector('.news__read-more a');
                if (readMoreElement) {
                    readMoreElement.setAttribute('href', item.url);
                }

                fragment.append(newsClone);
            }
        });

        const newsTemplate: HTMLElement | null = document.querySelector('.news');
        if (newsTemplate) {
            newsTemplate.innerHTML = '';
            newsTemplate.appendChild(fragment);
        }
    }
}

export default News;
