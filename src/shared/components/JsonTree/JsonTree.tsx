import axios from 'axios';
import React, { useState } from 'react';
import { JSONTree } from 'react-json-tree';
import { Button, Input, InputGroup } from 'reactstrap';
import { theme } from './Styling';

// Inside a React component:

export const JsonTree: React.FC = () => {
    const [json, setJson] = useState<any>({});

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const url = (e.target as any).url?.value;

        if (!url) {
            setJson({});
            return;
        }

        axios.get<any>(url, {})
            .catch((e) => console.log('ERROR', e))
            .then((response) => {
                const data = response?.data;
                if (!data) {
                    setJson({});
                    return;
                }

                setJson(data);
            });
    };

    return <div className='json-tree my-3'>
        <form onSubmit={onSubmit}>
            <InputGroup>
                <Input name='url' defaultValue={'https://api.porism.com/ServiceDirectoryServiceCombined/services'} placeholder='API URL which returns JSON' />
                <Button color='primary' type='submit'>Load JSON</Button>
            </InputGroup>
        </form>
        {!!json && !!Object.keys(json).length && Object.getPrototypeOf(json) === Object.prototype &&
            <JSONTree data={json} theme={theme} />}
    </div>;
};