import { useState, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function Addresses() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    try {
      const res = await axios.get("/addresses");
      setSaved(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await axios.get("/addresses/search?q=" + encodeURIComponent(query));
        setSuggestions(res.data.suggestions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const saveAddress = async (addr) => {
    try {
      await axios.post("/addresses", {
        value: addr.value,
        meta: addr.data
      });
      fetchSaved();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Поиск адреса</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Введите адрес"
        className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring focus:ring-indigo-300"
      />

      {loading && <div className="mb-4 text-gray-500">Идёт поиск...</div>}

      <ul className="space-y-2 mb-6">
        {suggestions.map((s) => (
          <li key={s.value} className="flex justify-between items-center p-2 border rounded hover:bg-gray-50">
            <span>{s.value}</span>
            <button
              onClick={() => saveAddress(s)}
              className="bg-gray-900 text-white px-3 py-1 rounded hover:bg-black transition"
            >
              Сохранить
            </button>
          </li>
        ))}
      </ul>

      <h3 className="text-xl font-semibold mb-2">Сохранённые адреса</h3>
      <div className="space-y-2">
        {saved.map((s) => (
          <div key={s.id} className="p-3 border rounded bg-gray-50">
            {s.value}
          </div>
        ))}
      </div>
    </div>
  );
}
