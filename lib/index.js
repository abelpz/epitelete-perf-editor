import EpiteleteJson from "../src/epiteleteJson.js";
import EpiteleteJsonEditor from "./epiteleteJsonEditor.js";
import "../src/styles.css";

// Document settings
const doc = {
  docSetId: "xyz-fra_lsg",
  bookCode: "JON",
  url: "../perf/jon.document.perf.json"
};

// Instantiate Epitelete
const epitelete = new EpiteleteJson({ docSetId: doc.docSetId });

// Set editor
const target = document.getElementById("perf-editor");
const editor = new EpiteleteJsonEditor({ target, epitelete });

// Fetch PERF and load into epitelete and editor
fetch(doc.url)
  .then((res) => res.json())
  .then((doc) => editor.load(doc));
