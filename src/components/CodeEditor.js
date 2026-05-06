import React from "react";
import Editor from "@monaco-editor/react";

function CodeEditor({
  code,
  language,
  setCode,
  sendCode,
  isRemoteChange,
  setSaveStatus,
}) {
  return (
   <Editor
 
  height="90vh"
  language={language}
  theme="vs-dark"
  value={code}
  options={{
    minimap: { enabled: false },
    fontSize: 14,
    automaticLayout: true   //
  }}
  onChange={(value) => {
    const newCode = value || "";

    if (isRemoteChange.current) {
      isRemoteChange.current = false;
      setCode(newCode);
      return;
    }

    setCode(newCode);
    setSaveStatus("Saving...");
    sendCode(newCode);
  }}
/>
     
    
  );
}

export default CodeEditor; 