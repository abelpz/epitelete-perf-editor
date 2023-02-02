function UsfmElement({ id }) {
  this.element = document.getElementById(id);
  this.usfm = "";
  this.push = function (newer) {
    this.usfm = newer;
    return this;
  };
  this.render = function () {
    this.element.innerHTML = this.usfm;
    return this;
  };
}
export default UsfmElement;
