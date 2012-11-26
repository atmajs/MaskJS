function Template(template) {
  this.template = template;
  this.index = 0;
  this.length = template.length;
}

Template.prototype = {
  next                : function () {
    this.index++;
    return this;
  },
  skipWhitespace      : function () {
    //regexpNoWhitespace.lastIndex = this.index;
    //var result = regexpNoWhitespace.exec(this.template);
    //if (result){
    //    this.index = result.index;
    //}
    //return this;

    for (; this.index < this.length; this.index++) {
      if (this.template.charCodeAt(this.index) !== 32 /*' '*/) return this;
    }

    return this;
  },
  skipToChar          : function (c) {
    var index = this.template.indexOf(c, this.index);
    if (index > -1) {
      this.index = index;
      if (this.template.charCodeAt(index - 1) !== 92 /*'\\'*/) {
        return this;
      }
      this.next().skipToChar(c);
    }
    return this;

  },
  /*
   skipToAny           : function (chars) {
   var r = regexp[chars];
   if (r == null) {
   console.error('Unknown regexp %s: Create', chars);
   r = (regexp[chars] = new RegExp('[' + chars + ']', 'g'));
   }

   r.lastIndex = this.index;
   var result = r.exec(this.template);
   if (result != null) {
   this.index = result.index;
   }
   return this;
   },
   */
  skipToAttributeBreak: function () {

    //regexpAttrEnd.lastIndex = ++this.index;
    //var result;
    //do{
    //    result = regexpAttrEnd.exec(this.template);
    //    if (result != null){
    //        if (result[0] == '#' && this.template.charCodeAt(this.index + 1) === 123) {
    //            regexpAttrEnd.lastIndex += 2;
    //            continue;
    //        }
    //        this.index = result.index;
    //        break;
    //    }
    //}while(result != null)
    //return this;
    var c;
    do {
      c = this.template.charCodeAt(++this.index);
      // if c == # && next() == { - continue */
      if (c === 35 && this.template.charCodeAt(this.index + 1) === 123) {
        this.index++;
        c = null;
      }
    }
    while (c !== 46 && c !== 35 && c !== 62 && c !== 123 && c !== 32 && c !== 59 && this.index < this.length);
    //while(!== ".#>{ ;");
    return this;
  },
  sliceToChar         : function (c) {
    var start = this.index,
        isEscaped, index;

    while ((index = this.template.indexOf(c, this.index)) > -1) {
      this.index = index;
      if (this.template.charCodeAt(index - 1) !== 92 /*'\\'*/) {
        break;
      }
      isEscaped = true;
      this.index++;
    }

    var value = this.template.substring(start, this.index);
    return isEscaped ? value.replace(regexpEscapedChar[c], c) : value;

    //-return this.skipToChar(c).template.substring(start, this.index);
  }
  /*
   ,
   sliceToAny          : function (chars) {
   var start = this.index;
   return this.skipToAny(chars).template.substring(start, this.index);
   }
   */
};
