import { Node, Schema } from "prosemirror-model";

const brDOM = ["br"];

export const nodes: any = {
  doc: {
    content: "block+"
  },
  paragraph: {
    content: "inline*",
    group: "block",
    parseDOM: [{ tag: "p" }]
  },
  blockquote: {
    content: "block+",
    group: "block",
    defining: true,
    parseDOM: [{ tag: "blockquote" }]
  },
  horizontal_rule: {
    group: "block",
    parseDOM: [{ tag: "hr" }]
  },
  heading: {
    attrs: { level: { default: 1 } },
    content: "inline*",
    group: "block",
    defining: true,
    parseDOM: [
      { tag: "h1", attrs: { level: 1 } },
      { tag: "h2", attrs: { level: 2 } },
      { tag: "h3", attrs: { level: 3 } },
      { tag: "h4", attrs: { level: 4 } },
      { tag: "h5", attrs: { level: 5 } },
      { tag: "h6", attrs: { level: 6 } }
    ]
  },
  code_block: {
    content: "text*",
    marks: "",
    group: "block",
    code: true,
    defining: true,
    parseDOM: [{ tag: "pre", preserveWhitespace: "full" }]
  },
  text: {
    group: "inline"
  },
  image: {
    attrs: {
      src: {},
      alt: { default: null },
      title: { default: null }
    },
    group: "block",
    draggable: true,
    parseDOM: [
      {
        tag: "img[src]",
        getAttrs(dom: HTMLImageElement) {
          return {
            src: dom.getAttribute("src"),
            title: dom.getAttribute("title"),
            alt: dom.getAttribute("alt")
          };
        }
      }
    ]
  },
  hard_break: {
    inline: true,
    group: "inline",
    selectable: false,
    parseDOM: [{ tag: "br" }],
    toDOM() {
      return brDOM;
    }
  }
};

const emDOM = ["em", 0],
  strongDOM = ["strong", 0],
  codeDOM = ["code", 0];

export const marks: any = {
  link: {
    attrs: {
      href: {},
      title: { default: null }
    },
    inclusive: false,
    parseDOM: [
      {
        tag: "a[href]",
        getAttrs(dom: HTMLLinkElement) {
          return {
            href: dom.getAttribute("href"),
            title: dom.getAttribute("title")
          };
        }
      }
    ],
    toDOM(node: Node) {
      let { href, title } = node.attrs;
      return ["a", { href, title }, 0];
    }
  },
  em: {
    parseDOM: [{ tag: "i" }, { tag: "em" }, { style: "font-style=italic" }],
    toDOM() {
      return emDOM;
    }
  },
  strong: {
    parseDOM: [
      { tag: "strong" },
      {
        tag: "b",
        getAttrs: (node: HTMLElement) =>
          node.style.fontWeight !== "normal" && null
      },
      {
        style: "font-weight",
        getAttrs: (value: string) =>
          /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null
      }
    ],
    toDOM() {
      return strongDOM;
    }
  },
  code: {
    parseDOM: [{ tag: "code" }],
    toDOM() {
      return codeDOM;
    }
  }
};

export const schema = new Schema({ nodes, marks });
