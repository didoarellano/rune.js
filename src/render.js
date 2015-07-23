(function(Rune) {

  var Render = Rune.Render = function(params) {

    this.params = params

    this.tree = virtualdom.svg('svg', {
      width: params.width,
      height: params.height
    });

    this.el = virtualdom.createElement(this.tree);

  }

  _.extend(Render.prototype, {

    render: function(stage) {

      var newTree = virtualdom.svg('svg', {
        width: this.params.width,
        height: this.params.height
      }, [this.objectsToSVG(stage.children)]);

      var diff = virtualdom.diff(this.tree, newTree);
      this.el = virtualdom.patch(this.el, diff);
      this.tree = newTree;

      console.log(this.el)
    },

    // Shape converters
    // --------------------------------------------------

    objectToSVG: function(object) {
      if(this[object.type + "ToSVG"])
        return this[object.type + "ToSVG"](object);
      else
        console.error("Rune.Render: Object not recognized", object)
    },

    objectsToSVG: function(objects) {
      return _.map(objects, _.bind(this.objectToSVG, this));
    },

    groupToSVG: function(group) {
      return virtualdom.svg('g', {}, this.objectsToSVG(group.children));
    },

    rectangleToSVG: function(rect) {
      var attr = {}
      this.mixinAttributes(rect, attr);
      return virtualdom.svg('rect', attr);
    },

    ellipseToSVG: function(ellipse) {
      var attr = {
        cx: ellipse.x,
        cy: ellipse.y,
        rx: ellipse.width,
        ry: ellipse.height
      }
      if(ellipse.rotation > 0)
        attr.transform = "rotate(" + ellipse.rotation + ")";
      this.styleableAttributes(ellipse, attr);
      return virtualdom.svg('ellipse', attr);
    },

    circleToSVG: function(circle) {
      var attr = {
        cx: circle.x,
        cy: circle.y,
        r: circle.radius
      }
      if(circle.rotation > 0)
        attr.transform = "rotate(" + circle.rotation + ")";
      this.styleableAttributes(circle, attr);
      return virtualdom.svg('circle', attr);
    },

    // Mixin converters
    // --------------------------------------------------

    mixinAttributes: function(object, attr) {
      if(object.moveable)  this.moveableAttributes(object, attr);
      if(object.sizeable)  this.sizeableAttributes(object, attr);
      if(object.styleable) this.styleableAttributes(object, attr);
    },

    moveableAttributes: function(object, attr) {
      attr.x = object.x;
      attr.y = object.y;
      if(object.rotation > 0)
        attr.transform = "rotate(" + object.rotation + ")";
    },

    sizeableAttributes: function(object, attr) {
      attr.width = object.width;
      attr.height = object.height;
    },

    styleableAttributes: function(object, attr) {
      attr.fill = object.fillColor.hexString();
      attr.stroke = object.strokeColor.hexString();
    }

  });


})(Rune);