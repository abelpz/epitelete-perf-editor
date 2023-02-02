function LoadInput({ defaultUrl = "", onLoad }) {
  this.url = defaultUrl;
  this.btn = document.getElementById("load-btn");
  this.input = document.getElementById("res-input");
  this.input.value = this.url;
  this.onLoad = onLoad;
  this.btn.addEventListener("click", () => this.onLoad(this.input.value));
  this.load = function (value) {
    this.onLoad(value);
    return this;
  };
}
export default LoadInput;
