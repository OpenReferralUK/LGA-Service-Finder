import React from 'react';
import { Container, Row, Col } from 'reactstrap';

const Privacy: React.FC = () => <div className='about'>
    <Container>
        <Row>
            <Col className='pt-3'>
                <h2 className='pb-3'>Privacy policy</h2>

                <p>It is our policy to respect your privacy regarding any information we may collect while operating our website. This Privacy Policy applies to servicefinder.esd.org.uk (hereinafter, "us", "we", or "http://servicefinder.esd.org.uk "). We respect your privacy and have adopted this privacy policy to explain what information may be collected on our Website, how we use this information, and under what circumstances we may disclose the information to third parties. This Privacy Policy applies only to information we collect through the Website and does not apply to our collection of information from other sources.</p>

                <h3>Website visitors</h3>

                <p>Like most website operators, we collect non-personally-identifying information of the sort that web browsers and servers typically make available, such as the browser type, language preference, referring site, and the date and time of each visitor request. Our purpose in collecting non-personally identifying information is to better understand how our visitors use the website. We do not collect any personally identifying information on this website.</p>

                <h3>Links to external sites</h3>

                <p>Our Service may contain links to external sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy and terms of service of every site you visit.</p>

                <p>We have no control over, and assume no responsibility for the content, privacy policies or practices of any third party sites, products or services.</p>

                <h3>Cookies</h3>

                <p>To track visitors' use of the website and to deliver certain essential functionality, Find My Services uses "Cookies". A cookie is a string of information that a website stores on a visitor's computer, and that the visitor's browser provides to the website each time the visitor returns. Our cookie policy provides more information about the cookies we use.</p>

                <h3>Contact information</h3>

                <p>If you have any questions about our Privacy Policy, please contact us via email at <a href="mailto:support@esd.org.uk?subject=Service%20Finder">support@esd.org.uk</a>   </p>
            </Col>
        </Row>
    </Container>
</div>;

export default Privacy;