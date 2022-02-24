import React from 'react';
import { useReducer } from 'react';
import { Action, AppState, SearchParams, Taxonomies, TaxonomyItem, TaxonomyItemState } from './Types';
import FC = React.FC;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchForm from './SearchForm';
import Main, { ResultsReceivedPayload } from './Results/Main';
import Developer from './Developer';
import { searchTaxonomies } from '../api/search';
import { Container } from 'reactstrap';
import PageHeader from './StaticPages/PageHeader';
import PageFooter from './StaticPages/PageFooter';
import { appendPageToResultsState, createNewResultsState } from './ResultsState';
import { JsonTree } from './JsonTree/JsonTree';
import About from './StaticPages/About';
import Cookies from './StaticPages/Cookies';
import Privacy from './StaticPages/Privacy';

const emptyState: AppState = {
    taxonomy: '',
    //taxonomyApi: '',
    apiUrl: '',
    showApiCalls: false,
    searchOptions: { postcode: '', distance: 0, ageRangeFrom: 0, ageRangeTo: 0, searchTerms: '' },
    taxonomies: {
        service_type: { id: "service_type", isLoading: false, label: '', items: [], url: '' },
        need: { id: "need", isLoading: false, label: '', items: [], url: '' },
        circumstance: { id: "circumstance", isLoading: false, label: '', items: [], url: '' }
    },
    results: createNewResultsState()
};

