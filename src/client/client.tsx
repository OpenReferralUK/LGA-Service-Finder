import 'babel-polyfill';
import * as ReactDOM from 'react-dom';
import { Root } from '../shared/components/Root';

const onLoad = () => {
    ReactDOM.render(<Root />, document.getElementById('root'));
};

const init = () => {
    window.addEventListener('load', onLoad, false);
};

init();