import * as React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';

interface CollapseContainerProps {
    id: string;
    title: React.ReactNode;
    cardClassName?: string;
}

export const CollapseContainer: React.FC<CollapseContainerProps> = ({ id, cardClassName, title, children }) => {
    return <Card className={cardClassName}>
        <CardHeader data-bs-toggle='collapse' 
            href={`#${id}`} 
            role='button' 
            aria-expanded={false}
            aria-controls={id}
            className='collapsed'>
            {title}
        </CardHeader>
        <CardBody className='collapse py-0' id={id}>
            <div className='py-3'>
                {children}
            </div>
        </CardBody>
    </Card>;
}