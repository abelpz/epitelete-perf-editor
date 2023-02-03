import Epitelete from "epitelete-html";
import { PipelineHandler } from 'proskomma-json-tools';
import * as pipelines from "../lib/pipelines"
import * as transforms from "../lib/transforms"

const readOptions = { readPipeline: "stripMarkupPipeline" };
const writeOptions = {
  writePipeline: "mergeMarkupPipeline",
  ...readOptions
};

//Subclass of Epitelete compatible with JsonEditor
/**
 * @extends Epitelete
 */

class EpiteleteJson extends Epitelete {

  constructor(...args) {
    const [params] = args;
    const { options, proskomma } = params;
    super(...args)
    this.pipelineHandler = new PipelineHandler({
        pipelines: pipelines || options.pipelines
            ? { ...pipelines, ...options.pipelines } : null,
        transforms: transforms || options.transforms
            ? { ...transforms, ...options.transforms } : null,
        proskomma: proskomma,
        vervose: true
    });
  }

  undoDisabled(bookCode) {
    return !this.canUndo(bookCode);
  }
  redoDisabled(bookCode) {
    return !this.canRedo(bookCode);
  }
  async undo(bookCode) {
    console.log("UNDO");
    return { json: await this.undoPerf(bookCode, readOptions) };
  }
  async redo(bookCode) {
    console.log("REDO");
    return { json: await this.redoPerf(bookCode, readOptions) };
  }
  async load(bookCode, perfJSON) {
    if (!perfJSON) return await this.get(bookCode);
    return { json: await this.sideloadPerf(bookCode, perfJSON, readOptions) };
  }
  async get(bookCode) {
    return { json: await this.readPerf(bookCode, readOptions) };
  }
  async update(bookCode, sequenceId, sequence) {
    return {
      json: await this.writePerf(bookCode, sequenceId, sequence, writeOptions)
    };
  }
}

export default EpiteleteJson;
