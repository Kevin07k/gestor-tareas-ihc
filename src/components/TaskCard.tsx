import type { Task, TaskStatus } from '../data/tasks'

import { isOverdue } from '../utils/taskStorage'

type TaskCardProps = Task & {
  onEdit: () => void
  onDelete: (id: number) => void
  onStatusChange: (id: number, estado: TaskStatus) => void
}

const estadoStyles: Record<TaskStatus, string> = {
  Pendiente: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  'En progreso': 'bg-sky-50 text-sky-700 ring-sky-600/20',
  'En pausa': 'bg-slate-100 text-slate-700 ring-slate-500/20',
  Finalizada: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
}

function TaskCard({ id, materia, docente, descripcion, fecha, estado, onStatusChange, onEdit, onDelete }: TaskCardProps) {
  const displayDate = /^\d{4}-\d{2}-\d{2}$/.test(fecha) ? fecha.split('-').reverse().join('/') : fecha
  const actions: { label: string; estado: TaskStatus }[] = estado === 'Pendiente'
    ? [{ label: 'Iniciar actividad', estado: 'En progreso' }]
    : estado === 'En progreso'
      ? [{ label: 'Completar actividad', estado: 'Finalizada' }, { label: 'Pausar', estado: 'En pausa' }]
      : estado === 'En pausa'
        ? [{ label: 'Reanudar', estado: 'En progreso' }, { label: 'Completar actividad', estado: 'Finalizada' }]
        : [{ label: 'Reabrir actividad', estado: 'Pendiente' }]

  return (
    <article className="flex min-h-52 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <h3 className="min-w-0 break-words text-lg font-semibold leading-snug text-slate-900 sm:text-xl">
          {materia}
        </h3>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset sm:text-sm ${estadoStyles[estado] ?? 'bg-slate-100 text-slate-700 ring-slate-600/20'}`}>
          {estado}
        </span>
      </div>
      <p className="mb-5 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-600">{descripcion}</p>
      <dl className="mt-auto space-y-3 border-t border-slate-100 pt-4 text-sm sm:text-base">
        <div className="flex flex-wrap gap-x-2">
          <dt className="font-medium text-slate-500">Docente</dt>
          <dd className="min-w-0 break-words text-slate-800">{docente}</dd>
        </div>
        <div className="flex flex-wrap gap-x-2">
          <dt className="font-medium text-slate-500">Fecha de entrega</dt>
          <dd className="text-slate-800">{displayDate}</dd>
        </div>
      </dl>
      {isOverdue({ id, materia, docente, descripcion, fecha, estado }) && <p className="mt-3 text-sm font-semibold text-red-700">Vencida · fecha de entrega superada</p>}
      <div className="mt-5 flex flex-wrap gap-2">
        {actions.map((action) => (
          <button key={action.estado} type="button" onClick={() => onStatusChange(id, action.estado)} aria-label={`${action.label}: ${materia}`} className="rounded-lg border border-indigo-200 px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            {action.label}
          </button>
        ))}
      </div>
      <div className="mt-4 flex gap-4 border-t border-slate-100 pt-4">
        <button type="button" onClick={onEdit} aria-label={`Editar: ${materia}`} className="rounded px-2 py-1 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">Editar</button>
        <button type="button" onClick={() => onDelete(id)} aria-label={`Eliminar: ${materia}`} className="rounded px-2 py-1 text-sm font-semibold text-red-700 hover:bg-red-50">Eliminar</button>
      </div>
    </article>
  )
}

export default TaskCard