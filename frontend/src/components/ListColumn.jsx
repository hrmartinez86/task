import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import CardItem from './CardItem';

export default function ListColumn({ list, onOpenCard }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `list-${list.id}`,
    data: {
      type: 'list',
      listId: list.id
    }
  });

  return (
    <section ref={setNodeRef} className={`list-column ${isOver ? 'list-over' : ''}`}>
      <header className="list-header">
        <h3>{list.title}</h3>
        <span>{list.cards.length} tarjetas</span>
      </header>

      <SortableContext items={list.cards.map((card) => `card-${card.id}`)} strategy={verticalListSortingStrategy}>
        <div className="card-stack">
          {list.cards.map((card) => (
            <CardItem key={card.id} card={card} onOpen={onOpenCard} />
          ))}
        </div>
      </SortableContext>
    </section>
  );
}
