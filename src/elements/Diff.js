import { createTwoFilesPatch } from "diff";
import * as Diff2html from "diff2html";
import "diff2html/bundles/css/diff2html.min.css";

function DiffElement({ id, initial = "" }) {
  this.element = document.getElementById(id);
  this.older = initial;
  this.newer = "";
  this.exec = function ({ older, newer }) {
    this.diff = createTwoFilesPatch("Document.md", "Document.md", older, newer);
    return this;
  };
  this.exec({ older: this.older, newer: this.newer });
  this.push = function (newer) {
    this.older = this.newer;
    this.newer = newer;
    return this.exec({ older: this.older, newer: this.newer });
  };
  this.render = function () {
    // throw "error unknown";
    const diffJson = Diff2html.parse(this.diff);
    const diffHtml = Diff2html.html(diffJson, {
      drawFileList: true,
      matching: "words",
      outputFormat: "side-by-side",
      diffStyle: "char"
    });
    this.element.innerHTML = diffHtml;
    return this;
  };
}

export default DiffElement;
