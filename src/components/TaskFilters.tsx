import { useState } from 'react'
import { tasks, type TaskStatus } from '../data/tasks'
import TaskCard from './TaskCard'

const statuses: TaskStatus[] = ['Pendiente', 'En progreso', 'Finalizada']

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .trim()
}

function TaskFilters() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filteredTasks = tasks.filter((task) => {
    const query = normalize(searchQuery)
    const matchesSearch =
      normalize(task.materia).includes(query) ||
      normalize(task.docente).includes(query)
    const matchesStatus = statusFilter === '' || task.estado === statusFilter

    return matchesSearch && matchesStatus
  })

  function clearFilters() {
    setSearchQuery('')
    setStatusFilter('')
  }

  return (
    <>
      <section
        aria-label="Filtrar tareas"
        className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mb-8 sm:p-5"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block min-w-0">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Materia o docente</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Buscar por materia o docente..."
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </label>

          <label className="block min-w-0">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Estado</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            >
              <option value="">Todos los estados</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500" aria-live="polite">
          {filteredTasks.length} {filteredTasks.length === 1 ? 'actividad encontrada' : 'actividades encontradas'}
        </p>
        <button
          type="button"
          onClick={clearFilters}
          disabled={!searchQuery && !statusFilter}
          className="rounded-lg px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent"
        >
          Limpiar filtros
        </button>
      </div>

      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} {...task} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
          <p className="font-semibold text-slate-800">No se encontraron tareas</p>
          <p className="mt-1 text-sm text-slate-500">Prueba con otros términos o limpia los filtros.</p>
        </div>
      )}
    </>
  )
}

export default TaskFilters
