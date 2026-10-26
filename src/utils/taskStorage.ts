import { statuses, tasks, type Task } from '../data/tasks'

export const storageKey = 'gestor-actividades.tasks.v1'

export function isoDate(value: string) {
  return value.includes('/') ? value.split('/').reverse().join('-') : value
}

export function loadTasks(): { tasks: Task[]; error: string } {
  try {
    const raw = localStorage.getItem(storageKey)
    if (raw === null) return { tasks, error: '' }
    const saved: unknown = JSON.parse(raw)
    if (!Array.isArray(saved) || !saved.every((task): task is Task =>
      task !== null && typeof task === 'object' && Number.isSafeInteger(task.id) &&
      ['materia', 'docente', 'descripcion', 'fecha'].every((field) => typeof task[field] === 'string') &&
      /^\d{4}-\d{2}-\d{2}$/.test(isoDate(task.fecha)) && statuses.includes(task.estado),
    ) || new Set(saved.map((task) => task.id)).size !== saved.length) {
      throw new Error('Invalid saved tasks')
    }
    return { tasks: saved, error: '' }
  } catch {
    return { tasks, error: 'No se pudieron recuperar las tareas guardadas. Se muestran las de ejemplo; no se sobrescribirán los datos hasta que realices un cambio.' }
  }
}

export function isOverdue(task: Task, today = new Date()) {
  const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  return task.estado !== 'Finalizada' && isoDate(task.fecha) < localToday
}
