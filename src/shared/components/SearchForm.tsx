import React, { useContext } from 'react';
import SideText from './StaticPages/SideText';
import FC = React.FC;
import {
    Routes,
    Route,
    Link,
    useMatch,
    useResolvedPath,
    LinkProps
} from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { RootDispatch, RootState } from './Root';
import { Action, AppState } from './Types';
import { NeedsForm } from './Search/NeedsForm';
import { CircumstancesForm } from './Search/CircumstancesForm';
import { TypeOfServiceForm } from './Search/TypeOfServiceForm';
import { LargeSearchForm } from './Results/ListSidebar';

const SearchFormLink: FC<LinkProps> = ({ children, to, ...props }) => {
    let resolved = useResolvedPath(to);
    let match = useMatch({ path: resolved.pathname, end: true });

    return <Link
        className={`col ${match ? 'active' : ''}`}
        to={to}
        {...props}
    >
        {children}
    </Link>;
};

const SearchForm: FC = () => {

    return <Row className='mt-4 mt-md-5'>
        <Col xs={12} md={6} className='d-none d-md-block'>
            <LargeSearchBox />
        </Col>
        <Col xs={12} md={6} className='side-text'>
            <SideText />
        </Col>
        <Col xs={12} md={6} className='d-md-none'>
            <SmallSearchBox />
        </Col>
    </Row>;
};

export default SearchForm;

const LargeSearchBox: FC = () => {
    const dispatch = useContext<React.Dispatch<Action>>(RootDispatch);
    const state = useContext<AppState>(RootState);

    var needs = state.taxonomies.service_type.url == "" && state.taxonomies.need.url != "" ? '/' : '/needs';
    var circumstance = state.taxonomies.service_type.url == "" && state.taxonomies.need.url == "" && state.taxonomies.circumstance.url != "" ? '/': '/circumstances' ;

    return <div className='main-search me-md-3'>
        <Row tag='nav' className='m-0'>
            {state.taxonomies.service_type.url != "" &&
                <SearchFormLink to='/'>Search for types of service</SearchFormLink>
            }
            {state.taxonomies.need.url != "" &&

                <SearchFormLink to={needs}>Search based on what you need</SearchFormLink>
            }
            {state.taxonomies.circumstance.url != "" &&

                <SearchFormLink to={circumstance}>Search based on your circumstances</SearchFormLink>
            }
        </Row>

        <form action='/results' method='GET' className='mt-3 mx-4'>
            <Routes>
                {state.taxonomies.need.url != "" &&

                    <Route path={needs} element={<NeedsForm showSearch={true} />} />
                }
                {state.taxonomies.circumstance.url != "" &&

                    <Route path={circumstance} element={<CircumstancesForm showSearch={true} />} />
                }
                {state.taxonomies.service_type.url != "" &&

                    <Route path='*' element={<TypeOfServiceForm showSearch={true} />} />
                }
            </Routes>

{(state.taxonomies.need.url != "" || state.taxonomies.circumstance.url != "" || state.taxonomies.service_type.url != "") &&
            <div className='text-center mt-3'>
                <Button color='primary' type='submit'>Find services</Button>
                <Button color='link' type='reset' onClick={() => dispatch({ type: 'reset', payload: '' })}>Start again</Button>
            </div>
}
        </form>
    </div>;
};

const SmallSearchBox: FC = () => {
    return <div className='main-search me-md-3 mb-3'>
        <LargeSearchForm />
    </div>;
};
