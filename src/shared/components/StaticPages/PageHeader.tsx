import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

const PageHeader: React.FC = () => <header className='page-header hide-print'>
    <Container>
        <Row className='p-0'>
            <Col>
                <h1 className='m-0'>
                    <a href='/'>
                        <img src='/images/pointer.svg' className='main-icon' />
                        Find my services
                    </a>
                </h1>
            </Col>
            <Col xs='auto'>
            <Link to={"/developers" + window.location.search}>Developers</Link>
            </Col>
        </Row>
    </Container>
</header>;

export default PageHeader;