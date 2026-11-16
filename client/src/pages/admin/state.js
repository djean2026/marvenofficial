import { useCallback, useEffect, useState } from "react";
import { api } from "../../api";

export function useCollection(path) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setError("");
    try {
      const data = await api(path);
      setItems(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, loading, error, setError, refresh };
}

export function useEditor(path, empty) {
  const collection = useCollection(`/admin/${path}`);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  function edit(item) {
    setForm({ ...empty, ...item });
    setNotice("");
    collection.setError("");
  }

  function clear() {
    setForm(empty);
    setNotice("");
    collection.setError("");
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setNotice("");
    collection.setError("");
    try {
      if (form.id) await api(`/admin/${path}/${form.id}`, { method: "PUT", body: JSON.stringify(form) });
      else await api(`/admin/${path}`, { method: "POST", body: JSON.stringify(form) });
      setForm(empty);
      setNotice("Saved.");
      await collection.refresh();
    } catch (err) {
      collection.setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this? It comes off the public site.")) return;
    collection.setError("");
    try {
      await api(`/admin/${path}/${id}`, { method: "DELETE" });
      if (form.id === id) setForm(empty);
      setNotice("Deleted.");
      await collection.refresh();
    } catch (err) {
      collection.setError(err.message);
    }
  }

  return { ...collection, form, setForm, saving, notice, edit, clear, save, remove };
}
