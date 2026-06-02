import { useEffect, useMemo, useState } from 'react';
import { DndContext, PointerSensor, closestCorners, useSensor, useSensors } from '@dnd-kit/core';
import api from '../api/client';
import ListColumn from '../components/ListColumn';
import CardModal from '../components/CardModal';
import UpcomingCalendar from '../components/UpcomingCalendar';
import { connectSocket } from '../utils/socket';

function moveCardLocally(board, cardId, targetListId, targetPosition) {
  const next = JSON.parse(JSON.stringify(board));
  let movingCard = null;

  next.lists.forEach((list) => {
    const idx = list.cards.findIndex((card) => card.id === cardId);
    if (idx >= 0) {
      movingCard = list.cards.splice(idx, 1)[0];
    }
  });

  if (!movingCard) {
    return board;
  }

  movingCard.listId = targetListId;

  const destination = next.lists.find((list) => list.id === targetListId);
  if (!destination) {
    return board;
  }

  destination.cards.splice(targetPosition, 0, movingCard);

  next.lists.forEach((list) => {
    list.cards = list.cards.map((card, index) => ({ ...card, position: index }));
  });

  return next;
}

export default function BoardsPage({ onLogout }) {
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [board, setBoard] = useState(null);
  const [boardName, setBoardName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [users, setUsers] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const allCards = useMemo(() => {
    if (!board) return [];
    return board.lists.flatMap((list) => list.cards);
  }, [board]);

  const fetchBoards = async () => {
    const { data } = await api.get('/boards');
    setBoards(data);

    if (!selectedBoardId && data.length > 0) {
      setSelectedBoardId(data[0].id);
    }
  };

  const fetchBoard = async (id) => {
    if (!id) return;
    const { data } = await api.get(`/boards/${id}`);
    setBoard(data);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchBoards();
      const { data: usersData } = await api.get('/users');
      setUsers(usersData);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    fetchBoard(selectedBoardId);
  }, [selectedBoardId]);

  useEffect(() => {
    if (!selectedBoardId) return;

    const socket = connectSocket();

    socket.emit('join-board', selectedBoardId);

    const onBoardEvent = (event) => {
      if (Number(event.boardId) === Number(selectedBoardId)) {
        fetchBoard(selectedBoardId);
      }
    };

    socket.on('board:event', onBoardEvent);

    return () => {
      socket.emit('leave-board', selectedBoardId);
      socket.off('board:event', onBoardEvent);
    };
  }, [selectedBoardId]);

  const createBoard = async (event) => {
    event.preventDefault();
    if (!boardName.trim()) return;

    await api.post('/boards', { name: boardName });
    setBoardName('');
    await fetchBoards();
  };

  const inviteMember = async (event) => {
    event.preventDefault();
    if (!selectedBoardId || !inviteEmail.trim()) return;

    await api.post(`/boards/${selectedBoardId}/invite`, { email: inviteEmail });
    setInviteEmail('');
    await fetchBoard(selectedBoardId);
  };

  const createCard = async (listId) => {
    const title = window.prompt('Titulo de la tarjeta');
    if (!title) return;
    await api.post(`/lists/${listId}/cards`, { title, priority: 'medium' });
    await fetchBoard(selectedBoardId);
  };

  const onDragEnd = async ({ active, over }) => {
    if (!over || !board) return;

    const activeData = active.data.current;
    if (!activeData || activeData.type !== 'card') return;

    const card = activeData.card;
    const sourceListId = activeData.listId;

    let targetListId = sourceListId;
    let targetPosition = 0;

    if (String(over.id).startsWith('list-')) {
      targetListId = Number(String(over.id).replace('list-', ''));
      const targetList = board.lists.find((list) => list.id === targetListId);
      targetPosition = targetList ? targetList.cards.length : 0;
    } else if (String(over.id).startsWith('card-')) {
      const overCardId = Number(String(over.id).replace('card-', ''));
      const targetList = board.lists.find((list) => list.cards.some((item) => item.id === overCardId));
      if (targetList) {
        targetListId = targetList.id;
        targetPosition = targetList.cards.findIndex((item) => item.id === overCardId);
      }
    }

    if (sourceListId === targetListId && card.position === targetPosition) {
      return;
    }

    const previous = board;
    const optimistic = moveCardLocally(board, card.id, targetListId, targetPosition);
    setBoard(optimistic);

    try {
      await api.put(`/cards/${card.id}/move`, {
        toListId: targetListId,
        toPosition: targetPosition
      });
    } catch (_error) {
      setBoard(previous);
    }
  };

  const handleCardSaved = async () => {
    setActiveCard(null);
    await fetchBoard(selectedBoardId);
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <h2>Tableros</h2>
          <form onSubmit={createBoard} className="inline-form">
            <input
              placeholder="Nuevo tablero"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
            />
            <button type="submit">Crear</button>
          </form>
          <div className="board-list">
            {boards.map((item) => (
              <button
                key={item.id}
                type="button"
                className={item.id === selectedBoardId ? 'board-item active' : 'board-item'}
                onClick={() => setSelectedBoardId(item.id)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <button className="ghost" onClick={onLogout}>
          Cerrar sesion
        </button>
      </aside>

      <main className="board-main">
        {board ? (
          <>
            <header className="board-main-header">
              <div>
                <h1>{board.name}</h1>
                <p>{board.members?.length || 0} miembros</p>
              </div>
              <form onSubmit={inviteMember} className="inline-form">
                <input
                  type="email"
                  placeholder="Invitar por email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <button type="submit">Invitar</button>
              </form>
            </header>

            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={onDragEnd}>
              <section className="board-columns">
                {board.lists.map((list) => (
                  <div key={list.id}>
                    <ListColumn list={list} onOpenCard={setActiveCard} />
                    <button type="button" className="add-card" onClick={() => createCard(list.id)}>
                      + Agregar tarjeta
                    </button>
                  </div>
                ))}
              </section>
            </DndContext>
          </>
        ) : (
          <div className="empty-board">Crea o selecciona un tablero para comenzar.</div>
        )}
      </main>

      <UpcomingCalendar cards={allCards} />

      {activeCard ? (
        <CardModal card={activeCard} users={users} onClose={() => setActiveCard(null)} onSave={handleCardSaved} />
      ) : null}
    </div>
  );
}
