function ICustomTag() {
  this.attr = {};
}

ICustomTag.prototype.render = function (values, stream) {
  return stream instanceof Array ? Builder.buildHtml(this.nodes, values, stream) : Builder.buildDom(this.nodes, values, stream);
};

var CustomTags = function () {

  var renderICustomTag = ICustomTag.prototype.render;

  function List() {
    this.attr = {};
    this.nodes = null;
  }

  List.prototype.render = function (values, container, cntx) {
    var attr = this.attr,
        attrTemplate = attr.template,
        nodes,
        template,
        fn,
        i, length;

    values = Helper.getProperty(values, attr.value);
    if (!(values instanceof Array))
      return container;


    if (attrTemplate != null) {
      template = document.querySelector(attrTemplate).innerHTML;
      nodes = mask.compile(template);
    }


    if (nodes == null)
      return container;

    //- fn = container instanceof Array ? 'buildHtml' : 'buildDom';
    fn = Builder[container.buffer != null ? 'buildHtml' : 'buildDom'];

    for (i = 0, length = values.length; i < length; i++) {
      fn(nodes, values[i], container, cntx);
    }

    this.nodes = nodes;

    return container;
  };


  function Visible() {
    this.attr = {}
  }

  Visible.prototype.render = function (values, container, cntx) {
    if (!ValueUtilities.out.isCondition(this.attr.check, values))
      return container;
    else
      return renderICustomTag.call(this, values, container, cntx);
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
