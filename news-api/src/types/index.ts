export interface RequestParameters {
    apiKey: string;
    category?: 'business' | 'entertainment' | 'general' | 'health' | 'science' | 'sports' | 'technology';
    language?: 'ar' | 'de' | 'en' | 'es' | 'fr' | 'he' | 'it' | 'nl' | 'no' | 'pt' | 'ru' | 'sv' | 'ud' | 'zh';
    country?:
        | 'ae'
        | 'ar'
        | 'at'
        | 'au'
        | 'be'
        | 'bg'
        | 'br'
        | 'ca'
        | 'ch'
        | 'cn'
        | 'co'
        | 'cu'
        | 'cz'
        | 'de'
        | 'eg'
        | 'fr'
        | 'gb'
        | 'gr'
        | 'hk'
        | 'hu'
        | 'id'
        | 'ie'
        | 'il'
        | 'in'
        | 'it'
        | 'jp'
        | 'kr'
        | 'lt'
        | 'lv'
        | 'ma'
        | 'mx'
        | 'my'
        | 'ng'
        | 'nl'
        | 'no'
        | 'nz'
        | 'ph'
        | 'pl'
        | 'pt'
        | 'ro'
        | 'rs'
        | 'ru'
        | 'sa'
        | 'se'
        | 'sg'
        | 'si'
        | 'sk'
        | 'th'
        | 'tr'
        | 'tw'
        | 'ua'
        | 'us'
        | 've'
        | 'za';
}

export interface ResponseObject {
    status: string;
    sources: Sources[];
}

export interface Sources {
    id: string;
    name: string;
    description: string;
    url: string;
    category: string;
    language: string;
    country: string;
}
