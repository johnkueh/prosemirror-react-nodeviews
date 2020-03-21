import { Box, BoxProps, Button, useClipboard } from "@chakra-ui/core";
import Highlight, { defaultProps, Language } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/github";
import React from "react";

interface Props {
  code: string;
  language: Language;
}

const PrismRenderer: React.FC<Props & BoxProps> = ({
  code,
  language,
  ...props
}) => {
  const { onCopy, hasCopied } = useClipboard(code);

  return (
    <Box {...props}>
      <Highlight
        {...defaultProps}
        code={code}
        language={language}
        theme={theme}
      >
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <Box
            position="relative"
            rounded="md"
            py={4}
            px={5}
            as="pre"
            whiteSpace="pre-wrap"
            style={style}
            fontSize={14}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
            <Button
              position="absolute"
              top={3}
              right={3}
              onClick={onCopy}
              _hover={{ bg: "gray.300" }}
              bg="gray.200"
              color="gray.800"
              size="xs"
            >
              {hasCopied ? "Copied!" : "Copy"}
            </Button>
          </Box>
        )}
      </Highlight>
    </Box>
  );
};

export default PrismRenderer;
