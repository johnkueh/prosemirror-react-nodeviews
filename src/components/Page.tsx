import React, { useState } from "react";
import Container from "./Container";
import CodeBlock from "./CodeBlock";
import { Box, Flex, FormControl, FormLabel, Input } from "@chakra-ui/core";

const Page: React.FC = () => {
  const [value, setValue] = useState("{}");
  return (
    <Container>
      <Flex py={12} justifyContent="space-around">
        <Box width="45%">
          <FormControl mb={3}>
            <FormLabel>Name</FormLabel>
            <Input type="text" />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Body</FormLabel>
            <Box>Editor</Box>
          </FormControl>
        </Box>
        <Box width="45%">
          <CodeBlock language="json" code={JSON.stringify(value, null, 2)} />
        </Box>
      </Flex>
    </Container>
  );
};

export default Page;
