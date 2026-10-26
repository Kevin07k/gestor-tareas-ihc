import { useState } from 'react'
import TaskFilters from './components/TaskFilters'
import ActivityForm from './components/ActivityForm'
import Header from './components/Header'
import Footer from './components/Footer'
import { type NewTask, type Task, type TaskStatus } from './data/tasks'

import { isoDate, loadTasks, storageKey } from './utils/taskStorage'

function App() {
  const [loaded] = useState(loadTasks)
  const [taskList, setTaskList] = useState(loaded.tasks)
  const [storageError, setStorageError] = useState(loaded.error)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  function saveTasks(next: Task[]) {
    setTaskList(next)
    try {
      localStorage.setItem(storageKey, JSON.stringify(next))
      setStorageError('')
    } catch {
      setStorageError('No se pudieron guardar los cambios en este navegador. Se conservarán solo mientras esta página siga abierta.')
    }
  }

  function editTask(task: Task) {
    setEditingTask({ ...task, fecha: isoDate(task.fecha) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function deleteTask(id: number) {
    const task = taskList.find((item) => item.id === id)
    if (!task || !window.confirm(`¿Eliminar la actividad de ${task.materia}? Esta acción no se puede deshacer.`)) return
    saveTasks(taskList.filter((item) => item.id !== id))
    if (editingTask?.id === id) setEditingTask(null)
    setNotice('Actividad eliminada correctamente.')
  }
  const [notice, setNotice] = useState('')

  function addTask(task: NewTask) {
    if (editingTask) {
      saveTasks(taskList.map((item) => item.id === editingTask.id ? { ...task, id: item.id } : item))
      setEditingTask(null)
      setNotice('Actividad actualizada correctamente.')
      return
    }
    saveTasks([
      { ...task, id: Math.max(0, ...taskList.map((item) => item.id)) + 1 },
      ...taskList,
    ])
    setNotice(`Actividad de ${task.materia} creada correctamente. Consulta el listado; si tienes filtros activos, puedes limpiarlos para verla.`)
  }

  function changeStatus(id: number, estado: TaskStatus) {
    saveTasks(taskList.map((task) => task.id === id ? { ...task, estado } : task))
    if (editingTask?.id === id) setEditingTask({ ...editingTask, estado })
    setNotice(`Estado actualizado a ${estado.toLocaleLowerCase()}.`)
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <ActivityForm key={editingTask?.id ?? 'new'} task={editingTask} onAddTask={addTask} onCancel={() => setEditingTask(null)} />
        {storageError && <p role="alert" className="mb-4 text-sm text-amber-800">{storageError}</p>}
        <p role="status" className="mb-5 text-sm font-medium text-emerald-800">{notice}</p>
        <section aria-labelledby="tasks-heading">
          <h2 id="tasks-heading" className="mb-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Mis tareas
          </h2>
          <TaskFilters tasks={taskList} onStatusChange={changeStatus} onEdit={editTask} onDelete={deleteTask} />
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default App
