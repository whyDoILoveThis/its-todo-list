import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

import PropTypes from "prop-types";

const CodeBox = ({ language, code }) => {
  CodeBox.propTypes = {
    language: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
  };

  const fontSize = "14px";
  const borderRadius = "10px";
  const borderBottomLeftRadius = "0";
  const borderBottomRightRadius = "0";
  const maxWidth = "85vw";
  const width = "100%";
  const backgroundColor = "#423c4f7c";
  const border = "1px solid #9868ffbe";
  const padding = "1rem 2rem";
  const margin = "0";

  return (
    <div className="centerer">
      <SyntaxHighlighter
        className="scroll-code"
        language={language}
        style={dracula}
        customStyle={{
          fontSize,
          borderRadius,
          borderBottomLeftRadius,
          borderBottomRightRadius,
          maxWidth,
          width,
          backgroundColor,
          border,
          padding,
          margin,
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBox;
