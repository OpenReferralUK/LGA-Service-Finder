import { getDifferentServicesById, getUnionOfServicesById } from '../api/search';
import { Service, SearchParams, LocationWithSchedule } from './Types';
import { getLocationForMapForAllServices } from './utilities';

export interface ResultsState {
    requestId: any;
    services: Service[];
    servicesById: Record<string, Service>;
    totalElements: number;
    params: SearchParams[];
    nextParams: SearchParams[];
    isLoading: boolean;
    pageIndex: number;
    locations: LocationWithSchedule[];
    newLocations: LocationWithSchedule[];
}

const DefaultResultsState = Object.freeze<ResultsState>({
    requestId: {},
    services: [],
    servicesById: {},
    totalElements: 0,
    params: [],
    nextParams: [],
    isLoading: false,
    pageIndex: 0,
    locations: [],
    newLocations: []
});

export const createNewResultsState = (requestId: any = {}, params: SearchParams[] = []): ResultsState => {
    return { ...DefaultResultsState, requestId, services: [], isLoading: true, params, nextParams: [], locations: [], servicesById: {} };
};

export const appendPageToResultsState = (state: ResultsState, services: Service[], nextParams: SearchParams[] = [], totalExpectedElements?: number): ResultsState => {
    const hasMore = !!nextParams?.length;
    const { services: prevServices, pageIndex = -1, locations: prevLocations = [] } = state;

    const differentServicesById = getDifferentServicesById(services, state.servicesById);
    const newServices = Object.values(differentServicesById);
    const allServices = prevServices.concat(newServices);
    const servicesById = getUnionOfServicesById(state.servicesById, differentServicesById);

    const totalElements = Math.max(totalExpectedElements || state.totalElements, allServices.length);
    const allParams = (state.params || []).concat(nextParams);

    const newLocations = getLocationForMapForAllServices(newServices);
    const locations = prevLocations.concat(newLocations);

    return {
        ...state,
        requestId: state.requestId,
        services: allServices,
        servicesById,
        isLoading: hasMore,
        params: allParams,
        nextParams,
        pageIndex: pageIndex + 1,
        totalElements,
        locations,
        newLocations
    };
};