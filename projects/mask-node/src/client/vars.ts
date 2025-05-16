declare var mask;

const custom_Attributes = mask.getAttrHandler();
const custom_Tags = mask.getHandlers();
const custom_Utils = mask.getUtil();
const Dom = mask.Dom;
const log_warn = mask.log.warn;

let rootModel;
let rootID;


export {
    custom_Attributes,
    custom_Tags,
    custom_Utils,
    Dom,
    log_warn,
}


export function setRootModel (models) {
    rootModel = models;
}
export function getRootModel () {
    return rootModel;
}
export function setRootID (ID) {
    rootID = ID;
}
export function getRootID () {
    return rootID;
}

