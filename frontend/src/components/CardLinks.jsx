import { useState } from 'react';
import api from '../api/client';

function IconClip() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.41 17.41a2 2 0 01-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function IconExternalLink() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  );
}

export default function CardLinks({ cardId, initialLinks = [] }) {
  const [links, setLinks] = useState(initialLinks);
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const addLink = async () => {
    setError('');

    if (!label.trim() || !url.trim()) {
      setError('Completa el nombre y la URL.');
      return;
    }

    try {
      setSaving(true);
      const { data } = await api.post(`/cards/${cardId}/links`, { label: label.trim(), url: url.trim() });
      setLinks((prev) => [...prev, data]);
      setLabel('');
      setUrl('');
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || 'URL inválida. Incluye https://');
    } finally {
      setSaving(false);
    }
  };

  const removeLink = async (linkId) => {
    await api.delete(`/cards/${cardId}/links/${linkId}`);
    setLinks((prev) => prev.filter((l) => l.id !== linkId));
  };

  return (
    <div className="card-links">
      <div className="card-links-header">
        <span className="field-label">Links</span>
        <button
          type="button"
          className="link-toggle-btn"
          onClick={() => setOpen((v) => !v)}
          title="Agregar link"
          aria-label="Agregar link"
        >
          <IconClip />
          <span>{open ? 'Cerrar' : 'Agregar link'}</span>
        </button>
      </div>

      {open && (
        <div className="link-form" role="group" aria-label="Agregar link">
          <input
            placeholder="Nombre del link (ej. Documento)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            maxLength={255}
          />
          <input
            placeholder="URL (ej. https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            maxLength={2048}
            type="url"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addLink();
              }
            }}
          />
          {error && <p className="link-error">{error}</p>}
          <button type="button" disabled={saving} onClick={addLink}>
            {saving ? 'Guardando...' : 'Agregar'}
          </button>
        </div>
      )}

      {links.length > 0 && (
        <ul className="link-list">
          {links.map((link) => (
            <li key={link.id} className="link-item">
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="link-anchor">
                <IconClip />
                <span>{link.label}</span>
                <IconExternalLink />
              </a>
              <button
                type="button"
                className="link-delete"
                onClick={() => removeLink(link.id)}
                title="Eliminar link"
                aria-label="Eliminar link"
              >
                <IconTrash />
              </button>
            </li>
          ))}
        </ul>
      )}

      {links.length === 0 && !open && (
        <p className="link-empty">Sin links. Usa el icono <IconClip /> para agregar uno.</p>
      )}
    </div>
  );
}
