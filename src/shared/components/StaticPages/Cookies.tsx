import React from 'react';
import { Container, Row, Col } from 'reactstrap';

const Cookies: React.FC = () => <div className='about'>
    <Container>
        <Row>
            <Col className='pt-3'>
                <h2 className='pb-3'>Cookie policy</h2>
                
                <h3>What are cookies</h3>

                <p>As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies. We will also share how you can prevent these cookies from being stored.</p>

                <h3>Disabling cookies</h3>

                <p>You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit.</p>

                <h3>The cookies we set</h3>

                <p>Essential functionality cookies</p>

                <p>We set cookies which provide essential functionality:</p>

                <li>Remembering your configuration preferences within the <a href="/Developers">Developers</a> page</li>

                <h3>Third party cookies</h3>

                <p>This site uses Google Analytics which is one of the most widespread analytics solution on the web for helping us to understand how you use the site and ways that we can improve your experience. These cookies may track things such as how long you spend on the site and the pages that you visit. It does not allow us to identify you as an individual.</p>

                <h3>More information</h3>

                <p>For more information email <a href="mailto:support@esd.org.uk?subject=Service%20Finder">support@esd.org.uk</a></p>
            </Col>
        </Row>
    </Container>
</div>;

export default Cookies;