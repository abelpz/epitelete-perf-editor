import { JSONEditor } from "svelte-jsoneditor/dist/jsoneditor.js";

class EpiteleteJsonEditor extends JSONEditor {
  constructor({ target, props = {}, epitelete }) {
    super({
      target,
      props: {
        // onRenderMenu: (items) => items.slice(1, 13),
        // readOnly: true
      }
    });
    this.props = props;
    this.epitelete = epitelete;
    this.bookCode = this.epitelete.localBookCodes()[0];
    this._updateProps();
  }

  _updateProps() {
    console.log(this.bookCode);
    // console.log("updated props");
    // const {
    //   onChange: userOnChange,
    //   onRenderMenu: userOnRenderMenu,
    //   ...userProps
    // } = this.props;
    // super.updateProps({
    //   readOnly: false,
    //   onChange: async (updated, previous, patch) => {
    //     const sequenceId = patch?.redo?.[0].path.match(
    //       /(?<=sequences\/).+?(?=\/)/
    //     );
    //     if (!sequenceId) {
    //       this.update(previous);
    //       alert("No changes made. Only sequences should be edited.");
    //       return;
    //     }
    //     const sequence = updated.json.sequences[sequenceId];
    //     if (typeof userOnChange === "function") {
    //       userOnChange(updated, previous, sequenceId, sequence);
    //       return;
    //     }
    //     this.update(
    //       await this.epitelete.update(this.bookCode, sequenceId, sequence)
    //     );
    //   },
    //   onRenderMenu: (mode, items) => {
    //     const [undoItem, redoItem] = items.slice(11, 13);
    //     const customUndo = {
    //       ...undoItem,
    //       disabled: this.epitelete.undoDisabled(this.bookCode),
    //       onClick: () => {
    //         this.update(this.epitelete.undo());
    //       }
    //     };
    //     const customRedo = {
    //       ...redoItem,
    //       disabled: this.epitelete.redoDisabled(this.bookCode),
    //       onClick: () => {
    //         this.update(this.epitelete.redo(this.bookCode));
    //       }
    //     };
    //     const filteredItems = items.slice(3, 11);
    //     const customItems = [...filteredItems, customUndo, customRedo];
    //     const userFilteredItems =
    //       typeof userOnChange === "function" && userOnRenderMenu(customItems);
    //     return userFilteredItems || customItems;
    //   },
    //   ...userProps
    // });
  }

  load(doc) {
    const bookCode = doc.headers.bookCode;
    this.bookCode = bookCode;
    this.set(this.epitelete.load(bookCode, doc));
    this.updateProps({ readOnly: false });
    this._updateProps();
  }
}

export default EpiteleteJsonEditor;
