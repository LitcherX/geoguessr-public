import React from "react";
import ReactMarkdown from "react-markdown";

const VariableMarkdown = ({ markdown, variables }) => {
    const renderers = {
        ...ReactMarkdown.renderers,
        code({ node, inline, className, children, ...props }) {
            if (node.type === "variable") {
                return <span>{variables[node.name]}</span>;
            }
            return <code {...props}>{children}</code>;
        },
    };

    const modifiedMarkdown = markdown.replace(
        /{{(\w+)}}/g,
        (match, variable) => {
            return `<variable name="${variable}"></variable>`;
        }
    );

    return (
        <ReactMarkdown renderers={renderers}>{modifiedMarkdown}</ReactMarkdown>
    );
};

export default VariableMarkdown;