function getCookie(name: String) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function setCookie(name: String, value: String, expireTime: number) {
    var expires = "";
    var date = new Date();
    date.setTime(date.getTime() + (expireTime * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();

    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

const getInitialState = (query: URLSearchParams) => {

    const taxonomies = {
        service_type: { id: "service_type", isLoading: true, label: 'Types of service', items: [], url: getCookie("service_type") ?? 'https://webservices.esd.org.uk/lists/mapping?from=services&to=services&toTag=Bristol' },
        need: { id: "need", isLoading: true, label: 'Needs', items: [], url: getCookie("need") ?? 'https://webservices.esd.org.uk/lists/mapping?from=needs&to=services&toTag=Bristol' },
        circumstance: { id: "circumstance", isLoading: true, label: 'Circumstances', items: [], url: getCookie("circumstance") ?? 'https://webservices.esd.org.uk/lists/mapping?from=circumstances&to=services&toTag=Bristol' },
    };

    const types = (Object.keys(taxonomies) as Array<keyof Taxonomies>);
    const type = types.find(type => !!query.get(type));

    const selectedTaxonomyItem: TaxonomyItemState | undefined = !!type ? { type, isLoading: true } : undefined;

    const initialState: AppState = {
        taxonomy: query.get('taxonomy') ?? '',
        apiUrl: getCookie("api") ?? 'https://bristol.openplace.directory/o/ServiceDirectoryService/v2/services', //'https://api.porism.com/ServiceDirectoryServiceCombined/services',
        showApiCalls: getCookie("showApi") == "true" ? true : false,
        searchOptions: {
            postcode: query.get('postcode') ?? '',
            ageRangeFrom: parseInt(query.get('ageRangeFrom') ?? '0'),
            ageRangeTo: parseInt(query.get('ageRangeTo') ?? '0'),
            searchTerms: query.get('searchTerms') ?? '',
            distance: parseInt(query.get('distance') ?? (query.get('postcode') == null ? '0' : '10'))
        },
        taxonomies,
        selectedTaxonomyItem,
        results: createNewResultsState()
    };

    return initialState;
};

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const initialState = getInitialState(urlParams);

export const reducer = (state: AppState = initialState, action: Action): AppState => {

    switch (action.type) {
        case 'taxonomy_item_selected': {
            const selectedTaxonomyItem = action.payload as TaxonomyItemState;
            return { ...state, selectedTaxonomyItem };
        }
        case 'searchOptions':
            return { ...state, searchOptions: action.payload };
        case 'api':
            setCookie("api", action.payload, 1000)
            return { ...state, apiUrl: action.payload };
        case 'showApi':
            setCookie("showApi", action.payload, 1000);
            return { ...state, showApiCalls: action.payload == "true" };
        case 'reset':
            return { ...emptyState, apiUrl: state.apiUrl, taxonomies: state.taxonomies, searchOptions: { ...emptyState.searchOptions } };
        case 'resetApi':
            setCookie("circumstance", "", 0);
            setCookie("need", "", 0);
            setCookie("service_type", "", 0);
            setCookie("api", "", 0);
            setCookie("showApi", "", 0);
            return { ...initialState, searchOptions: { ...emptyState.searchOptions } };
        case 'results_requested': {
            const { requestId, params } = action.payload as { requestId: any, params: SearchParams[] };
            return { ...state, results: createNewResultsState(requestId, params) };
        }
        case 'results_first_page_received':
        case 'results_page_received': {
            const { services, nextParams, totalElements } = action.payload as ResultsReceivedPayload;
            return { ...state, results: appendPageToResultsState(state.results, services, nextParams, totalElements) };
        }
        case 'results_page_received__old': {
            return state;
            // const { services, nextParams } = action.payload as { services: Service[], nextParams: SearchParams[] };
            // return { ...state, results: appendPageToResultsState(state.results, services, nextParams) };

            // const oldResults: Results = state.results;
            // const newResults: Results = action.payload;

            // const services = getDistinctServices(oldResults.services.concat(newResults.services));
            // const results: Results = {
            //     ...oldResults,
            //     services,
            //     isLoading: newResults.isLoading,
            //     nextParams: newResults.nextParams,
            //     totalElements: oldResults.totalElements < services.length ? services.length : oldResults.totalElements,
            //     params: oldResults.params.concat(newResults.params)
            // };

            // return {
            //     ...state,
            //     results
            // };
        }
        case 'taxonomy_loaded': {
            const taxonomies = { ...state.taxonomies };
            const type = action.payload.type as keyof Taxonomies;
            const items = action.payload.items as TaxonomyItem[];
            taxonomies[type] = { ...taxonomies[type], isLoading: false, items };
            return { ...state, taxonomies };
        }
        case 'taxonomy_url_changed': {
            const taxonomies = { ...state.taxonomies };
            const type = action.payload.type as keyof Taxonomies;
            const url = action.payload.url as string;
            setCookie(action.payload.type, url, 1000)
            taxonomies[type] = { ...taxonomies[type], url };
            return { ...state, taxonomies };
        }
        default:
            return state;
    }
};

export const RootDispatch = React.createContext({} as React.Dispatch<Action>);
export const RootState = React.createContext(initialState);

const loadTaxonomies = (type: keyof Taxonomies, url: string, query: URLSearchParams, dispatch: React.Dispatch<Action>) => {
    return searchTaxonomies(url)
        .then(items => {
            items.sort((a, b) => a.label.localeCompare(b.label));
            setSelectedTaxonomyIItem(type, items, query, dispatch);
            dispatch({
                type: 'taxonomy_loaded',
                payload: { type, items }
            });
            return items;
        })
        .then(items => {
            return items;
        });
};

const setSelectedTaxonomyIItem = (type: keyof Taxonomies, items: TaxonomyItem[], query: URLSearchParams, dispatch: React.Dispatch<Action>) => {
    const identifier = query.get(type);
    if (!identifier)
        return;
    const item = items.find(item => item.identifier === identifier);
    if (!item)
        return;
    const payload: TaxonomyItemState = { type, item, isLoading: false };
    dispatch({
        type: 'taxonomy_item_selected',
        payload
    });
};

export const Root: FC = () => {

    const [state, dispatch] = useReducer(reducer, initialState);

    React.useEffect(() => {
        const search = window?.location?.search;
        const query: URLSearchParams = new URLSearchParams(search);

        (Object.keys(state.taxonomies) as Array<keyof Taxonomies>).forEach(async type => {
            await loadTaxonomies(type, state.taxonomies[type].url, query, dispatch);
        });
    }, []);

    return <>
        <RootDispatch.Provider value={dispatch}>
            <RootState.Provider value={state}>
                <Router>
                    <PageHeader />
                    <main className='page-main' id='pdf-print'>
                        <Container>
                            <Routes>
                                <Route path='/results/*' element={<Main />} />
                                <Route path='/developers' element={<Developer returnUrl={window.location.pathname} />} />
                                <Route path='/about' element={<About />} />
                                <Route path='/cookies' element={<Cookies />} />
                                <Route path='/privacy' element={<Privacy />} />
                                <Route path='/tree' element={<JsonTree />} />
                                <Route path='*' element={<SearchForm />} />
                            </Routes>
                        </Container>
                    </main>
                    <PageFooter />
                </Router>
            </RootState.Provider>
        </RootDispatch.Provider>
    </>;
};