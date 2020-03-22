import { css, Global } from "@emotion/core";
import React from "react";

const ProseMirrorCSS: React.FC = () => {
  return (
    <Global
      styles={css`
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror-selectednode {
          border: 1px solid green;
        }
      `}
    />
  );
};

export default ProseMirrorCSS;
