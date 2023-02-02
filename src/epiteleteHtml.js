import Epitelete from "epitelete-html";

const readOptions = { readPipeline: "stripMarkupPipeline" };
const writeOptions = {
  writePipeline: "mergeMarkupPipeline",
  ...readOptions
};

//Subclass of Epitelete that adds new methods that use strip/merge alignment
/**
 * @extends Epitelete
 */

class EpiteleteHtml extends Epitelete {

  constructor(...args) {
    super(...args)
  }

  undoDisabled(bookCode) {
    return !this.canUndo(bookCode);
  }
  redoDisabled(bookCode) {
    return !this.canRedo(bookCode);
  }
  async undo(bookCode) {
    return this.undoHtml(bookCode, readOptions);
  }
  async redo(bookCode) {
    return this.redoHtml(bookCode, readOptions);
  }
  async load(bookCode, perfDocumentHtml) {
    if (!perfDocumentHtml) return await this.get(bookCode);
    return this.sideloadPerf(bookCode, perfDocumentHtml, readOptions);
  }
  async get(bookCode) {
    return this.readHtml(bookCode, readOptions);
  }
  async update(bookCode, sequenceId, sequence) {
    return await this.writeHtml(bookCode, sequenceId, sequence, writeOptions);
  }
}

export default EpiteleteHtml;
