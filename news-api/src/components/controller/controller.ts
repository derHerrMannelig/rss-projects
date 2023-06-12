import AppLoader from './appLoader';
import { NewsArticle, NewsSources } from '../../types/index';

class AppController extends AppLoader {
    getSources(callback: ((data: { sources?: NewsSources[] }) => void) | undefined): void {
        super.getResp(
            {
                endpoint: 'sources',
            },
            callback as () => void
        );
    }

    getNews(e: MouseEvent, callback: ((data: { articles?: NewsArticle[] }) => void) | undefined): void {
        let target = e.target as HTMLElement;
        const newsContainer = e.currentTarget as HTMLElement;

        while (target !== newsContainer) {
            if (target.classList.contains('source__item')) {
                const sourceId = target.getAttribute('data-source-id');
                if (newsContainer.getAttribute('data-source') !== sourceId) {
                    newsContainer.setAttribute('data-source', sourceId as string);
                    super.getResp(
                        {
                            endpoint: 'everything',
                            options: {
                                sources: sourceId as string,
                            },
                        },
                        callback as () => void
                    );
                }
                return;
            }
            target = target.parentNode as HTMLElement;
        }
    }
}

export default AppController;
