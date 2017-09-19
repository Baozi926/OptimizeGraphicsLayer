define([
  "dojo/_base/declare", "dojo/_base/event", "dojo/dnd/Mover"
], function (declare, event, Mover) {
  var StepMover = declare([Mover], {
    onMouseMove: function (e) {
      // autoScroll(e);
      var m = this.marginBox;
        this
          .host
          .onMove(this, {
            l: m.l + e.pageX,
            t: parseInt(this.host.node.style.top)
          });
      event.stop(e);
    }
  });

  return StepMover;
});