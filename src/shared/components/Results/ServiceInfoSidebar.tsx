import { Fragment } from 'react';
import { Col, Row } from 'reactstrap';
import { withDefaultErrorBoundary } from '../DefaultErrorBoundary';
import { Contact, CostOption, Organization, Service } from '../Types';
import { isEmptyContact, isEmptyCostOption } from '../utilities';
import FC = React.FC;

export const ServiceInfoSideBar: FC<{ service: Service }> = ({ service }) => {

    return <div className='container-fluid p-0 m-0 h-100 d-flex flex-column sidebar'>
        <Contacts contacts={service.contacts} />
        <OrganizationDetails organization={service.organization} />
        <CostOptions costOptions={service.cost_options} />
    </div>;
};

const NameValue: FC<{ name: string, value?: string | string[] }> = ({ name, value }) => {
    if (!value || !value.length)
        return null;

    const valueEl = (Array.isArray(value))
        ? value.filter(v => !!v).map((v, i) => <Fragment key={`value-${i}`}>{v}<br /></Fragment>)
        : <>{value}</>;

    return <Row>
        <Col sm={4}>
            <span>{name}</span>
        </Col>
        <Col sm={8}>
            {valueEl}
        </Col>
    </Row>;
};

const Contacts: FC<{ contacts?: Contact[] }> = ({ contacts }) => {
    if (!contacts || !contacts.length || !Array.isArray(contacts))
        return null;

    if (contacts.every(isEmptyContact))
        return null;

    const details = contacts.map((c, i) => <ContactDetails key={c.id || `contact-${i}`} contact={c} />);

    return <div className='section'>
        <h4>Contact details</h4>
        {details}
    </div>;
};

const ContactDetailsRaw: FC<{ contact: Contact }> = ({ contact }) => {
    if (isEmptyContact(contact))
        return null;

    return <div>
        <NameValue name={'Contact:'} value={contact.name} />
        <NameValue name={'Phone:'} value={contact.phones?.map(p => p.number || '')} />
    </div>;
};

const ContactDetails = withDefaultErrorBoundary(ContactDetailsRaw);

const OrganizationDetailsRaw: FC<{ organization?: Organization }> = ({ organization: organisation }) => {
    if (!organisation?.name && !organisation?.email && !organisation?.url)
        return null;

    return <div className='section'>
        <dl>
            {!!organisation.name && <div className='section-item'>
                <dt>Provided by:</dt>
                <dd><strong>{organisation.name?.toString()}</strong></dd>
            </div>}
            {!!organisation.email && <div className='section-item'>
                <dt>Email:</dt>
                <dd><a href={`mailto:${organisation.email}`}>{organisation.email?.toString()}</a></dd>
            </div>}
            {!!organisation.url && <div className='section-item'>
                <dt>Website:</dt>
                <dd><a href={organisation.url} target='_blank'>{organisation.url?.toString()}</a></dd>
            </div>}
        </dl>
    </div>;
};

const OrganizationDetails = withDefaultErrorBoundary(OrganizationDetailsRaw);

const CostOptionsRaw: FC<{ costOptions?: CostOption[] }> = ({ costOptions }) => {
    if (!costOptions || !costOptions.length)
        return null;

    if (costOptions.every(isEmptyCostOption))
        return null;

    const details = costOptions.map((c, i) => <CostOptionDetails key={c.id || `cost-option-${i}`} costOption={c} />);

    return <div className='section'>
        <h4>Cost details</h4>
        {details}
    </div>;
};

const CostOptions = withDefaultErrorBoundary(CostOptionsRaw);

const CostOptionDetailsRaw: FC<{ costOption: CostOption }> = ({ costOption }) => {
    if (isEmptyCostOption(costOption))
        return null;

    return <div>
        {costOption.valid_from}{' '}
        {costOption.valid_to}{' '}
        {costOption.amount}{' '}
        {costOption.amount_description}{' '}
        {costOption.option}
    </div>;
};

const CostOptionDetails = withDefaultErrorBoundary(CostOptionDetailsRaw);