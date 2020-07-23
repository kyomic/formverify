import index from './index.js';
import {env} from '@/lib/env';
import "./ui.scss";

export var getComponent = ( name ) => {
  let name_env = '';
  if( env.framework == 'react'){
    name_env = name + '.react.js';
  }else{
    name_env = name + '.vue';
  }
  let mod = require('./' + name_env);
  return mod.default;
}

let KInput = getComponent('KInput');
let KImage = getComponent('KImage');
let KForm = getComponent('KForm');
let KButton = getComponent('KButton')
let KCheckBox = getComponent('KCheckBox')
let KCheckBoxGroup = getComponent('KCheckBoxGroup')
let KRadio = getComponent('KRadio')
let KRadioGroup = getComponent('KRadioGroup')
let KSelect = getComponent('KSelect')
let KSelectOption = getComponent('KSelectOption');
let KTextArea = getComponent('KTextArea');

let KFile = getComponent('KFile');
let KImageUpload = getComponent('KImageUpload');


export {
  KForm,KInput,KImage,KButton,KCheckBox,KCheckBoxGroup,KRadio,KRadioGroup,KSelect,KSelectOption, KTextArea,KFile, KImageUpload
}