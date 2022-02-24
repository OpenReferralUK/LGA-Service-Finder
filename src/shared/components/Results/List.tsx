import React, { FC, Fragment, useContext } from 'react';
import { Link, NavLink, useMatch } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import { CollapseContainer } from '../CollapseContainer';
import { withDefaultErrorBoundary } from '../DefaultErrorBoundary';
import { ResultsState } from '../ResultsState';
import { RootState } from '../Root';
import { AppState, Contact, Service, Location } from '../Types';
import { canBeOnMap, getAddressTextFromFirst, isEmptyContact } from '../utilities';
import { ListSidebar, SmallSearchForm } from './ListSidebar';
import { MapForLocations } from './MapForLocations';

interface ListProps {
    url: string;
    results: ResultsState;
}

const ApiCalls: FC<ListProps> = ({ url, results }) => {
    const params = results?.params || [];
    const state = useContext<AppState>(RootState);

    if (!params.length)
        return null;

    const title = `These results are taken aggregated from ${params.length} API call${params.length === 1 ? '' : 's'}. Expand to view the call URI${params.length === 1 ? '' : 's'}.`
    if (state.showApiCalls) {
        return <CollapseContainer id='results-search-uris' cardClassName='api mb-3' title={title}>
            <ul>
                {params.map((p => {
                    const query = Object.keys(p).map(key => key + '=' + p[key]).join('&');
                    const fullUrl = `${url}?${query}`;
                    return <li key={fullUrl}>
                        <a href={fullUrl} target='_blank'>{fullUrl}</a>
                    </li>;
                }))}
            </ul>
        </CollapseContainer>;
    }
    else return <></>
};

const ServiceInfoColRaw: FC<{ name: string }> = ({ name, children }) => {
    return <Col sm='6'>
        <Row className='pb-2'>
            <Col sm='4'><strong>{name}</strong></Col>
            <Col sm='8' className='text-break'>{children}</Col>
        </Row>
    </Col>;
};

const ServiceInfoCol = withDefaultErrorBoundary(ServiceInfoColRaw);

const ContactDetails: FC<{ contact: Contact }> = ({ contact }) => {
    const phones = contact?.phones?.filter(p => !!p).map((p, i) => <Fragment key={`phone-${i}`}>{p.number?.toString()}<br /></Fragment>);
    return <>
        {!!contact?.name && <span>{contact?.name}</span>}
        {!!phones && phones}
    </>;
};

const Contacts: FC<{ contacts: Contact[] }> = ({ contacts }) => {
    return <>{contacts.map((c, i) => <ContactDetails key={`contact-details-${c.id || i}`} contact={c} />)}</>;
};

const ProvidedBy: FC<{ service: Service }> = ({ service }) => {
    if (!service.organization?.name)
        return null;
    return <ServiceInfoCol name='Provided by:'>
        {!!service.organization?.url
            ? <a href={service.organization?.url} target='_blank'>{service.organization?.name}</a>
            : <span>{service.organization?.name}</span>}
    </ServiceInfoCol>;
};

const Contact: FC<{ service: Service }> = ({ service }) => {
    if (!service.contacts?.length || service.contacts?.every(isEmptyContact))
        return null;
    return <ServiceInfoCol name='Contact:'>
        <Contacts contacts={service.contacts?.filter(c => !isEmptyContact(c))} />
    </ServiceInfoCol>;
};

const Email: FC<{ service: Service }> = ({ service }) => {
    if (!service.email)
        return null;
    return <ServiceInfoCol name='Email:'>
        <a href={`mailto:${service.email}`}>{service.email}</a>
    </ServiceInfoCol>;
};

const Address: FC<{ service: Service }> = ({ service }) => {
    const { service_at_locations } = service;
    if (!service_at_locations?.length)
        return null;
    const locations = service_at_locations.map(sl => sl.location)
        .filter(l => !!l) as Location[];
    if (!locations.length)
        return null;
    const addresses = locations.map((l, i) => <React.Fragment key={`service-${service.id}-location-${i}`}>
        <p className='pb-0'>{getAddressTextFromFirst(l.physical_addresses)} {canBeOnMap(l) && <>(<a href={getServiceInfoUrl(service)}>See on map</a>)</>}</p>
    </React.Fragment>);

    return <ServiceInfoCol name='Address:'>
        {addresses}
    </ServiceInfoCol>;
};

