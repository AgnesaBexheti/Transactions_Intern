import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import styles from './TransactionFormPage.module.css';

const CREATE_DEFAULTS = { title: '', value: '', categoryId: 1 };

export default function TransactionFormPage({ isEditing = false }) {
  const { isAuthed } = useAuth();
  const nav = useNavigate();
  const { id } = useParams();                              // only present on /edit/:id
  const { state } = useLocation();                         // might have { item } from Home
  const itemFromState = state?.item;

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(CREATE_DEFAULTS);
  const [loading, setLoading] = useState(isEditing);       // edit loads existing data
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  // Load categories once
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await api.categories();
        if (!ignore) setCategories(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!ignore) setErr(e.message || 'Failed to load categories');
      }
    })();
    return () => { ignore = true; };
  }, []);

  // Initialize form:
  // - Create: static defaults
  // - Edit: use route state (if provided) else fetch by id
  useEffect(() => {
    let ignore = false;

    if (!isEditing) {
      setForm(CREATE_DEFAULTS);
      setLoading(false);
      return;
    }

    async function load() {
      try {
        if (itemFromState) {
          setForm({
            title: itemFromState.title ?? '',
            value: itemFromState.value != null ? String(itemFromState.value) : '',
            categoryId: itemFromState?.category?.id ?? 1,
          });
        } else if (id) {
          const ex = await api.getExpense(id);
          setForm({
            title: ex?.title ?? '',
            value: ex?.value != null ? String(ex.value) : '',
            categoryId: ex?.category?.id ?? 1,
          });
        }
      } catch (e) {
        if (!ignore) setErr(e.message || 'Failed to load transaction');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => { ignore = true; };
  }, [isEditing, id, itemFromState]);

  const pageTitle  = isEditing ? 'Edit Transaction'   : 'Create New Transaction';
  const buttonText = isEditing ? 'Update'             : 'Create';

  function onChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: name === 'categoryId' ? Number(value) : value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');

    // basic validation
    if (!form.title.trim()) return setErr('Title is required');
    if (form.value === '' || isNaN(Number(form.value))) return setErr('Amount must be a number');
    if (!form.categoryId) return setErr('Select a category');

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        value: Number(form.value),
        categoryId: Number(form.categoryId),
      };

      if (isEditing) {
        await api.updateExpense(id, payload);    // PUT /api/expenses/:id
      } else {
        await api.createExpense(payload);        // POST /api/expenses
      }

      nav('/', { replace: true });
    } catch (e) {
      setErr(e.message || (isEditing ? 'Failed to update' : 'Failed to create'));
    } finally {
      setSaving(false);
    }
  }

  if (!isAuthed) {
    return <div style={{ padding: 24 }}>Please log in to {isEditing ? 'edit' : 'create'} a transaction.</div>;
  }

  if (loading) {
    return <div style={{ padding: 24 }}>Loading…</div>;
  }

  return (
    <section className={styles.container}> 
      <h2 style={{ marginBottom: 16 }}>{pageTitle}</h2>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <label>
          Title
          <input
            name="title"
            type="text"
            value={form.title}
            onChange={onChange}
            required
          />
        </label>

        <label>
          Amount
          <input
            name="value"
            type="number"
            step="0.01"
            value={form.value}
            onChange={onChange}
            required
          />
        </label>

        <label>
          Category
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={onChange}
            required
          >
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" type="submit" disabled={saving}>
            {saving ? (isEditing ? 'Updating…' : 'Saving…') : buttonText}
          </button>
          <button className="btn btn-ghost" type="button" onClick={() => nav(-1)} disabled={saving}>
            Cancel
          </button>
        </div>

        {err && <div style={{ color: 'crimson' }}>{err}</div>}
      </form>
    </section>
  );
}


// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { api } from '../lib/api.js';
// import { useAuth } from '../context/AuthContext.jsx';

//props

// {
//     isEditing: boolean 
//     if we click edit we set to ture 
//     default is always fBalse


//     data {
//         title,
//         amount
//         categoryiD
//     }

// for create
//     STATIC VARIABLE {
//         title; '',
//         amount: "",
//         catogoryID: 1
//     }

//     for edit get the same object from the card 
// }

// export default function CreateTransaction({ isEditing = false, data = { title: '', amount: '', categoryId: '' } }) {


