import { Node } from "prosemirror-model";
import { EditorView } from "prosemirror-view";

class ImageView {
  dom?: HTMLImageElement;

  constructor(node: Node, view: EditorView, getPos: any) {
    this.dom = document.createElement("img");
    this.dom.src = node.attrs.src;
    this.dom.alt = node.attrs.alt;
    this.dom.addEventListener("click", e => {
      e.preventDefault();
      let alt = prompt("New alt text:", "");
      if (alt)
        view.dispatch(
          view.state.tr.setNodeMarkup(getPos(), undefined, {
            src: node.attrs.src,
            alt
          })
        );
    });
  }

  stopEvent() {
    return true;
  }
}

export default ImageView;
