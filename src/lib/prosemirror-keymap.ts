import { toggleMark } from "prosemirror-commands";
import { redo, undo } from "prosemirror-history";
import { Schema } from "prosemirror-model";

export const buildKeymap = (schema: Schema) => {
  return {
    "Mod-z": undo,
    "Mod-y": redo,
    "Shift-Mod-z": redo,
    "Mod-b": toggleMark(schema.marks.strong),
    "Mod-i": toggleMark(schema.marks.em),
    "Mod-u": toggleMark(schema.marks.underline)
  };
};
