import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

import PropTypes from "prop-types";
import { useState } from "react";
import "./CodeBox.css";

const CodeBox = ({ language, code }) => {
  CodeBox.propTypes = {
    language: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
  };

  const [fontSize, setFontSize] = useState("14px");

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
    <div className=" flex-col">
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
      <div className="code__btn-wrap" style={{ gap: "5px" }}>
        <button
          onClick={() => {
            setFontSize((prevSize) => `${parseInt(prevSize, 10) - 1}px`);
          }}
          className="code__btn"
        >
          -
        </button>
        <button
          onClick={() => {
            setFontSize((prevSize) => `${parseInt(prevSize, 10) + 1}px`);
          }}
          className="code__btn"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CodeBox;
