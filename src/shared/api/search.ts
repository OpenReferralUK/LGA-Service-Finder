import axios from 'axios';
import { AppState, Results, SearchParams, SearchResult, Service, TaxonomyItem, TaxonomySearchResult } from '../components/Types';
import { getLocationForMapForAllServices } from '../components/utilities';

const getSearchParams = (state: AppState, serviceTypeId?: string): SearchParams => {
    const params: any = {
        postcode: state.searchOptions.postcode,
        proximity: state.searchOptions.distance == 0 ? '' : state.searchOptions.distance * 1000,
        maximum_age: state.searchOptions.ageRangeTo == 0 ? '' : state.searchOptions.ageRangeTo,
        minimum_age: state.searchOptions.ageRangeFrom == 0 ? '' : state.searchOptions.ageRangeFrom,

        text: state.searchOptions.searchTerms,

        include: 'contacts,service_at_locations'
    };

    if (!!serviceTypeId) {
        params.taxonomy_id = serviceTypeId;
        params.vocabulary = 'esdServiceTypes';
    }

    const cleanParams: SearchParams = {};
    Object.keys(params).forEach(key => {
        if (!params[key])
            return;
        cleanParams[key] = params[key];
    });

    return cleanParams;
};

export const getAllSearchParams = (state: AppState): SearchParams[] => {
    const item = state.selectedTaxonomyItem?.item;

    if (!item)
        return [getSearchParams(state)];

    return item.mappings.map(mapping => getSearchParams(state, mapping.identifier));
};

const emptySearchResults: SearchResult = Object.freeze({
    totalElements: 0,
    totalPages: 0,
    number: 1,
    size: 0,
    first: true,
    last: true,
    empty: true,
    content: []
});

const search = async (apiUrl: string, params: SearchParams): Promise<SearchResult> => {
    try {
        const response = await axios.get<SearchResult>(apiUrl, { params });
        return response.data;
    } catch (error) {
        console.log(error);
        return emptySearchResults;
    }
};

export const EmptyLoadingResults: Results = Object.freeze({
    requestId: {},
    params: [{}],
    isLoading: true,
    services: [],
    locationsForMap: [],
    totalElements: 0,
    nextParams: []
});

export const getServicesById = (allServices: Service[]): Record<string, Service> => {
    const servicesById: Record<string, Service> = {};
    allServices.forEach(service => {
        const id = service.id;
        if (!id || !!servicesById[id])
            return;
        servicesById[id] = service;
    });
    return servicesById;
};

export const getDistinctServices = (allServices: Service[]) => {
    return Object.values(getServicesById(allServices));
};

export const getDifferentServicesById = (newServices: Service[], servicesById: Record<string, Service>) => {
    const differentServicesById: Record<string, Service> = {};
    newServices.forEach(service => {
        const id = service.id;
        if (!id || !!servicesById[id] || !!differentServicesById[id])
            return;
        differentServicesById[id] = service;
    });
    return differentServicesById;
};

export const getUnionOfServicesById = (a: Record<string, Service>, b: Record<string, Service>): Record<string, Service> => {
    return { ...a, ...b };
};

export const sortServices = (services: Service[]) => {
    services.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
};

export const multiSearch = async (apiUrl: string, params: SearchParams[], requestId: any): Promise<Results> => {
    const searches = params.map(params => search(apiUrl, params));

    const allResults = await Promise.all(searches);
    const allServices: Service[] = allResults.reduce((allServices: Service[], result) => allServices.concat(result?.content || []), []);
    const nextParams: SearchParams[] = allResults.reduce((nextParams: SearchParams[], result, i) => {
        if (!result || result.totalPages <= result.number)
            return nextParams;
        const thisParams = { ...params[i] };
        const page = (parseInt(thisParams.page || '1') || 1) + 1;
        thisParams.page = page.toString();
        nextParams.push(thisParams);
        return nextParams;
    }, []);

    const services = getDistinctServices(allServices);
    sortServices(services);
    const totalElements = allResults.length === 1 ? allResults[0].totalElements : services.length;
    const locationsForMap = getLocationForMapForAllServices([]);

    return { requestId, params, isLoading: false, services, locationsForMap, totalElements, nextParams };
};

export const searchTaxonomies = async (url: string) => {
    try {
        const response = await axios.get<TaxonomySearchResult>(url, {});
        return response.data.list.items;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error);
            return new Array<TaxonomyItem>();
        } else {
            console.log(error);
            return new Array<TaxonomyItem>();
        }
    }
};