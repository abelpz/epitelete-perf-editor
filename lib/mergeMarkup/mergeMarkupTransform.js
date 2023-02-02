import { PerfRenderFromJson, mergeActions } from 'proskomma-json-tools';
import { identityActions } from 'proskomma-json-tools/dist/render/perfToPerf/renderActions/identity'
import { mergeMarkupActions } from "./mergeMarkupActions"
import sortObject from 'deep-sort-object'
const mergeMarkupCode = function ({
    perf,
    verseWords: totalOccurrences,
    strippedAlignment,
}) {
    console.log({strippedAlignmentTransform: strippedAlignment[1][1]})
    console.log({ totalOccurrences });
    const cl = new PerfRenderFromJson({
        srcJson: perf,
        actions: mergeActions([
            mergeMarkupActions,
            identityActions,
        ]),
    });
    const output = {};
    cl.renderDocument({
        docId: "",
        config: {
            totalOccurrences,
            strippedAlignment,
        },
        output,
    });
    const { perf: mergedPerf, unalignedWords } = output;
    console.log({ mergedPerf: sortObject(mergedPerf.sequences[mergedPerf.main_sequence_id].blocks[1].content.slice(1,50)) });
    return { perf: mergedPerf, unalignedWords: unalignedWords }; // identityActions currently put PERF directly in output
};

const mergeMarkupTransform = {
    name: "mergeMarkupTransform",
    type: "Transform",
    description: "PERF=>PERF adds report to verses",
    inputs: [
        {
            name: "perf",
            type: "json",
            source: "",
        },
        {
            name: "strippedAlignment",
            type: "json",
            source: "",
        },
        {
            name: "verseWords",
            type: "json",
            source: "",
        },
    ],
    outputs: [
        {
            name: "perf",
            type: "json",
        },
        {
            name: "unalignedWords",
            type: "json",
        },
    ],
    code: mergeMarkupCode,
};
export { mergeMarkupTransform };
