import Loader from './loader';

class AppLoader extends Loader {
    constructor() {
        super('https://newsapi.org/v2/', {
            apiKey: '3f35e205e711486eb8ebae1d62794017',
        });
    }
}

export default AppLoader;
