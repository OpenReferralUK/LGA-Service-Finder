import FC = React.FC;
import { useContext } from 'react';
import { RootDispatch } from '../Root';
import { Action, } from '../Types';
import { SearchForm } from '../Search/SearchForm';
import { Button } from 'reactstrap';
import { AccordionItem, SideBarAccordion } from './ListSidebarAccordion';

export const ListSidebar: FC = () => <div className='container-fluid p-0 m-0 h-100 d-flex flex-column sidebar'>
    <LargeSearchForm />
</div>;

export const LargeSearchForm: FC = () => {
    const dispatch = useContext<React.Dispatch<Action>>(RootDispatch);

    return <form action='/results' method='GET'>
        <SideBarAccordion />

        <div className='mx-3'>
            <SearchForm showSearch={true} inline={false} className='mb-3' />

            <div className='mb-3'>
                <Button color='primary' type='submit'>Find services</Button>
                <Button color='link' type='reset' onClick={() => dispatch({ type: 'reset', payload: '' })}>Start again</Button>
            </div>
        </div>
    </form>;
}

export const SmallSearchForm: FC = () => {
    const dispatch = useContext<React.Dispatch<Action>>(RootDispatch);
    return <AccordionItem className='main-search' parentId={`side-bar-accordion`} id={`all-filter`} title={`Change your search options`} collapsed={true}>
    <form action='/results' method='GET'>
        <SideBarAccordion />

        <div className='mx-3'>
            <SearchForm showSearch={true} inline={false} className='mb-3' />

            <div className='mb-3'>
                <Button color='primary' type='submit'>Find services</Button>
                <Button color='link' type='reset' onClick={() => dispatch({ type: 'reset', payload: '' })}>Start again</Button>
            </div>
        </div>
    </form>
    </AccordionItem>
}