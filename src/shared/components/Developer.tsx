import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ReturnURLProps } from './Results/ServiceInfo';
import { RootDispatch, RootState } from './Root';
import { Action, AppState, Taxonomies, Taxonomy } from './Types';

interface TaxonomyUrlFormProps { taxonomy: Taxonomy };

// const serviceTypeText = <p className='developer-text'>This is a link to a file or web method that maps from chosen service type names to the formal service type identifiers in a published taxonomy. The default uses the <a href='http://id.esd.org.uk/list/services'>LGA's service types list</a> with the same from and to service types. Each directory might replace the from names with wording chosen for its audience.</p>;
// const needsText = <p className='developer-text'>This is a link to a file or web method that maps from chosen needs to the formal service type identifiers in a published taxonomy. The default uses the <a href='http://id.esd.org.uk/list/needs'>LGA's needs list</a> mapped to service types.</p>;
// const circumstanceText = <p className='developer-text'>This is a link to a file or web method that maps from chosen circumstances to the formal service type identifiers in a published taxonomy. The default uses the <a href='http://id.esd.org.uk/list/circumstances'>LGA's personal circumstance list</a> mapped to service types.</p>;

const service_type = <p className='developer-text'>This is a link to a file or web method that maps from chosen service type names to the formal service type identifiers in a published taxonomy. The default uses the <a href='http://id.esd.org.uk/list/services'>LGA's service types list</a> with the same from and to service types. Each directory might replace the from names with wording chosen for its audience.</p>;
const need = <p className='developer-text'>This is a link to a file or web method that maps from chosen needs to the formal service type identifiers in a published taxonomy. The default uses the <a href='http://id.esd.org.uk/list/needs'>LGA's needs list</a> mapped to service types.</p>;
const circumstance = <p className='developer-text'>This is a link to a file or web method that maps from chosen circumstances to the formal service type identifiers in a published taxonomy. The default uses the <a href='http://id.esd.org.uk/list/circumstances'>LGA's personal circumstance list</a> mapped to service types.</p>;

const textLookup: Record<string, JSX.Element> = {
    service_type,
    need,
    circumstance
};

const TaxonomyUrlForm: React.FC<TaxonomyUrlFormProps> = ({ taxonomy }) => {
    const dispatch = useContext<React.Dispatch<Action>>(RootDispatch);

    const onTaxonomyUrlChanged = (type: keyof Taxonomies, url: string) => {
        dispatch({ type: 'taxonomy_url_changed', payload: { type, url } });
    };

    const text = textLookup[taxonomy.id] || null;
    const inputId = `${taxonomy.id}-api-url`;

    return <div className='form-inline mb-2'>
        <h3 className='me-2'>{taxonomy.label} API URL</h3>
        {text}
        <label className='sr-only' htmlFor={inputId}>{taxonomy.label} API URL</label>
        <input id={inputId} className='form-control' type='search' name={taxonomy.label + 'ApiUrl'} value={taxonomy.url} onChange={(e) => {
            onTaxonomyUrlChanged(taxonomy.id as keyof Taxonomies, e.target.value);
        }} />
    </div>;
};

const Developer: React.FC<ReturnURLProps> = ({}) => {

    const dispatch = useContext<React.Dispatch<Action>>(RootDispatch);
    const state = useContext<AppState>(RootState);

    function onChangeApi(e: String, type: String) {
        dispatch({ type: type, payload: e });
    }

    return <div className='my-3'>
        <p className='developer-text'>
            You can change the settings here to reference any service directory that follows
            the <a href='https://developers.openreferraluk.org/ApiReference/'>Open Referral UK standard</a> and
            to configure searches by service type, need and/or circumstance.
            This <a href='https://openreferraluk.org/dashboard'>dashboard</a> shows some published API feeds.
        </p>
        <form className='mt-3 mb-3 developers'>
            <div className='mt-5'>
                <h2>Main API URL</h2>
                <p className='developer-text'>
                    This is the /services web method of any service directory that complies with the Open Referral UK API standard.
                    This dashboard shows some published API feeds.
                </p>
                <label className='sr-only' htmlFor='search-terms-select'>Main API URL</label>
                <input id='search-terms-select' className='form-control' type='search' name='apiUrl' value={state.apiUrl} onChange={(e) => {
                    onChangeApi(e.target.value, 'api');
                }} />
            </div>

            <div className='mt-5'>
                <h2>Selection configuration</h2>
                <p className='developer-text'>
                    The three inputs below tell the Service Finder where to get mappings from service type names,
                    needs and circumstances to formal service type identifiers in an open published taxonomy.
                    The defaults use mappings from and to LGA standard lists via its <a href="https://developertools.esd.org.uk/methods?b2q9ecbe=20220222114050-1#docs-listsmapping">/list/mapping web method</a>,
                    but anyone can create their own personalised mapping.
                    Mappings must be in the JSON structure of the default mappings.
                    Blank out an input below if you don't want to use the corresponding selector in the Service Finder.
                </p>

                {(Object.keys(state.taxonomies) as Array<keyof Taxonomies>)
                    .map(type => <TaxonomyUrlForm key={`taxonomy-url-form-${type}`} taxonomy={state.taxonomies[type]} />)}
            </div>

            <div className='mt-5'>
                <div className='form-check mb-2'>
                    <label className='form-check-label' htmlFor='showApi'>
                        <input className='form-check-input' type='checkbox' id='showApi' name='showApi' value='true' checked={state.showApiCalls}
                            onChange={(e) => {
                                onChangeApi(e.target.checked ? 'true' : 'false', 'showApi');
                            }} />
                        Show API calls in the user interface
                    </label>
                </div>
            </div>
        </form>
        
        <div className='mt-5'>
            <div className='developer-buttons'>
                <button className='btn btn-primary'>Save</button>
                <button className='btn btn-secondary' onClick={() => { onChangeApi('', 'resetApi'); window.location.reload(); }}>Reset</button>
                <Link className='btn btn-secondary' to="/">Back to main page</Link>
            </div>
        </div>
    </div>;
};

export default Developer;