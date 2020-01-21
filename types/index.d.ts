/// <reference path="mask.d.ts" />

// import { Mask } from 'mask';

// declare global {
//     const mask: typeof Mask
// }

import { Mask } from 'mask';

declare module "mask" {
    export = Mask;
}