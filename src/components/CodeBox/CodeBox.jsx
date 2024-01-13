import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

import PropTypes from "prop-types";

const CodeBox = ({ language, code }) => {
  CodeBox.propTypes = {
    language: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
  };

  const fontSize = "14px";
  const borderRadius = "30px";
  const maxWidth = "85vw";
  const width = "100%";
  const backgroundColor = "#423c4f7c";
  const border = "1px solid #9868ffbe";
  const padding = "1rem 2rem";

  return (
    <div className="centerer">
      <SyntaxHighlighter
        language={language}
        style={dracula}
        customStyle={{
          fontSize,
          borderRadius,
          maxWidth,
          width,
          backgroundColor,
          border,
          padding,
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBox;
