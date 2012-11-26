var Helper = {
  extend          : function (target, source) {
    if (source == null) return target;
    if (target == null) target = {};
    for (var key in source) target[key] = source[key];
    return target;
  },
  getProperty     : function (o, chain) {
    if (typeof o !== 'object' || chain == null) return o;
    if (typeof chain === 'string') chain = chain.split('.');
    if (chain.length === 1) return o[chain[0]];
    return this.getProperty(o[chain.shift()], chain);
  },
  templateFunction: function (arr, o) {

    var output = '';
    for (var i = 0; i < arr.length; i++) {
      if (i % 2 === 0) {
        output += arr[i];
      } else {
        var key = arr[i],
            value = null,
            index = key.indexOf(':');

        if (index > -1) {
          var utility = index > 0 ? key.substring(0, index).replace(regexpWhitespace, '') : '';
          if (utility === '') utility = 'condition';

          key = key.substring(index + 1);
          value = typeof ValueUtilities[utility] === 'function' ? ValueUtilities[utility](key, o) : null;

        } else {
          value = Helper.getProperty(o, arr[i]);
        }
        output += value == null ? '' : value;
      }
    }
    return output;
  }
};
