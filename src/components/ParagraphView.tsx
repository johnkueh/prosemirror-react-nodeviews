import { Node } from "prosemirror-model";
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

export default class ParagraphView {
  componentRef: any;
  dom: any;
  contentDOM: any;
  component: any;

  constructor(node: Node, component: React.FC<any>) {
    this.componentRef = React.createRef();
    this.dom = document.createElement("div");
    this.contentDOM = document.createElement("div");
    this.dom.id = "Prosemirror__NodeWrapper";
    this.dom.classList.add("Prosemirror__NodeWrapper");
    this.contentDOM.classList.add("Prosemirror__NodeContent");
    this.component = component;
  }

  render(cb: (portal: any) => void) {
    ReactDOM.render(
      <div ref={this.componentRef} id="ContentBlock" />,
      this.dom,
      () => {
        const Component = () => {
          const componentRef = useRef<HTMLElement>(null);
          useEffect(() => {
            const componentDOM = componentRef.current;
            if (componentDOM) {
              componentDOM.appendChild(this.contentDOM);
            }
          }, []);

          return <this.component ref={componentRef} />;
        };
        cb(
          ReactDOM.createPortal(
            <Component />,
            (document as any).getElementById("ContentBlock")
          )
        );
        this.putContentDomInRef();
      }
    );
    return this;
  }

  update(node: Node) {
    return true;
  }

  private putContentDomInRef = () => {
    this.componentRef.current.appendChild(this.contentDOM);
  };

  destroy() {
    ReactDOM.unmountComponentAtNode(this.dom);
  }
}
