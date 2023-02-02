export const readify = (perf, limit) =>
  [
    `# ${perf.metadata.document.bookCode}`,
    ...getBlocks(perf, limit)
      .map((block) => {
        if (!block) return;
        if (!block.type) return Object.values(block);
        if (block.type === "start_milestone")
          return `[${block.atts["x-lemma"][0]}:`;
        if (block.type === "end_milestone") return "]";
        if (block.type === "wrapper") return ["(**", ...block.content, "**)"];
        if (block.type === "mark") {
          if (block.subtype === "chapter")
            return `\n\n## CHAPTER ${block.atts.number.toString()}\n\n`;
          if (block.subtype === "verses")
            return `**::» v ${block.atts.number.toString()}::**`;
        }
        return "";
      })
      .flat(),
    "\n"
  ].join("");

export const getBlocks = (perf, limit = 0) => {
  const blocks = perf.sequences[perf.main_sequence_id].blocks
    .map((block) => (block.type === "paragraph" ? block.content : undefined))
    .flat();
  return limit > 0 ? blocks.slice(0, limit) : blocks;
};
