import { useGetTasksQuery, useUpdateTaskStatusMutation } from '@/state/api';
import React from 'react';
import {DndProvider, useDrag, useDrop} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Task as TaskType } from '@/state/api'
import { EllipsisVertical, Plus } from 'lucide-react';
import { format } from 'date-fns';

type BoardProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"]
const BoardView = ({ id, setIsModalNewTaskOpen}: BoardProps) => {
  const { data: tasks, isLoading, error } = useGetTasksQuery({ projectId: Number(id)})

  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const moveTask = (taskId: number, toStatus: string) => {
    updateTaskStatus({
      taskId,
      status: toStatus
    });
  }

  if(isLoading) return <div className=''>Loading...</div>
  if(error) return <div className="">An error occured while fetching tasks.</div>
  return (
    <DndProvider backend={HTML5Backend}>
      <div className='grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4'>
        {taskStatus.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks || []}
            moveTask={moveTask}
            setIsModalNewTaskOpen={setIsModalNewTaskOpen}
          />
        ))}
      </div>
    </DndProvider>
  )
}

type TaskColumnProps = {
  status: string;
  tasks: TaskType[];
  moveTask: (taskId:  number, toStatus: string) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
}
const TaskColumn =({
  status,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,
}: TaskColumnProps) => {
  const [{ isOver} , drop] = useDrop(() => ({
    accept: "task",
    drop: (item: {id: number}) => moveTask(item.id, status),
    collect: (monitor: any) => ({
      isOver: !!monitor.isOver()
    })
  }))

  const taskCount = tasks.filter((task) => task.status === status).length

  const statusColour: any = {
    "To Do": "#2563EB",
    "Work In Progress": "#059669",
    "Under Review": "#D97706",
    "Completed": "#000000"
  }

  return (
    <div ref={(instance) => {
      drop(instance)
    }}
    className={`sl:py-4 rounded-lg py-2 xl:px-2 ${isOver ? 'bg-blue-100 dark:bg-neutral-950' : ''}`}
  >
    <div className="mb-3 flex w-full">
      <div 
        className={`w-2 !bg-[${statusColour[status]}] rounded-s-lg`}
        style={{ backgroundColor: statusColour[status] }}
      />
      <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-secondary">
          <h3 className='flex items-center text-lg font-semibold dark:text-white'>
            { status }{' '}
            <span
              className='ml-2 inline-block font-bold rounded-full bg-gray-200 p-1 text-center text-sm font leading-none dark:bg-dark-tertiary'
              style={{ width:"1.5rem", height: "1.5rem" }}
            >
            {taskCount}
          </span>
          </h3>
          <div className='flex items-center gap-1'>
            <button className='flex h-6 w-6 items-center dark:text-neutral-500'>
              <EllipsisVertical size={24} />
            </button>
            <button 
              className='flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white'
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              <Plus size={16} />
            </button>
          </div>
      </div>
    </div>
    {tasks
      .filter((task) => task.status === status)
      .map((task) => {
      <Task Key={task.id} task={task} />
    })}
    </div>
  )
}

type TaskProps = {
  task: TaskType;
}

const Task = ({ task }: TaskProps) => {
  const [{ isDragging} , drop] = useDrag(() => ({
    type: "task",
    item: {id: task.id},
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  const taskTagsSplit = task.tags ? task.tags.split(",") : [],

  const formattedStartDate = task.startDate ? format(new Date(task.startDate), "P") : '';
  const formattedDueDate = task.dueDate ? format(new Date(task.dueDate), "P") : '';

  const numberOfComments = (task.comments && task.comments.length) || 0

}
export default BoardView
