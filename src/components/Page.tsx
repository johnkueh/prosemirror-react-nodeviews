import { Box, Flex } from "@chakra-ui/core";
import React, { useState } from "react";
import CodeBlock from "./CodeBlock";
import Container from "./Container";
import Prosemirror from "./Prosemirror";

const initialValue = {
  type: "doc",
  content: [
    { type: "paragraph", content: [{ type: "text", text: "One!" }] },
    { type: "horizontal_rule" },
    { type: "paragraph", content: [{ type: "text", text: "Two!" }] }
  ]
};

const Page: React.FC = () => {
  const [value, setValue] = useState(initialValue);
  return (
    <Container>
      <Flex py={12} justifyContent="space-around">
        <Box width="45%">
          <Prosemirror defaultValue={initialValue} onChange={setValue} />
        </Box>
        <Box width="45%">
          <CodeBlock language="json" code={JSON.stringify(value, null, 2)} />
        </Box>
      </Flex>
    </Container>
  );
};

export default Page;
