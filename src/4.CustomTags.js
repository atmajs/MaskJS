function ICustomTag() {
  if (this.attr == null) this.attr = {};
}

ICustomTag.prototype.render = function (values, stream) {
  return stream instanceof Array ? Builder.buildHtml(this.nodes, values, stream) : Builder.buildDom(this.nodes, values, stream);
};

var CustomTags = function () {

  function List() {
    this.attr = {}
  }

  List.prototype.render = function (values, container, cntx) {

    values = Helper.getProperty(values, this.attr.value);
    if (values instanceof Array === false) return container;


    if (this.attr.template != null) {
      var template = document.querySelector(this.attr.template).innerHTML;
      this.nodes = mask.compile(template);
    }


    if (this.nodes == null) return container;

    //-var fn = container instanceof Array ? 'buildHtml' : 'buildDom';
    var fn = container.buffer != null ? 'buildHtml' : 'buildDom';

    for (var i = 0, length = values.length; i < length; i++) {
      Builder[fn](this.nodes, values[i], container, cntx);
    }
    return container;
  };


  function Visible() {
    this.attr = {}
  }

  Visible.prototype.render = function (values, container, cntx) {
    if (ValueUtilities.out.isCondition(this.attr.check, values) === false) return container;
    return ICustomTag.prototype.render.call(this, values, container, cntx);
  };


  function Binding() {
    this.attr = {}
  }

  Binding.prototype.render = function (values, container) {
    var value = values[this.attr.value];
    Object.defineProperty(values, this.attr.value, {
      get: function () {
        return value;
      },
      set: function (x) {
        container.innerHTML = (value = x);
      }
    });
    container.innerHTML = value;
    return container;
  };


  return {
    all: {
      list   : List,
      visible: Visible,
      bind   : Binding
    }
  };

}();
