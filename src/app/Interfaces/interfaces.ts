export interface PageBlock {
    url: string;
    position?: number;
    title: string;
    text: string;
    hasButton: boolean;
    buttonTitle: string;
    buttonUrl: string;
    id?: number;
}

export interface CountObject {
    count: number;
}

export interface RESTFilter {
    where?: any;
    limit?: number;
    order?: Array<string>;
    skip?: number;
    search?: string;
}

export interface RESTParams {
    filter?: RESTFilter;
}
