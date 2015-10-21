import _ from 'lodash';

// This provides algorithms to position things
function Positioner({ minCellWidth = 80, maxCellWidth = 100, maxOverlap = 30, margin = 0 }) {
  this.minCellWidth = minCellWidth;
  this.maxCellWidth = maxCellWidth;
  this.maxOverlap = maxOverlap;
  this.margin = margin;
  // Computed values
  this.cellWidthDelta = this.maxCellWidth - this.minCellWidth;
  this.minColumnWidth = minCellWidth + (3 * maxOverlap) + 10;
  this.maxColumnWidth = (4 * maxCellWidth) + (4 * margin);
}

_.extend(Positioner.prototype, {
  widthPercent(width) {
    return (width / this.minColumnWidth) - 1;
  },

  calculateLeft(index, widthPercent) {
    var start = this.maxOverlap * index;
    var maxOffset = 83 * index + this.margin * index - start;
    var currentOffset = widthPercent * maxOffset;
    return start + currentOffset - 1;
  },

  calculateWidth(index, widthPercent) {
    return this.minCellWidth + widthPercent * this.cellWidthDelta;
  }
});

function Column() {
  this.el = document.getElementsByClassName('column')[0];
  this.positioner = new Positioner({});
  _.bindAll(this, ['onMouseDown', 'onMouseUp', 'onMouseMove']);
  this.bindUI();
  this.registerEvents();
}

_.extend(Column.prototype, {
  bindUI() {
    this.ui = {
      resize: document.getElementsByClassName('resize')[0]
    };
    this.cells = [
      document.getElementsByClassName('one')[0],
      document.getElementsByClassName('two')[0],
      document.getElementsByClassName('three')[0],
      document.getElementsByClassName('four')[0]
    ];
  },

  registerEvents() {
    this.ui.resize.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('mousemove', this.onMouseMove);
  },

  onMouseDown() {
    this.el.className = 'column resizing';
    this._mousedown = true;
  },

  onMouseUp(e) {
    this.el.className = 'column';
    this._mousedown = false;
  },

  onMouseMove(e) {
    if (this.moving) { return; }
    if (!this._mousedown) { return; }
    this.moving = true;
    requestAnimationFrame(() => {
      this._onMouseMove(e);
    });
  },

  _onMouseMove({ clientX }) {
    var { left, width } = this.el.getBoundingClientRect();
    var newWidth = clientX - left;
    newWidth = Math.max(this.positioner.minColumnWidth, newWidth);
    newWidth = Math.min(this.positioner.maxColumnWidth, newWidth);
    this.el.style.width = `${newWidth}px`;
    this.positionChildren();
    this.moving = false;
  },

  positionChildren() {
    var elWidth = parseInt(this.el.style.width.slice(0, -2), 10);
    var widthPercent = this.positioner.widthPercent(elWidth);
    _.each(this.cells, (cell, index) => {
      var newPosition = this.positioner.calculateLeft(index, widthPercent);
      var newWidth = this.positioner.calculateWidth(index, widthPercent);
      cell.style.left = `${newPosition}px`;
      cell.style.width = `${newWidth}px`;
    });
  }
});

var column = new Column();