// export default function CreateTransaction() {
  // const nav = useNavigate();
  // const { isAuthed } = useAuth();
  // const [categories, setCategories] = useState([]);
  // const [title, setTitle] = useState('');
  // const [value, setValue] = useState('');
  // const [categoryId, setCategoryId] = useState('');
  // const [loading, setLoading] = useState(false);
  // const [err, setErr] = useState('');

  // Load categories for the select
  // useEffect(() => {
  //   let ignore = false;
  //   (async () => {
  //     try {
  //       const data = await api.categories();
  //       if (!ignore) {
  //         setCategories(Array.isArray(data) ? data : []);
  //         if (Array.isArray(data) && data.length > 0) {
  //           setCategoryId(String(data[0].id));
  //         }
  //       }
  //     } catch (e) {
  //       if (!ignore) setErr(e.message || 'Failed to load categories');
  //     }
  //   })();
  //   return () => { ignore = true; };
  // }, []);

  // async function onSubmit(e) {
  //   e.preventDefault();
  //   setErr('');
  //   // quick client-side validation
  //   if (!title.trim()) return setErr('Title is required');
  //   if (!value || isNaN(Number(value))) return setErr('Amount must be a number');
  //   if (!categoryId) return setErr('Select a category');

  //   setLoading(true);
  //   try {
  //     // backend expects: { title, value, categoryId }
  //     await api.createExpense({
  //       title: title.trim(),
  //       value: Number(value),
  //       categoryId: Number(categoryId),
  //     });
      // go back to Home (it will fetch the new list)
  //     nav('/', { replace: true });
  //   } catch (e) {
  //     setErr(e.message || 'Failed to create transaction');
  //   } finally {
  //     setLoading(false);
  //   }
  //   if (isEditing) {
  //   try {
  //       await api.updateExpense(data.id, {
  //         title: title.trim(),  
  //           value: Number(value),
  //           categoryId: Number(categoryId),
  //       });
  //        nav('/', { replace: true });
  //   } catch (e) {
  //     setErr(e.message || 'Failed to create transaction');
  //   } finally {
  //     setLoading(false);
  //   }
  //   };



  // }

  // (route is already protected via <ProtectedRoute />, but this gives a nice fallback)
//   if (!isAuthed) {
//     return <div style={{ padding: 24 }}>Please log in to create a transaction.</div>;
//   }

//   return (
//     <section style={{ padding: 24, maxWidth: 480 }}>
//       <h2 style={{ marginBottom: 16 }}>Create New Transaction</h2>

//       <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
//         <label>
//           Title
//           <input
//             type="text"
//             value={title}
//             onChange={e => setTitle(e.target.value)}
//             required
//           />
//         </label>

//         <label>
//           Amount
//           <input
//             type="number"
//             step="0.01"
//             value={value}
//             onChange={e => setValue(e.target.value)}
//             required
//           />
//         </label>

//         <label>
//           Category
//           <select
//             value={categoryId}
//             onChange={e => setCategoryId(e.target.value)}
//             required
//           >
//             {categories.map(c => (
//               <option key={c.id} value={c.id}>{c.name}</option>
//             ))}
//           </select>
//         </label>

//         <div style={{ display: 'flex', gap: 8 }}>
//           <button className="btn" type="submit" disabled={loading}>
//             {loading ? 'Saving…' : 'Create'}
//           </button>
//           <button
//             className="btn btn-ghost"
//             type="button"
//             onClick={() => nav(-1)}
//             disabled={loading}
//           >
//             Cancel
//           </button>
//         </div>

//         {err && <div style={{ color: 'crimson' }}>{err}</div>}
//       </form>
//     </section>
//   );
// }


// // chat version 

// import { useEffect, useMemo, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { api } from '../lib/api.js';
// import { useAuth } from '../context/AuthContext.jsx';

// const DEFAULT_FORM = {
//   title: '',
//   value: '',
//   categoryId: 1, // your “static” default
// };

// export default function TransactionForm({ isEditing = false }) {
//   const nav = useNavigate();
//   const { id } = useParams();               // when editing, /edit/:id provides this
//   const { isAuthed } = useAuth();

//   const [categories, setCategories] = useState([]);
//   const [form, setForm] = useState(DEFAULT_FORM);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [err, setErr] = useState('');