const ServiceInfoRaw: FC<{ service: Service }> = (props) => {
    const { service } = props;

    if (!service.organization?.name && !service.contact && !service.email)
        return null;

    return <Row className='service-info'>
        <ProvidedBy {...props} />
        <Contact {...props} />
        <Email {...props} />
        <Address {...props} />
    </Row>;
};

const ServiceInfo = withDefaultErrorBoundary(ServiceInfoRaw);

const getServiceInfoUrl = (service: Service) => '/results/serviceInfo?id=' + service.id;

const ServiceRowRaw: FC<{ service: Service }> = ({ service }) => <div className='service-row'>
    <Row>
        <Col>
            <h3><Link to={getServiceInfoUrl(service)} className='text-decoration-none'>{service.name || <em>Unamed service</em>}</Link></h3>
        </Col>
        <Col xs='auto'>
            <Link to={getServiceInfoUrl(service)}>Find out more</Link>
        </Col>
    </Row>
    <ServiceInfo service={service} />
</div>;

const ServiceRow = withDefaultErrorBoundary(ServiceRowRaw);

const ListOfServices: FC<ListProps> = ({ results }) => {
    const services = results?.services || [];
    const isLoading = !results ? true : (results?.isLoading || false);
    const params = results?.params || [];

    if (!params.length)
        return null;

    if (isLoading && !services.length)
        return <p>Searching...</p>;

    return <div className='services mb-3'>
        {services.map(service => <ServiceRow key={service.id} service={service} />)}
        {isLoading && <p>Searching...</p>}
    </div>;
};

const MapOfServices: FC<ListProps & { isHidden: boolean }> = ({ results, isHidden }) => {
    return <MapForLocations locations={results.locations} latestPageOfLocations={results.newLocations} requestId={results.requestId} isHidden={isHidden} />;
};

const ListHeadingText: FC<ListProps> = (props) => {
    const { results } = props;
    const services = results?.services || [];
    const totalElements = results?.totalElements || 0;
    const isLoading = !results ? true : (results?.isLoading || false);

    if (!isLoading)
        return <>{services.length} service{services.length === 1 ? '' : 's'} found</>;

    if (!totalElements && !services.length)
        return <>Searching...</>;

    if (!!totalElements && totalElements > services.length)
        return <>{services.length} of {totalElements} service{totalElements === 1 ? '' : 's'} found</>;

    return <>{services.length} service{services.length === 1 ? '' : 's'}  found</>;
};

const List: FC<ListProps> = (props) => {
    return <>
        <Col xs={12} md={3} className='d-none d-md-block'>
            <ListSidebar />
        </Col>
        <Col xs={12} md={3} className='d-md-none'>
            <SmallSearchForm />
        </Col>
        <Col xs={12} md={9}>
            <h2 className='mb-3 mt-3 mt-md-0'>
                <ListHeadingText {...props} />
            </h2>
            <ApiCalls {...props} />
            <ResultTabs {...props} />
        </Col>
    </>
};

const CountOfLocations: FC<ListProps> = ({ results }) => {
    const isLoading = !results ? true : (results?.isLoading || false);    
    const { services = [], locations = [] } = results;
    
    if (isLoading && !services.length)
        return null;

    const countOfAllLocations = services.reduce((total, service) => total + (service.service_at_locations?.length || 0), 0);
    const countOfLocationsOnMap = locations.length;
    const allLocationsAreOnMap = countOfAllLocations === countOfLocationsOnMap;
    return <p>
        {countOfAllLocations} location{countOfAllLocations === 1 ? '' : 's'}{' '}
        {countOfAllLocations > 0 && <>
            ({allLocationsAreOnMap ? 'All' : countOfLocationsOnMap} location{!allLocationsAreOnMap && countOfLocationsOnMap === 1 ? '' : 's'} can be shown on the map)
        </>}
    </p>;
};

const ResultTabs: FC<ListProps> = (props) => {
    const classNameFn = ({ isActive }: { isActive: boolean }) => isActive ? 'btn btn-primary' : 'btn btn-secondary';
    const showMap = useMatch('/results/map');

    return <div className='position-relative'>
        <div className='btn-group mb-3'>
            <NavLink to='/results' end className={classNameFn}>Show as list</NavLink>
            <NavLink to='/results/map' className={classNameFn}>Show on map</NavLink>
        </div>
        <CountOfLocations {...props} />
        <MapOfServices {...props} isHidden={!showMap} />
        {!showMap && <ListOfServices {...props} />}
    </div>;
};

export default List;