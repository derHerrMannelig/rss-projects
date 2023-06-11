import Loader from './loader';

class AppLoader extends Loader {
    constructor() {
        super('https://newsapi.org/v2/', {
            apiKey: '92a09f6ac58b4b8ca8432b38aeae585e',
        });
    }
}

export default AppLoader;
