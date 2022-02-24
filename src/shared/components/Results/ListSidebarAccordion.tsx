import FC = React.FC;
import { CircumstancesForm } from '../Search/CircumstancesForm';
import { NeedsForm } from '../Search/NeedsForm';
import { TypeOfServiceForm } from '../Search/TypeOfServiceForm';
import { RootState } from '../Root';
import { AppState } from '../Types';
import { useContext } from 'react';

interface AccordionItemProps {
    parentId: string;
    id: string;
    title: React.ReactNode;
    collapsed?: boolean;
    className? : string;
}

export const AccordionItem: FC<AccordionItemProps> = ({ parentId, id, title, children, collapsed = true, className }) => {
    const headingId = `${id}-heading`;
    return <div className={'accordion-item ' + className}>
        <div className={`accordion-header ${collapsed ? 'collapsed' : ''}`} id={headingId} role='button' data-bs-toggle='collapse' data-bs-target={`#${id}`} aria-expanded={!collapsed} aria-controls={id}>
            {title}
        </div>
        <div id={id} className={`accordion-collapse collapse ${collapsed ? '' : 'show'}`} aria-labelledby={headingId} data-bs-parent={`#${parentId}`}>
            <div className='accordion-body'>
                {children}
            </div>
        </div>
    </div>
};

export const SideBarAccordion: FC = () => {

    const state = useContext<AppState>(RootState);
    const { selectedTaxonomyItem } = state;
    const type = selectedTaxonomyItem?.type;

    const id = `side-bar-accordion`;

    return <div className='accordion mb-3' id={id}>
        {state.taxonomies.service_type.url != "" &&
            <AccordionItem parentId={id} id={`results-service_type-filter`} title={`Search for types of service`} collapsed={type !== 'service_type'}>
                <TypeOfServiceForm showSearch={false} inline={false} />
            </AccordionItem>
        }
        {state.taxonomies.need.url != "" &&

            <AccordionItem parentId={id} id={`results-need-filter`} title={`Search based on your needs`} collapsed={type !== 'need'}>
                <NeedsForm showSearch={false} inline={false} />
            </AccordionItem>
        }
        {state.taxonomies.circumstance.url != "" &&

            <AccordionItem parentId={id} id={`results-circumstance-filter`} title={`Search based on your circumstances`} collapsed={type !== 'circumstance'}>
                <CircumstancesForm showSearch={false} inline={false} />
            </AccordionItem>
        }
    </div>;
};