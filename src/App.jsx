import { useState, useEffect } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [filterUserId, setFilterUserId] = useState(0);
  const [sortOrder, setSortOrder] = useState("asc");
  const [completedSortOrder, setCompletedSortOrder] = useState("asc");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((res) => res.json())
      .then((data) => {
        setTodos(data.map((todo) => ({ ...todo, completedAt: null })));
      });
  }, []);

  const handleComplete = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, completed: true, completedAt: new Date() }
          : todo
      )
    );
  };

  const handleUncomplete = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, completed: false, completedAt: null }
          : todo
      )
    );
  };

  const filteredTodos = todos.filter((todo) =>
    filterUserId ? todo.userId === filterUserId : true
  );

  const uncompletedTodos = filteredTodos
    .filter((todo) => !todo.completed)
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );

  const completedTodos = filteredTodos
    .filter((todo) => todo.completed)
    .sort((a, b) => {
      if (!a.completedAt || !b.completedAt) return 0;
      return completedSortOrder === "asc"
        ? new Date(a.completedAt) - new Date(b.completedAt)
        : new Date(b.completedAt) - new Date(a.completedAt);
    });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex flex-wrap gap-6 mb-8">
        <div>
          <label className="block mb-1 font-semibold">Filter by:</label>
          <select
            onChange={(e) => setFilterUserId(Number(e.target.value))}
            className="border rounded-md p-2"
          >
            <option value="0">All</option>
            {[...new Set(todos.map((todo) => todo.userId))].map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Sort:</label>
          <select
            onChange={(e) => setSortOrder(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="asc">Title (asc)</option>
            <option value="desc">Title (desc)</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Sort:</label>
          <select
            onChange={(e) => setCompletedSortOrder(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="asc">Date (asc)</option>
            <option value="desc">Date (desc)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Pending:</h2>
          {uncompletedTodos.length === 0 ? (
            <p>No pending todos.</p>
          ) : (
            uncompletedTodos.map((todo) => (
              <div
                key={todo.id}
                className="flex justify-between items-center mb-4"
              >
                <span>{todo.title}</span>
                <button
                  onClick={() => handleComplete(todo.id)}
                  className="bg-emerald-400 hover:bg-emerald-500 text-white font-semibold py-1 px-3 rounded"
                >
                  Complete
                </button>
              </div>
            ))
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Completed:</h2>
          {completedTodos.length === 0 ? (
            <p>No completed todos.</p>
          ) : (
            completedTodos.map((todo) => (
              <div
                key={todo.id}
                className="flex justify-between items-center mb-4"
              >
                <div>
                  <div>{todo.title}</div>
                  <div className="text-sm text-emerald-400">
                    {todo.completedAt &&
                      `Completed on: ${new Date(
                        todo.completedAt
                      ).toLocaleDateString()}`}
                  </div>
                </div>
                <button
                  onClick={() => handleUncomplete(todo.id)}
                  className="bg-amber-400 hover:bg-amber-500 text-white font-semibold py-1 px-3 rounded"
                >
                  Undo
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;