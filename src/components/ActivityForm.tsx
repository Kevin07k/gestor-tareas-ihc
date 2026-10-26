import { useState, type SubmitEvent } from 'react'
import { statuses, type NewTask, type Task, type TaskStatus } from '../data/tasks'

type ActivityFormProps = {
  task: Task | null
  onCancel: () => void
  onAddTask: (task: NewTask) => void
}

const initialForm: NewTask = {
  materia: '', docente: '', descripcion: '', fecha: '', estado: 'Pendiente',
}
const fieldClass = 'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'

function ActivityForm({ task, onCancel, onAddTask }: ActivityFormProps) {
  const [form, setForm] = useState<NewTask>(task ?? initialForm)
  const [error, setError] = useState('')

  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!form.materia.trim() || !form.docente.trim() || !form.descripcion.trim() || !form.fecha) {
      setError('Completa todos los campos. Los textos no pueden contener solo espacios.')
      return
    }
    onAddTask({ ...form, materia: form.materia.trim(), docente: form.docente.trim(), descripcion: form.descripcion.trim() })
    setForm(initialForm)
    setError('')
  }

  return (
    <section aria-labelledby="new-task-heading" className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 id="new-task-heading" className="mb-5 text-xl font-bold text-slate-900">{task ? 'Editar tarea' : 'Nueva tarea'}</h2>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Materia</span>
          <input required maxLength={100} value={form.materia} onChange={(event) => setForm({ ...form, materia: event.target.value })} className={fieldClass} placeholder="Ej. Interacción Humano Computador" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Docente</span>
          <input required maxLength={100} value={form.docente} onChange={(event) => setForm({ ...form, docente: event.target.value })} className={fieldClass} placeholder="Nombre del docente" />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium">Descripción de la tarea</span>
          <textarea required maxLength={1000} rows={3} value={form.descripcion} onChange={(event) => setForm({ ...form, descripcion: event.target.value })} className={`${fieldClass} resize-y`} placeholder="¿Qué necesitas realizar?" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Fecha de entrega</span>
          <input required type="date" value={form.fecha} onChange={(event) => setForm({ ...form, fecha: event.target.value })} className={fieldClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Estado inicial</span>
          <select value={form.estado} onChange={(event) => setForm({ ...form, estado: event.target.value as TaskStatus })} className={fieldClass}>
            {statuses.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
          </select>
        </label>
        {error && <p role="alert" className="text-sm text-red-700 sm:col-span-2">{error}</p>}
        <div className="sm:col-span-2">
          <button type="submit" className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{task ? 'Guardar cambios' : 'Guardar actividad'}</button>
          {task && <button type="button" onClick={onCancel} className="ml-3 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold hover:bg-slate-50">Cancelar edición</button>}
        </div>
      </form>
    </section>
  )
}

export default ActivityForm
