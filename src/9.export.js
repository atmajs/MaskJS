
if (typeof module !== 'undefined' && module.exports) {
	module.exports = Mask;
}

var _cachedGlobalMask = global.mask;

global.mask = Mask;
