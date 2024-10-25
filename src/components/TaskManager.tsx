import { Accessor, batch, createSignal, Setter } from "solid-js";

export type RunningTaskData = {
  type: "install" | "remove" | "disable" | "enable";
  miniapp_id: string;
  description: string;
};
export type RunningTask = {
  id: string;
  description: string;
  date: Date;
  completed?: boolean;
} & RunningTaskData;

const [tasks, setTasks] = createSignal<RunningTask[]>([]);
export const [newTaskHint, setNewTaskHint] = createSignal(false);
export class TaskManager {
  static sortedTasks() {
    return tasks().sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  static addTask(data: RunningTaskData) {
    const id = crypto.randomUUID();
    let task: RunningTask = {
      id,
      date: new Date(),
      ...data,
    };

    batch(() => {
      setTasks([...tasks(), task as RunningTask]);
      setNewTaskHint(true);
    });
    return id;
  }

  static markComplete(id: string) {
    setTasks(
      tasks().map((task) => {
        if (task.id == id) {
          return {
            ...task,
            completed: true,
          };
        }
        return task;
      })
    );
  }
}
