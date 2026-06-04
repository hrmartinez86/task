import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import { priorityLabels } from '../utils/priority';
import RichTextEditor from './RichTextEditor';
import CardLinks from './CardLinks';

export default function CardModal({ card, users, onClose, onSave }) {
  const assetHost = import.meta.env.VITE_SOCKET_URL || window.location.origin;

  const [form, setForm] = useState({
    title: card.title,
    description: card.description || '',
    priority: card.priority,
    dueDate: card.dueDate ? card.dueDate.slice(0, 16) : '',
    assigneeId: card.assigneeId || ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const existingAttachments = card.attachments || [];

  const previews = useMemo(
    () => selectedFiles.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [selectedFiles]
  );

  useEffect(
    () => () => {
      previews.forEach((item) => URL.revokeObjectURL(item.url));
    },
    [previews]
  );

  const onFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    const allowed = 5 - existingAttachments.length;
    setSelectedFiles(files.slice(0, Math.max(allowed, 0)));
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: form.title,
        description: form.description,
        priority: form.priority,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
        assigneeId: form.assigneeId || null
      };

      const { data: updatedCard } = await api.put(`/cards/${card.id}`, payload);

      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append('images', file));
        await api.post(`/cards/${card.id}/attachments`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      onSave(updatedCard);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h3>Editar tarjeta</h3>
          <div className="modal-actions">
            <button type="button" className="ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" form="card-edit-form" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
        <form id="card-edit-form" onSubmit={submit} className="card-form">
          <label>
            Titulo
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </label>

          <CardLinks cardId={card.id} initialLinks={card.links || []} />
          <div className="field-group">
            <span className="field-label">Descripcion</span>
            <RichTextEditor
              value={form.description}
              onChange={(description) => setForm((prev) => ({ ...prev, description }))}
            />
          </div>

          <label>
            Prioridad
            <select
              value={form.priority}
              onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))}
            >
              {Object.entries(priorityLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Fecha compromiso
            <input
              type="datetime-local"
              value={form.dueDate}
              onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
            />
          </label>

          <label>
            Asignar a
            <select
              value={form.assigneeId}
              onChange={(e) => setForm((prev) => ({ ...prev, assigneeId: e.target.value }))}
            >
              <option value="">Sin asignar</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </label>

          <label>
            Adjuntar imagenes (max 5)
            <input type="file" accept="image/*" multiple onChange={onFileChange} />
          </label>

          <div className="attachment-grid">
            {existingAttachments.map((attachment) => (
              <img key={attachment.id} src={`${assetHost}${attachment.filePath}`} alt={attachment.fileName} />
            ))}
            {previews.map((item) => (
              <img key={item.url} src={item.url} alt={item.file.name} />
            ))}
          </div>

        </form>

      </div>
    </div>
  );
}
