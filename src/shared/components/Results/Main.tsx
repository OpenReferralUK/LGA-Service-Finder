import { useContext, useEffect, useRef } from 'react';
import 'bootstrap';
import { Row } from 'reactstrap';
import { getAllSearchParams, multiSearch } from '../../api/search';
import { RootDispatch, RootState } from '../Root';
import { Action, AppState, SearchParams, Service } from '../Types';
import List from './List';
import { Routes, Route } from 'react-router-dom';
import { ServiceInfo } from './ServiceInfo';

export interface ResultsReceivedPayload {
    services: Service[], 
    params: SearchParams[],
    nextParams: SearchParams[],
    totalElements: number | undefined
}

const searchPage = (dispatch: (value: Action) => void, apiUrl: string, params: SearchParams[], getRequestId: () => any, isFirstPage: boolean = true) => {
    multiSearch(apiUrl, params, getRequestId())
        .then((results) => {
            if (results.requestId !== getRequestId())
                return; // making sure the result is the result we were waiting for

            const { services, nextParams, totalElements: totalExpectedElements } = results;
            const totalElements = isFirstPage ? totalExpectedElements : undefined;

            const hasMore = !!nextParams?.length;
            const payload: ResultsReceivedPayload = { services, params, nextParams, totalElements };

            dispatch({ type: isFirstPage ? 'results_first_page_received' : 'results_page_received', payload });

            if (!hasMore)
                return;

            searchPage(dispatch, apiUrl, results.nextParams, getRequestId, false);
        });
}

const search = (dispatch: (value: Action) => void, state: AppState, getRequestId: () => any) => {
    const { apiUrl, selectedTaxonomyItem } = state;

    if (selectedTaxonomyItem?.isLoading)
        return;

    const params = getAllSearchParams(state);
    const payload: { requestId: any, params: SearchParams[] } = { requestId: getRequestId(), params };
    dispatch({ type: 'results_requested', payload });

    searchPage(dispatch, apiUrl, params, getRequestId);
};

export default () => {
    const dispatch = useContext<React.Dispatch<Action>>(RootDispatch);
    const state = useContext<AppState>(RootState);
    const { selectedTaxonomyItem, searchOptions, results } = state;
    const timerId = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!!timerId.current) {
            clearTimeout(timerId.current);
            timerId.current = null;
        }

        if (selectedTaxonomyItem?.isLoading)
            return;

        timerId.current = setTimeout(() => search(dispatch, state, () => timerId.current), 500);

    }, [selectedTaxonomyItem, searchOptions]);

    return <Row className='results h-100 mt-3'>
        <Routes>
            <Route path='/serviceInfo' element={<ServiceInfo returnUrl={'/results' + window.location.search} />} />
            <Route path='*' element={<List url={state.apiUrl} results={results} />} />
        </Routes>
    </Row>;
};