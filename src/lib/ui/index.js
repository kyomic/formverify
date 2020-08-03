import index from './index.js';
import {env} from '@/lib/env';
import "./layout.scss";
import "./ui.scss";
import "./mobile.scss";
let mods = {};
export var getComponent = ( name ) => {
  let name_env = '';
  if( env.framework == 'react'){
    name_env = './' + name + '.react.js';
  }else{
    name_env = './' + name + '.vue';
  }
  let module = mods[ name_env ];
  if( !module ){
    let requireContext = require.context('.', true, /\.react\.js/i);
    //let id = requireContext.resolve( name_env );
    //let mm = __webpack_require__( id );
    let keys = requireContext.keys().map( key =>{
      //const mod = requireContext(key)
      //console.log("mod=====",mod)
      //let name = /(\w+)(?=\.)/.exec(key)[0];
      //console.log("name-====", name, key )
      //let a = requireContext( key );
      //console.log("a===",a)
      return key;
    });
    let mod = requireContext( name_env );
    module = mod.__esModule ? mod.default: mod;
    mods[ name_env ] = module;    
  }
  return module;
  
}

let KInput = getComponent('KInput')
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