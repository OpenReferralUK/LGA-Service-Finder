import React from 'react';
import { Container, Row, Col } from 'reactstrap';

const PageFooter: React.FC = () => <footer className='page-footer hide-print'>
    <Container>
        <Row className='p-0'>
            <Col xs={12} md={6}>
                Developed by the Local Government Association
            </Col>
            <Col xs={12} md={6}>
                <Row className='pt-3 pt-md-0 justify-content-md-end'>
                    <Col xs='auto'>
                        <a href="/about">About</a>
                    </Col>
                    <Col xs='auto'>
                        <a href="/privacy">Privacy</a>
                    </Col>
                    <Col xs='auto'>
                        <a href="/cookies">Cookies</a>
                    </Col>
                    <Col xs='auto'>
                        <a href="mailto:support@esd.org.uk?subject=Service%20Finder">Email us</a>
                    </Col>
                </Row>
            </Col>
        </Row>
    </Container>
</footer>;

export default PageFooter;