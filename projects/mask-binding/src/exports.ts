import './attributes/exports'
import './handlers/exports'
import './statements/exports'
import './utilities/exports'

import { CustomProviders } from './BindingProvider';

export { Validators, registerValidator } from './ValidatorProvider';
export { obj_addObserver, obj_removeObserver } from './utils/object_observe'


export const BindingProviders = CustomProviders;

export function registerBinding (name, Prov) {
    CustomProviders[name] = Prov;
}
