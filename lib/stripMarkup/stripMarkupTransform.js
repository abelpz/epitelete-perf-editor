import { PerfRenderFromJson, mergeActions } from 'proskomma-json-tools';
import { identityActions } from 'proskomma-json-tools/dist/render/perfToPerf/renderActions/identity'
import { stripMarkupActions } from "./stripMarkupActions"

const stripMarkupCode = function ({ perf, verseWords }) {
    const cl = new PerfRenderFromJson(
        {
            srcJson: perf,
            actions: mergeActions(
                [
                    stripMarkupActions,
                    identityActions,
                ]
            )
        }
    );
    const output = {};
    cl.renderDocument({ docId: "", config: { verseWords }, output });
    return {
        perf: output.perf,
        strippedAlignment: output.stripped,
        unalignedWords: output.unalignedWords,
    };
}

const stripMarkupTransform = {
    name: "stripMarkup",
    type: "Transform",
    description: "PERF=>PERF: Strips alignment markup",
    inputs: [
        {
            name: "perf",
            type: "json",
            source: ""
        },
        {
            name: "verseWords",
            type: "json",
            source: ""
        },
    ],
    outputs: [
        {
            name: "perf",
            type: "json",
        },
        {
            name: "strippedAlignment",
            type: "json",
        },
        {
            name: "unalignedWords",
            type: "json",
        },
    ],
    code: stripMarkupCode
}
export { stripMarkupTransform };
