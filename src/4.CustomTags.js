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

  Binding.prototype.render = function () {

    // lazy self definition
    return (Binding.prototype.render = function () {

      var
          ObjectDefineProperty = Object.defineProperty,
          supportsDefineProperty = false,
          watchedObjects;

      if (ObjectDefineProperty) {
        try {
          supportsDefineProperty = Object.defineProperty({}, 'x', {get: function () {
            return true
          }}).x;
        }
        catch (e) {
          supportsDefineProperty = false;
        }
      }
      else {
        if (Object.prototype.__defineGetter__) {
          ObjectDefineProperty = function (obj, prop, desc) {
            if (hasOwnProperty.call(desc, 'get')) obj.__defineGetter__(prop, desc.get);
            if (hasOwnProperty.call(desc, 'set')) obj.__defineSetter__(prop, desc.set);
          };

          supportsDefineProperty = true;
        }
      }

      if (!supportsDefineProperty) {
        watchedObjects = [];

        ObjectDefineProperty = function (obj, prop, desc) {
          var
              objectWrapper,
              found = false,
              i, length;

          for (i = 0, length = watchedObjects.length; i < length; i++) {
            objectWrapper = watchedObjects[i];
            if (objectWrapper.obj === obj) {
              found = true;
              break;
            }
          }

          if (!found)
            objectWrapper = watchedObjects[i] = {obj: obj, props: {}};

          objectWrapper.props[prop] = {
            value: obj[prop],
            set  : desc.set
          };
        };

        function ticker() {
          var
              objectWrapper,
              i, length,
              props,
              prop,
              propObj,
              newValue;

          for (i = 0, length = watchedObjects.length; i < length; i++) {
            objectWrapper = watchedObjects[i];
            props = objectWrapper.props;

            for (prop in props)
              if (hasOwnProperty.call(props, prop)) {
                propObj = props[prop];
                newValue = objectWrapper.obj[prop];
                if (newValue !== propObj.value)
                  propObj.set.call(null, newValue);
              }
          }

          setTimeout(ticker, 16);
        }

        ticker();
      }


      return function (values, container) {
        var
            attrValue = this.attr.value,
            value = values[attrValue];

        ObjectDefineProperty.call(Object, values, attrValue, {
          get: function () {
            return value;
          },
          set: function (x) {
            container.innerHTML = value = x;
          }
        });

        container.innerHTML = value;
        return container;
      }

    }()

        ).apply(this, arguments);
  };

  return {
    all: {
      list   : List,
      visible: Visible,
      bind   : Binding
    }
  };

}();
