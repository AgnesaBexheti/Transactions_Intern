import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '@/lib/api';
import type { Category, Expense } from '@/types';

type Props = {
  isEditing?: boolean;
};

export default function TransactionFormPage({ isEditing = false }: Props) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [value, setValue] = useState<string>(''); // keep as string for input
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load categories + expense (if editing)
  useEffect(() => {
    (async () => {
      try {
        const cats = await api.categories() as Category[];
        setCategories(cats);

        if (isEditing && id) {
          const exp = await api.getExpense(id) as Expense;
          setTitle(exp.title);
          setValue(String(exp.value));
          setCategoryId(exp.category?.id ?? '');
        }
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEditing]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
      setError('Amount must be a number.');
      return;
    }
    if (categoryId === '') {
      setError('Please choose a category.');
      return;
    }

    try {
      setError(null);
      if (isEditing && id) {
        await api.updateExpense(id, { title, value: numeric, categoryId });
      } else {
        await api.createExpense({ title, value: numeric, categoryId });
      }
      navigate('/');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  if (loading) return <p>Loading…</p>;

  return (
    <form className="form stack gap-2" onSubmit={onSubmit}>
      <h2>{isEditing ? 'Edit Transaction' : 'New Transaction'}</h2>
      {error && <div className="alert error">{error}</div>}

      <label>
        Title
        <input
          type="text"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          required
        />
      </label>

      <label>
        Amount (use negative for expense)
        <input
          type="number"
          step="0.01"
          value={value}
          onChange={(ev) => setValue(ev.target.value)}
          required
        />
      </label>

      <label>
        Category
        <select
          value={categoryId === '' ? '' : String(categoryId)}
          onChange={(ev) =>
            setCategoryId(ev.target.value ? Number(ev.target.value) : '')
          }
          required
        >
          <option value="">— choose —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <div className="row gap-1">
        <button type="submit">{isEditing ? 'Save' : 'Create'}</button>
        <button type="button" onClick={() => navigate('/')}>Cancel</button>
      </div>
    </form>
  );
}
