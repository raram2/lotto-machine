// node_modules에서 module 불러오기
import {hot} from 'react-hot-loader/root';
import React from 'react';
import ReactDOM from 'react-dom';
import Machine from './MachineHooks';
const Hot = hot(Machine);

ReactDOM.render(<Hot />, document.getElementById('root'));
