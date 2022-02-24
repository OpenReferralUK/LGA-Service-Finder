import { FC } from 'react';
import { ErrorBoundary, FallbackProps, withErrorBoundary } from 'react-error-boundary'

interface DefaultErrorBoundaryProps {
    showError: boolean;
    errorMessage: string;
    errorClassName: string;
}

const FallbackComponent: FC<FallbackProps & Partial<DefaultErrorBoundaryProps>> = (props) => {
    console.log('ERROR:', props);

    const {
        showError = false,
        errorMessage = 'An error occured.',
        errorClassName = 'alert alert-warning small py-1'
    } = props;

    if (!showError)
        return null;

    return <div className={errorClassName}>{errorMessage}</div>;
};

export const withDefaultErrorBoundary = <TComponent,>(component: React.ComponentType<TComponent>, errorProps?: Partial<DefaultErrorBoundaryProps>) => {
    return withErrorBoundary(component, {
        FallbackComponent: (props: FallbackProps) => <FallbackComponent {...props} {...errorProps} />
    });
};

export const DefaultErrorBoundary: FC<Partial<DefaultErrorBoundaryProps>> = (props) => {
    const Fallback: FC<FallbackProps & Partial<DefaultErrorBoundaryProps>> =
        (fallBackProps) => <FallbackComponent {...fallBackProps} {...props} />;

    return <ErrorBoundary FallbackComponent={Fallback}>
        {props.children}
    </ErrorBoundary>;
};