//   // Load categories for the select
//   useEffect(() => {
//     let ignore = false;
//     (async () => {
//       try {
//         const data = await api.categories();
//         if (!ignore) {
//           setCategories(Array.isArray(data) ? data : []);
//           // if default 1 isn't present, pick first in list
//           if (Array.isArray(data) && data.length > 0 && !data.find(c => c.id === form.categoryId)) {
//             setForm(f => ({ ...f, categoryId: data[0].id }));
//           }
//         }
//       } catch (e) {
//         if (!ignore) setErr(e.message || 'Failed to load categories');
//       } finally {
//         if (!ignore) setLoading(false);
//       }
//     })();
//     return () => { ignore = true; };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // When editing: fetch the existing expense and prefill
//   useEffect(() => {
//     if (!isEditing || !id) return;
//     let ignore = false;
//     (async () => {
//       try {
//         const ex = await api.getExpense(id); // GET /api/expense/:id
//         if (!ignore && ex) {
//           setForm({
//             title: ex.title ?? '',
//             value: ex.value != null ? String(ex.value) : '',
//             categoryId: ex?.category?.id ?? 1,
//           });
//         }
//       } catch (e) {
//         if (!ignore) setErr(e.message || 'Failed to load expense');
//       }
//     })();
//     return () => { ignore = true; };
//   }, [isEditing, id]);

//   const titleText = isEditing ? 'Edit Transaction' : 'Create New Transaction';
//   const buttonText = isEditing ? 'Update' : 'Create';

//   function onChange(e) {
//     const { name, value } = e.target;
//     setForm(f => ({ ...f, [name]: name === 'categoryId' ? Number(value) : value }));
//   }

//   async function onSubmit(e) {
//     e.preventDefault();
//     setErr('');

//     // client validation
//     if (!form.title.trim()) return setErr('Title is required');
//     if (form.value === '' || isNaN(Number(form.value))) return setErr('Amount must be a number');
//     if (!form.categoryId) return setErr('Select a category');

//     setSaving(true);
//     try {
//       const payload = {
//         title: form.title.trim(),
//         value: Number(form.value),
//         categoryId: Number(form.categoryId),
//       };

//       if (isEditing) {
//         await api.updateExpense(id, payload);       // PUT /api/expenses/:id
//       } else {
//         await api.createExpense(payload);           // POST /api/expenses
//       }

//       nav('/', { replace: true }); // back to list
//     } catch (e) {
//       setErr(e.message || (isEditing ? 'Failed to update' : 'Failed to create'));
//     } finally {
//       setSaving(false);
//     }
//   }

//   if (!isAuthed) {
//     return <div style={{ padding: 24 }}>Please log in to {isEditing ? 'edit' : 'create'} a transaction.</div>;
//   }

//   return (
//     <section style={{ padding: 24, maxWidth: 520 }}>
//       <h2 style={{ marginBottom: 16 }}>{titleText}</h2>

//       <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
//         <label>
//           Title
//           <input
//             name="title"
//             type="text"
//             value={form.title}
//             onChange={onChange}
//             required
//           />
//         </label>

//         <label>
//           Amount
//           <input
//             name="value"
//             type="number"
//             step="0.01"
//             value={form.value}
//             onChange={onChange}
//             required
//           />
//         </label>

//         <label>
//           Category
//           <select
//             name="categoryId"
//             value={form.categoryId}
//             onChange={onChange}
//             required
//           >
//             {categories.map(c => (
//               <option key={c.id} value={c.id}>{c.name}</option>
//             ))}
//           </select>
//         </label>

//         <div style={{ display: 'flex', gap: 8 }}>
//           <button className="btn" type="submit" disabled={saving}>
//             {saving ? (isEditing ? 'Updating…' : 'Saving…') : buttonText}
//           </button>
//           <button className="btn btn-ghost" type="button" onClick={() => nav(-1)} disabled={saving}>
//             Cancel
//           </button>
//         </div>

//         {err && <div style={{ color: 'crimson' }}>{err}</div>}
//       </form>
//     </section>
//   );
// }


























// first trial:
// export default function CreateTransaction() {
//   return (
//     <div style={{ padding: 24 }}>
//       <h2>Create New Transaction</h2>
//         <p>Form coming soon…</p>
//         <div style={{ padding: 24 }}>
//       <h2>Login</h2>
//       <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
//         <label>Title
//           <input  required />
//         </label>
//         <label>Amount
//           <input type="number"  required />
//         </label>
//         <label>Category
//           <input type="number"  required />
//         </label>
//         <button type="submit" >Create</button>
//         <button type="button" ><Link to="/">Cancel</Link></button>
//         {err && <div style={{ color: 'crimson' }}>{err}</div>}
//       </form>
//     </div>
 
//     </div>
//   );