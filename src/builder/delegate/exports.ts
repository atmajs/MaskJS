import { builder_buildFactory } from './build';
import { IBuilderConfig } from './IBuilderConfig';

export function builder_buildDelegate (opts: IBuilderConfig){		
    return builder_buildFactory(opts);
};
