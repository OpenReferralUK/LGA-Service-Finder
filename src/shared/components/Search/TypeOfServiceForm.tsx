import * as React from 'react';
import { RootState } from '../Root';
import FC = React.FC;
import { useContext } from 'react';
import { AppState } from '../Types';
import { SearchProp } from './SearchForm';
import { TaxonomySearchForm } from './TaxonomySearchForm';

export const TypeOfServiceForm: FC<SearchProp> = ({ showSearch, inline }) => {

    const state = useContext<AppState>(RootState);
    const taxonomy = state.taxonomies.service_type;

    return <TaxonomySearchForm 
        type='service_type'
        showSearch={showSearch}
        taxonomy={taxonomy}
        inline={inline} />;
};