import { builder_buildFactory } from './builder_buildFactory';
import { IBuilderConfig } from './IBuilderConfig';

export function builder_buildDelegate (opts: IBuilderConfig){		
    return builder_buildFactory(opts);
};
