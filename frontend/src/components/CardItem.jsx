import { useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { priorityClasses, priorityLabels } from '../utils/priority';

export default function CardItem({ card, onOpen }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `card-${card.id}`,
    data: {
      type: 'card',
      card,
      listId: card.listId
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const dueText = useMemo(() => {
    if (!card.dueDate) return null;
    return formatDistanceToNow(new Date(card.dueDate), { addSuffix: true, locale: es });
  }, [card.dueDate]);

  return (
    <article ref={setNodeRef} style={style} className="card-item" onClick={() => onOpen(card)}>
      <div className="card-header" {...attributes} {...listeners}>
        <span className={`priority-pill ${priorityClasses[card.priority]}`}>{priorityLabels[card.priority]}</span>
        <strong>{card.title}</strong>
      </div>
      {card.description ? <div className="card-description" dangerouslySetInnerHTML={{ __html: card.description }} /> : null}
      <div className="card-footer">
        {dueText ? <small>Vence {dueText}</small> : <small>Sin fecha compromiso</small>}
        {card.attachments?.length ? <small>{card.attachments.length} imagen(es)</small> : null}
      </div>
    </article>
  );
}
