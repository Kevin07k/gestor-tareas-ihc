export const statuses = ['Pendiente', 'En progreso', 'En pausa', 'Finalizada'] as const

export type TaskStatus = (typeof statuses)[number]

export type Task = {
  id: number
  materia: string
  docente: string
  descripcion: string
  fecha: string
  estado: TaskStatus
}

export type NewTask = Omit<Task, 'id'>

export const tasks: Task[] = [
  {
    id: 1,
    materia: 'IHC',
    descripcion: 'Preparar el prototipo del gestor de actividades.',
    docente: 'Bryana Ojopi',
    fecha: '15/10/2026',
    estado: 'En progreso',
  },
  {
    id: 2,
    materia: 'Calculo II',
    descripcion: 'Resolver los ejercicios de la práctica.',
    docente: 'Carlos Mendoza',
    fecha: '20/10/2026',
    estado: 'Pendiente',
  },
  {
    id: 3,
    materia: 'Programacion Orientada a Objetos',
    descripcion: 'Entregar el proyecto de clases y objetos.',
    docente: 'Lucia Fernandez',
    fecha: '24/10/2026',
    estado: 'Finalizada',
  },
]
