import React from 'react';
import { Row, Col } from 'reactstrap';

const SideText: React.FC = () => {
    return <div>
        <h2 className='pb-3'>Helping you find local services</h2>

        <div className='mb-3'>
            <p>Use this page to search for services including care, education, transport, skills,
                child services, employment and more. We have over 1000 services in our database.</p>

            <p>You can search based on the type of service you need (if you know it)
                or tell us something about your general needs or your circumstances
                and we'll do the rest.</p>
        </div>

        <Row>
            <Col xs={7}>
                <img src='/images/photos/1.png' className='img-fluid mb-3' />
                <img src='/images/photos/3.png' className='img-fluid mb-3' />
            </Col>
            <Col xs={5}>
                <img src='/images/photos/2.png' className='img-fluid mb-3' />
                <img src='/images/photos/4.png' className='img-fluid mb-3' />
            </Col>
        </Row>

        <div className='info-box mb-3'>
            <p>
                These pages illustrate how a service finder can be configured to use data from any feed compliant with 
                the <a href="https://openreferraluk.org/dashboard" target="_blank">Open Referral UK data standard</a>.
                We encourage public and community organisations and private innovators to develop their own tools using
                open data feeds.
            </p>
            <p className='mb-0'>
                This instance is configured to use aggregated data from all feeds shown on 
                the <a href="https://openreferraluk.org/dashboard" target="_blank">Open Referral UK dashboard</a>.
            </p>
        </div>
    </div>;
};

export default SideText;