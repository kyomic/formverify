import React, { Component } from 'react';
import { render } from 'react-dom';

import App from './lib/app.react.js';
//let runtime = require("./runtime.js")
//console.log('runtime', runtime)



import verify from './lib/utils/verify.js'
console.log('runtime----------', verify )
// 加载组件到 DOM 元素 mountNode

render(<App />, document.querySelector("#app"));