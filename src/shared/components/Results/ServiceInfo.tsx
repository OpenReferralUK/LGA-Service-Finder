
import React, { useContext } from 'react';
import axios from 'axios';
import { FC } from 'react';
import { Card, CardHeader, Col } from 'reactstrap';
import { AppState, Service, PhysicalAddress, LocationWithSchedule, TaxonomyVocabularyItem } from '../Types';
import { Link } from 'react-router-dom';
import { ServiceInfoSideBar } from './ServiceInfoSidebar';
import sanitizeHtml from 'sanitize-html';
import { RootState } from '../Root';
import { MapForLocations } from './MapForLocations';
import { canBeOnMap, getAddressTextFromFirst, getLocationWithSchedule } from '../utilities';

export interface ReturnURLProps {
    returnUrl: string;
}

// const apiUrlStub = 'https://api.porism.com/ServiceDirectoryServiceCombined/services/';

const emptyService: Service = {
    id: '',
    name: '',
    description: '',
    contact: '',
    url: '',
    email: '',
    status: '',
    fees: '',
    accreditations: '',
    deliverable_type: '',
    assured_date: '',
    attending_type: '',
    attending_access: ''
};

export const searchService = async (url: string) => {
    try {
        const response = await axios.get<Service>(url, {});
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error);
            return emptyService;
        } else {
            console.log(error);
            return emptyService;
        }
    }
};

const ApiCall: FC<{ url: string, show: boolean }> = ({ url, show }) => {
    if (!url)
        null;
    if (show) {
        return <Card className='api mb-3'>
            <CardHeader>Data pulled from <a href={url} target='_blank'>{url}</a></CardHeader>
        </Card>;
    }
    else {
        return <></>
    }
};

const taxonomyServiceIdentifier = 'esdServiceTypes';

const Badges: FC<{ service?: Service }> = ({ service }) => {
    if (!service)
        return null;

    const taxonomyItems: TaxonomyVocabularyItem[] = (service.service_taxonomys?.map(ti => ti.taxonomy) || [])
        .filter(t => !!t?.id !== undefined && !!t?.name && t?.vocabulary === taxonomyServiceIdentifier) as TaxonomyVocabularyItem[];

    if (!taxonomyItems.length)
        return null;

    taxonomyItems.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    const badges = taxonomyItems.map(item => <a href={`http://id.esd.org.uk/service/${item.id}`} target='_blank' key={`taxonomy-item-badge-${item.id}`} className='badge bg-secondary me-2 no-external-icon'>{item.name}</a>)

    return <div className='mb-3'>{badges}</div>;
};

const LocationsMap: FC<{ locations: LocationWithSchedule[] }> = ({ locations }) => {
    if (!locations.length)
        return null;

    const locationsFormMap = locations.filter(sl => canBeOnMap(sl));
    if (locationsFormMap.length === 0)
        return <p>No longitude and latitude was provided, so the map is not shown.</p>;

    const numberOnMap = locationsFormMap.length;
    const allLocationsCanBeOnMap = numberOnMap === locations.length;

    return <>
        {!allLocationsCanBeOnMap && <p>{numberOnMap} location{numberOnMap === 1 ? '' : 's'} have a longitude and latitude</p>}
        <MapForLocations locations={locations} />
    </>;
};


const Locations: FC<{ service?: Service }> = ({ service }) => {
    if (!service)
        return null;

    const locationsWithSchedule = getLocationWithSchedule(service);
    const numberOfLocations = locationsWithSchedule.length;
    const hasLocations = numberOfLocations > 0;

    return <div id="locations" className='mt-3'>
        <h3 className='mb-3'>{numberOfLocations} location{numberOfLocations === 1 ? '' : 's'}</h3>
        {!hasLocations && <p>No location information was provided.</p>}
        {locationsWithSchedule.map((l, i) => <LocationDetails key={l.id || `location-${i}`} location={l} />)}
        {<LocationsMap locations={locationsWithSchedule} />}
    </div>;
};

const LocationDetails: FC<{ location: LocationWithSchedule }> = ({ location }) => {
    if (!location)
        null;

    const { schedule, physical_addresses = [] } = location;

    return <div className='mb-3'>
        <h4>{location.name}</h4>
        <PhysicalAddressDetails addresses={physical_addresses} />
        {!!schedule?.description && <p className='mb-0'>
            {schedule.description}
        </p>}
    </div>;
};

const PhysicalAddressDetails: FC<{ addresses: PhysicalAddress[] }> = ({ addresses }) => {
    if (!addresses?.length)
        null;

    const addressText = getAddressTextFromFirst(addresses);

    return <p className='mb-0'>
        {!!addressText && <>{addressText}</>}
    </p>;
};

export const ServiceInfo: FC<ReturnURLProps> = ({ returnUrl }) => {

    const state = useContext<AppState>(RootState);

    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [url, setUrl] = React.useState<string>('');
    const [service, setService] = React.useState<Service>(emptyService);

    React.useEffect(() => {
        const id = new URLSearchParams(window.location.search).get('id') || '';
        const url = `${state.apiUrl}/${id}`;
        setUrl(url);
        searchService(url)
            .then(result => {
                setService(result);
                setIsLoading(false);
            });
    }, []);

    const sanatizedDescriptionHtml = sanitizeHtml(service.description || '');

    return <>
        <Col>
            <Link className='btn btn-primary hide-print' to={returnUrl}>Back to list of services</Link>
            <button className='btn btn-primary right hide-print' onClick={() => window.print()}>Send to print</button>
            <div className='mt-3 mt-md-5'>
                <h2 className='mb-3'>{isLoading ? <>Loading...</> : service.name}</h2>
                <Badges service={service} />
                <ApiCall url={url} show={state.showApiCalls} />
                {!!sanatizedDescriptionHtml && <div dangerouslySetInnerHTML={{ __html: sanatizedDescriptionHtml }}>
                </div>}
                <Locations service={service} />
            </div>
        </Col>
        <Col md='3'>
            <ServiceInfoSideBar service={service} />
        </Col>
    </>;
}
