import { ResultsState } from './ResultsState';

export interface Taxonomy {
    id: string;
    url: string;
    label: string;
    isLoading: boolean;
    items: TaxonomyItem[];
}
export interface Taxonomies {
    service_type: Taxonomy;
    need: Taxonomy;
    circumstance: Taxonomy;
};

export type SearchParams = Record<string, string>;

export interface Results {
    requestId: any;
    params: SearchParams[];
    isLoading: boolean;
    services: Service[];
    locationsForMap: LocationWithSchedule[];
    totalElements: number;
    nextParams: SearchParams[];
}

export interface AppState {
    taxonomy: string;
    //taxonomyApi: string;
    searchOptions: SearchOptions;
    showApiCalls: boolean;
    results: ResultsState;
    apiUrl: string;
    taxonomies: Taxonomies;
    selectedTaxonomyItem?: TaxonomyItemState;
}

export interface Action {
    type: any;
    payload: any;
}

export interface TaxonomyItemState {
    type: keyof Taxonomies;
    isLoading: boolean;
    item?: TaxonomyItem;
}

export interface SearchOptions {
    postcode: string;
    ageRangeFrom: number;
    ageRangeTo: number;
    distance: number;
    searchTerms: string;
}
export interface TaxonomyItem {
    identifier: string;
    label: string;
    mappings: TaxonomyItem[];
}

export interface TaxonomyList {
    items: TaxonomyItem[];
}

export interface TaxonomySearchResult {
    list: TaxonomyList;
}

export interface SearchResult {
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
    empty: boolean;
    content: Service[];
}

export interface ServiceSearchResult {
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
    content: Service;
}


// api types 


export interface Service {
    id?: string;
    name?: string;
    description?: string;
    contact?: string;
    url?: string;
    email?: string;
    status?: string;
    fees?: string;
    accreditations?: string;
    deliverable_type?: string;
    assured_date?: string;
    attending_type?: string;
    attending_access?: string;

    organization?: Organization;
    service_at_locations?: ServiceAtLocation[];
    cost_options?: CostOption[];
    contacts?: Contact[];

    service_taxonomys?: ServiceTaxonomy[];
}

export interface Organization {
    id?: string;
    name?: string;
    description?: string;
    email?: string;
    url?: string;
    logo?: string;
    uri?: string;
}

export interface Contact {
    id?: string;
    name?: string;
    title?: string;
    phones?: Phone[];
}

export interface Phone {
    number?: string;
}

export interface ServiceAtLocation {
    location?: Location;
    regular_schedule?: RegularSchedule[];
}

export interface Location {
    id?: string;
    name?: string;
    physical_addresses?: PhysicalAddress[];

    latitude?: number;
    longitude?: number;
}

export type LocationWithSchedule = Location & {
    validLocation: boolean;
    schedule: RegularSchedule | undefined;
    service: Service;
};

export interface PhysicalAddress {
    address_1?: string;
    address_2?: string;
    address_3?: string;
    postal_code?: string;
    state_province?: string;
    city?: string;
    country?: string;
}

export interface RegularSchedule {
    id?: string;
    description?: string;
    opens_at?: string;
    valid_from?: string;
    valid_to?: string;
    closes_at?: string;
    byday?: string;
    bymonthday?: string;
    freq?: string;
    interval?: string;
}

export interface CostOption {
    id?: string;
    valid_from?: string;
    valid_to?: string;
    option?: string;
    amount?: string;
    amount_description?: string;
}

export interface ServiceTaxonomy {
    id?: string;
    taxonomy?: TaxonomyVocabularyItem;
}

export interface TaxonomyVocabularyItem {
    id?: string;
    name?: string;
    vocabulary?: string;
}