import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function UpcomingCalendar({ cards }) {
  const upcoming = [...cards]
    .filter((card) => card.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 8);

  return (
    <aside className="upcoming-panel">
      <h4>Proximas entregas</h4>
      {upcoming.length === 0 ? <p>No hay fechas programadas.</p> : null}
      {upcoming.map((card) => (
        <div key={card.id} className="upcoming-item">
          <strong>{card.title}</strong>
          <span>{format(new Date(card.dueDate), 'dd MMM yyyy HH:mm', { locale: es })}</span>
        </div>
      ))}
    </aside>
  );
}
