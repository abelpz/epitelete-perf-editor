function HtmlElement({ id }) {
  this.element = document.getElementById(id);
  this.html = "";
  this.push = function (newer) {
    this.html = newer;
    return this;
  };
  this.render = function () {
    this.element.innerHTML = this.html;
    return this;
  };
}
export default HtmlElement;
