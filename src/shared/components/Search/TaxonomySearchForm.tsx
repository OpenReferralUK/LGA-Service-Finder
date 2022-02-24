import * as React from 'react';
import { RootDispatch, RootState } from '../Root';
import FC = React.FC;
import { useContext } from 'react';
import { Action, AppState, Taxonomies, Taxonomy, TaxonomyItemState } from '../Types';
import { SearchForm } from './SearchForm';
import { FormItem } from '../Forms/FormItem';

interface TaxonomySearchFormProps {
    type: keyof Taxonomies;
    showSearch?: boolean;
    taxonomy: Taxonomy;
    inline?: boolean;
}

export const TaxonomySearchForm: FC<TaxonomySearchFormProps> = ({ type, showSearch = true, taxonomy, inline = true }) => {

    const state = useContext<AppState>(RootState);
    const dispatch = useContext<React.Dispatch<Action>>(RootDispatch);
    const { items, isLoading } = taxonomy;

    const onChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const item = items.find(item => item.identifier === e.target.value);
        const payload: TaxonomyItemState = { type, item, isLoading: false };
        dispatch({ type: 'taxonomy_item_selected', payload });
    };

    const selectedItem = state.selectedTaxonomyItem;
    const selectedValue = type === selectedItem?.type ? selectedItem.item?.identifier : '' || '';
    const selectId = `${type}-select`;
    const select = <select className='form-control' name={type} id={selectId} disabled={isLoading}
        value={selectedValue}
        onChange={onChangeHandler}>
        <option value=''>All</option>
        {items.map(item => <option key={item.identifier} value={item.identifier}>{item.label}</option>)}
    </select>;

    return <div>
        <FormItem htmlFor={selectId} label={taxonomy.label} inline={inline} rowClassName={showSearch ? 'mb-3' : ''}>
            {select}
        </FormItem>

        <SearchForm showSearch={showSearch} />
    </div>;
};