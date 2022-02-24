import * as React from 'react';
import { RootDispatch, RootState } from '../Root';
import FC = React.FC;
import { useContext } from 'react';
import { Action, AppState, SearchOptions } from '../Types';
import { CollapseContainer } from '../CollapseContainer';
import { Col, Input, Label, Row } from 'reactstrap';
import { FormItem } from '../Forms/FormItem';

export interface SearchProp {
    className?: string;
    showSearch: boolean;
    inline?: boolean;
}

export const SearchForm: FC<SearchProp> = ({ showSearch, inline, className }) => {

    const dispatch = useContext<React.Dispatch<Action>>(RootDispatch);
    const state = useContext<AppState>(RootState);
    const searchOptions = state.searchOptions;

    const onChangeSearchOptions = (e: SearchOptions) => {
        dispatch({ type: 'searchOptions', payload: e });
    };

    if (!showSearch)
        return null;

    return <div className={className}>
        <FormItem htmlFor='search-terms-select' label='Search terms' inline={inline} rowClassName='mb-3'>
            <Input type='text'
                id='search-terms-select'
                name='searchTerms'
                value={state.searchOptions.searchTerms}
                onChange={(e) => {
                    const searchTerms = e.target.value;
                    const newSearchOptions = { ...searchOptions, searchTerms };
                    onChangeSearchOptions(newSearchOptions);
                }} />
        </FormItem>

        <CollapseContainer id='search-form-options' title='Additional search options'>
            <FormItem htmlFor='postcode-select' label='Postcode' inline={inline} rowClassName='mb-3'>
                <input className='form-control' type='text' name='postcode' value={state.searchOptions.postcode} onChange={(e) => {
                    const postcode = e.target.value;
                    const distance = 10;
                    const newSearchOptions = { ...searchOptions, postcode, distance };
                    onChangeSearchOptions(newSearchOptions);
                }} />
            </FormItem>

            <FormItem htmlFor='distance-select' label='Find services within' rowClassName='mb-3'>
                <Row className='pb-0'>
                    <Col sm='auto'>
                        <input className='form-control input-short' type='number' name='distance'
                            value={state.searchOptions.distance}
                            onChange={(e) => {
                                const distance = e.target.valueAsNumber;
                                const newSearchOptions = { ...searchOptions, distance };
                                onChangeSearchOptions(newSearchOptions);
                            }} />
                    </Col>
                    <Col sm='auto'>
                        <Label>km</Label>
                    </Col>
                    <Col sm='12'>
                        <small>We will only show services for which this postcode is eligible</small>
                    </Col>
                </Row>
            </FormItem>

            <FormItem htmlFor='ageRangeFrom' label='Age range' inline={inline}>
                <Row className='pb-0'>
                    <Col sm='auto'>
                        <Row>
                            <Col sm='auto' className='pe-0'>
                                <Label htmlFor='ageRangeFrom'>From</Label>
                            </Col>
                            <Col sm='auto'>
                                <input className='form-control input-short' type='number' name='ageRangeFrom'
                                    value={state.searchOptions.ageRangeFrom} onChange={(e) => {
                                        const ageRangeFrom = e.target.valueAsNumber;
                                        const newSearchOptions = { ...searchOptions, ageRangeFrom };
                                        onChangeSearchOptions(newSearchOptions);
                                    }} />
                            </Col>
                        </Row>
                    </Col>
                    <Col sm='auto'>
                        <Row className='pb-0'>
                            <Col sm='auto' className='pe-0'>
                                <Label htmlFor='ageRangeTo'>To</Label>
                            </Col>
                            <Col sm='auto'>
                                <input className='form-control input-short' type='number' name='ageRangeTo'
                                    value={state.searchOptions.ageRangeTo} onChange={(e) => {
                                        const ageRangeTo = e.target.valueAsNumber;
                                        const newSearchOptions = { ...searchOptions, ageRangeTo };
                                        onChangeSearchOptions(newSearchOptions);
                                    }} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </FormItem>
        </CollapseContainer>
    </div>;
};