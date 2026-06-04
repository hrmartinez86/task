import { useEffect, useRef } from 'react';

export default function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);

  // Establece el HTML inicial solo al montar para no interferir con el cursor.
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value || '';
    }
  }, []);

  const command = (cmd) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="rte" onClick={() => editorRef.current?.focus()}>
      <div className="rte-toolbar">
        <button type="button" onMouseDown={(e) => { e.preventDefault(); command('bold'); }}>B</button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); command('italic'); }}>I</button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); command('insertUnorderedList'); }}>• Lista</button>
      </div>
      <div
        ref={editorRef}
        className="rte-editor"
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
      />
    </div>
  );
}
