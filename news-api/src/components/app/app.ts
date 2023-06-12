import AppController from '../controller/controller';
import { AppView } from '../view/appView';
import { NewsArticle, NewsSources } from '../../types/index';

class App {
    private controller: AppController;
    private view: AppView;

    constructor() {
        this.controller = new AppController();
        this.view = new AppView();
    }

    start(): void {
        const sourcesElement = document.querySelector('.sources');
        if (sourcesElement) {
            sourcesElement.addEventListener('click', (e: Event) => {
                this.controller.getNews(e as MouseEvent, (data: { articles?: NewsArticle[] }) =>
                    this.view.drawNews(data)
                );
            });
        }
        this.controller.getSources((data: { sources?: NewsSources[] }) => this.view.drawSources(data));
    }
}

export default App;
