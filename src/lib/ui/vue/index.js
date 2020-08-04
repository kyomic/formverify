import index from './index.js';
import {env} from '@/lib/env';
import "@/lib/ui/layout.scss";
import "@/lib/ui/ui.scss";
import "@/lib/ui/mobile.scss";
let mods = {};
export var getComponent = ( name ) => {
  let name_env = name_env = './' + name + '.vue';  
  let module = mods[ name_env ];
  if( !module ){
    let requireContext = require.context('.', true, /K.*\.vue/i );
    //let id = requireContext.resolve( name_env );
    //let mm = __webpack_require__( id );
    let keys = requireContext.keys().map( key =>{
      return key;
    });
    let mod = requireContext( name_env );
    module = mod.__esModule ? mod.default: mod;
    mods[ name_env ] = module;    
  }
  return module;
  
}
let KFormElement = getComponent('KFormElement');
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
  KFormElement, KForm,KInput,KImage,KButton,KCheckBox,KCheckBoxGroup,KRadio,KRadioGroup,KSelect,KSelectOption,KTextArea,KFile, KImageUpload
}