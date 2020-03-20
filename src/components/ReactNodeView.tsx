import { Node } from "prosemirror-model";
import { Decoration, EditorView, NodeView } from "prosemirror-view";
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

type TgetPos = boolean | (() => number);

class ReactNodeView implements NodeView {
  componentRef: any;
  dom: any;
  contentDOM: any;
  component: any;
  node: any;

  constructor(
    node: Node,
    view: EditorView,
    getPos: TgetPos,
    decorations: Decoration[],
    component: React.FC<any>
  ) {
    this.node = node;
    this.componentRef = React.createRef();
    this.dom = document.createElement("div");
    this.contentDOM = document.createElement("div");
    this.dom.classList.add("ProseMirror__dom");
    this.contentDOM.classList.add("ProseMirror__contentDOM");
    this.component = component;
  }

  init() {
    this.dom.appendChild(this.contentDOM);
    const Component = () => {
      const componentRef = useRef<HTMLElement>(null);
      useEffect(() => {
        const componentDOM = componentRef.current;
        if (componentDOM) {
          componentDOM.appendChild(this.contentDOM);
        }
      }, [componentRef]);

      return <this.component ref={componentRef} />;
    };
    return {
      nodeView: this,
      portal: ReactDOM.createPortal(<Component />, this.dom)
    };
  }

  update(node: Node) {
    return true;
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this.dom);
    this.dom = undefined;
    this.contentDOM = undefined;
  }
}

export default ReactNodeView;
