import { useRef } from 'react';

export default function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);

  const command = (cmd) => {
    document.execCommand(cmd, false);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="rte">
      <div className="rte-toolbar">
        <button type="button" onClick={() => command('bold')}>B</button>
        <button type="button" onClick={() => command('italic')}>I</button>
        <button type="button" onClick={() => command('insertUnorderedList')}>• Lista</button>
      </div>
      <div
        ref={editorRef}
        className="rte-editor"
        contentEditable
        dangerouslySetInnerHTML={{ __html: value || '' }}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
      />
    </div>
  );
}
