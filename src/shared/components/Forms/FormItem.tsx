import * as React from 'react';
import { Col, Row, Label } from 'reactstrap';

interface FormItemProps {
    htmlFor: string;
    label: React.ReactNode;
    rowClassName?: string;
    inline?: boolean;
}

export const FormItem: React.FC<FormItemProps> = ({ htmlFor, label, children, rowClassName = '', inline = true }) => {
    if (!inline)
        return <div className={`form-group ${rowClassName}`}>
            <Label htmlFor={htmlFor}>{label}</Label>
            <>{children}</>
        </div>;

    return <Row className={`form-group ${rowClassName}`}>
        <Col sm='3'><Label htmlFor={htmlFor}>{label}</Label></Col>
        <Col sm='9'>
            {children}
        </Col>
    </Row>;
};