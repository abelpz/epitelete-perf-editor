import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";
import EpiteleteJson from "./epiteleteJson.js";
import { JSONEditor } from "vanilla-jsoneditor";
import { Proskomma } from "proskomma";
import { readify } from "../utils/index.js";
import Diff from "./elements/Diff";
import Usfm from "./elements/Usfm";
import Html from "./elements/Usfm";
import LoadInput from "./elements/LoadInput.js";
import "./styles.css";

const defaultUrl =
  "https://qa.door43.org/api/v1/repos/unfoldingWord/en_ult/raw/08-RUT.usfm";

const getBook = async (url) => {
  const usfm = await fetch(url).then((data) => data.text());
  const bookCode = usfm.match(/\\id ([A-Z0-9]{3}) /)?.[1];
  return { usfm, bookCode };
};

(async () => {
  const data = await getBook(defaultUrl);
  // Document settings
  const doc = {
    docSetId: "abc_def",
    bookCode: data.bookCode,
    strippedAlignment: {}
  };

  const pk = new Proskomma();
  const importDoc = async (usfm) =>
    await pk.importDocument({ lang: "abc", abbr: "def" }, "usfm", usfm);

  await importDoc(data.usfm);
  // Instantiate Epitelete
  const epiJson = new EpiteleteJson({
    proskomma: pk,
    docSetId: doc.docSetId,
    options: { historySize: 100 }
  });

  // Set editor
  const target = document.getElementById("perf-editor");

  const props = {
    onChange: async (updated, previous, patch) => {
      if (!patch?.patchResult?.redo?.[0].value) return;
      //Find changed sequence Id in patch
      const sequenceId = patch?.patchResult?.redo?.[0].path
        .match(/(?<=sequences\/).+?(?=\/)/)
        ?.toString();

      //Do not make changes if no sequence has been modified
      if (!sequenceId) {
        console.warn("No changes made, only sequences should be edited.");
        editor.update({ json: previous.json });
        return;
      }

      //Update editor with modified sequence
      const sequence = updated.json.sequences[sequenceId];

      const newPerf = await epiJson.update(doc.bookCode, sequenceId, sequence);
      editor.update(newPerf);
      doc.strippedAlignment = {
        ...(await epiJson.getPipelineData(doc.bookCode))
      };

      console.log({ strippedAlignment: doc.strippedAlignment?.strippedAlignment?.[1][1] });

      epiJson.readPerf(doc.bookCode).then((perf) => {
        const newer = readify(perf);
        console.log({ perf });
        diff.push(newer).render();
      });
      epiJson.readUsfm(doc.bookCode).then((newUsfm) => {
        usfm.push(newUsfm).render();
      });
      // epiJson.readHtml(doc.bookCode).then((newHtml) => {
      //   html.push(newHtml.sequencesHtml[newHtml.mainSequenceId]).render();
      // });
    },
    onRenderMenu: (mode, items) => {
      /*
    Remove code/tree buttons.
    Hook epitelete to undo/redo buttons.
    */
      const [undoItem, redoItem] = items.slice(11, 13);
      const customUndo = {
        ...undoItem,
        disabled: epiJson.undoDisabled(doc.bookCode),
        onClick: async () => {
          editor.update(await epiJson.undo(doc.bookCode));
        }
      };
      const customRedo = {
        ...redoItem,
        disabled: epiJson.redoDisabled(doc.bookCode),
        onClick: async () => {
          editor.update(await epiJson.redo(doc.bookCode));
        }
      };

      const filteredItems = items.slice(3, 11);
      return [...filteredItems, customUndo, customRedo];
    },
    content: { text: "Loading content..." }
  };
  const diff = new Diff({ id: "diff-section" });
  const usfm = new Usfm({ id: "usfm-section" });
  const html = new Html({ id: "html-section" });

  const editor = new JSONEditor({ target, props });

  const launchEditor = async () => {
    // console.log(await epiJson.readPerf(doc.bookCode));
    const initialDoc = await epiJson.load(doc.bookCode);

    
    doc.strippedAlignment = {
      ...(await epiJson.getPipelineData(doc.bookCode))
    };

     console.log({ strippedAlignment: doc.strippedAlignment?.strippedAlignment?.[1][1] });

    // epiJson.readHtml(doc.bookCode).then((newHtml) => {
    //   html.push(newHtml.sequencesHtml[newHtml.mainSequenceId]).render();
    // });
    epiJson.readPerf(doc.bookCode).then((perf) => {
      const initialAlignment = readify(perf);
      console.log({ initialPerf: perf.sequences[perf.main_sequence_id].blocks[1].content.slice(1,50) });
      // console.log(initialAlignment);
      diff.push(initialAlignment).render();
    });
    epiJson.readUsfm(doc.bookCode).then((newUsfm) => {
      usfm.push(newUsfm).render();
    });

    let index = 4
    let sequenceId = initialDoc.json.main_sequence_id
    const getSequence = (sequences, type) => {
      sequenceId = Object.keys(sequences).find(key => sequences[key].type === type)
      return sequences[sequenceId]
    };
    const type = "footnote"
    let sequence = getSequence(initialDoc.json.sequences, type);
    let newPerf = initialDoc.json;
    while (index) {
      // console.log(index)
      // console.log({sequence, sequenceId})
      newPerf = await epiJson.update(doc.bookCode, sequenceId, sequence);
      sequence = getSequence(newPerf.json.sequences, type);
      index--;
    }
    console.log(newPerf.json.sequences[newPerf.json.main_sequence_id].blocks[1].content.slice(1, 5));
    console.log({history: epiJson.history["RUT"]});
    editor.set(newPerf);
  };

  // console.log(epiJson.pipelineHandler.pipelines)
  const onLoad = async (url) => {};

  const loadInput = new LoadInput({
    defaultUrl,
    onLoad
  });

  launchEditor();
})();
