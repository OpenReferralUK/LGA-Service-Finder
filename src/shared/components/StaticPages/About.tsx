import React from 'react';
import { Container, Row, Col } from 'reactstrap';

const About: React.FC = () => <div className='about'>
    <Container>
        <Row>
            <Col className='pt-3'>
                <h2 className='pb-3'>About page</h2>

                <p>The Service Finder was developed by the <a href='https://local.gov.uk/'>Local Government Association</a> (LGA) to illustrate the power of the <a href="https://openreferraluk.org/"> Open Referral UK Standard.</a></p>

                <p>The Standard specifies how data describing human services from councils, government bodies, the voluntary sector and private organisations should be interchanged for use in software applications. It lets you categorise services  according to shared open taxonomies, such as those maintained by the LGA so everyone using the data has the same understanding of what it means.</p>

                <p>By default the Service Finder draws on a combined feed of data read from multiple open feeds from publishing councils and other organisations who apply the Standard, many of whom use the LGA’s taxonomies. The default configuration references the relationships from needs and circumstances to types of service that are defined by the LGA. Via the <a href='https://servicefinder.esd.org.uk/developers'> Developers page</a> you can change from these defaults to your own API feeds and configure how the search works for you.</p>

                <h3>Where does this come from?</h3>

                <p>The Open Referral UK Standard was developed by the LGA and <a href='https://istanduk.org/'>iStandUK</a> on behalf of the Department for Digital Culture Media and Sport in pilot work to identify services that help reduce loneliness. The Standard is an extension of the international Open Referral standard following separate Discovery work funded by the Department for Levelling Up Housing and Communities’ <a href='https://www.localdigital.gov.uk/'>LocalDigital Team.</a> LocalDigital has funded subsequent projects to help councils adopt the standard as it matures.</p>

                <h3>Developer reference</h3>
                
                <p>The source code for the Service Finder is issued under the <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/">Open Government Licence</a> for re-use subject to you crediting the Local Government Association as the original authors..</p>

                <p>You can find the source code <a href="https://github.com/OpenReferralUK/LGA-Service-Finder">here</a> in GitHub.</p>

                <p>The Open Referral UK <a href="https://developers.openreferraluk.org/">developer pages</a> and <a href="https://forum.openreferraluk.org/">community forum</a> provide more information on the Standard. <a href="https://openreferraluk.us1.list-manage.com/subscribe?u=9cdac16b200ed03ca1159653a&id=00056900bd">Subscribe to the Open Referral UK mailing list</a> to stay informed.</p>
            </Col>
        </Row>
    </Container>
</div>;

export default About;