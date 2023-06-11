import News from './news/news';
import Sources from './sources/sources';
import { NewsArticle, NewsSources } from '../../types/index';

export class AppView {
    private news: News;
    private sources: Sources;

    constructor() {
        this.news = new News();
        this.sources = new Sources();
    }

    drawNews(data: { articles?: NewsArticle[] }): void {
        const values: NewsArticle[] = data?.articles ? data?.articles : [];
        this.news.draw(values);
    }

    drawSources(data: { sources?: NewsSources[] }): void {
        const values: NewsSources[] = data?.sources ? data?.sources : [];
        this.sources.draw(values);
    }
}

export default AppView;
