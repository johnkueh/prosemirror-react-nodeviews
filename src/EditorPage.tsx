import { Box, Flex } from "@chakra-ui/core";
import React, { useState } from "react";
import Container from "./components/Container";
import PrismRenderer from "./components/PrismRenderer";
import ProseMirror from "./components/ProseMirror";

const initialValue = {
  type: "doc",
  content: [
    {
      type: "image",
      attrs: {
        alt: "Toilet paper",
        title: "Unsplash image of toilet paper",
        src:
          "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3300&q=80"
      }
    },
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Heading one" }]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Heading two" }]
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Heading three" }]
    },
    {
      type: "heading",
      attrs: { level: 4 },
      content: [{ type: "text", text: "Heading four" }]
    },
    {
      type: "heading",
      attrs: { level: 5 },
      content: [{ type: "text", text: "Heading five" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "A normal block of a paragraph of text"
        }
      ]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "A block of paragraphed text with "
        },
        {
          type: "text",
          text: "bold",
          marks: [{ type: "strong" }]
        },
        {
          type: "text",
          text: " and "
        },
        {
          type: "text",
          text: "italics",
          marks: [{ type: "em" }]
        },
        {
          type: "text",
          text: ", "
        },
        {
          type: "text",
          text: "inline code",
          marks: [{ type: "code" }]
        },
        {
          type: "text",
          text: ", and "
        },
        {
          type: "text",
          text: "a link",
          marks: [
            {
              type: "link",
              attrs: { href: "https://www.google.com", title: "Google" }
            }
          ]
        }
      ]
    },
    { type: "blockquote", content: [{ type: "text", text: "A blockquote" }] },
    { type: "code_block", content: [{ type: "text", text: "A code block" }] }
  ]
};

const Page: React.FC = () => {
  const [value, setValue] = useState(initialValue);
  return (
    <Container>
      <Flex py={12} justifyContent="space-around">
        <Box width="45%">
          <ProseMirror defaultValue={initialValue} onChange={setValue} />
        </Box>
        <Box width="45%">
          <PrismRenderer
            language="json"
            code={JSON.stringify(value, null, 2)}
          />
        </Box>
      </Flex>
    </Container>
  );
};

export default Page;
