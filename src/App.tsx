import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("To-Do");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await axios.get("http://localhost:5000/tasks");
    setTasks(response.data);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isEditing && currentTask) {
      await updateTask(currentTask._id);
    } else {
      await addTask();
    }
  };

  const addTask = async () => {
    const newTask = { title, description, status };
    await axios.post("http://localhost:5000/tasks", newTask);
    fetchTasks();
    resetForm();
  };

  const updateTask = async (id: string) => {
    const updatedTask = { title, description, status };
    await axios.put(`http://localhost:5000/tasks/${id}`, updatedTask);
    fetchTasks();
    resetForm();
    setIsEditing(false);
  };

  const deleteTask = async (id: string) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    fetchTasks();
  };

  const editTask = (task: Task) => {
    setIsEditing(true);
    setCurrentTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("To-Do");
  };

  return (
    <div className="bg-gray-100 h-screen w-full">
      <div className="container mx-auto p-4 max-w-5xl">
        <h1 className="text-2xl font-bold mb-10 items-center flex justify-center">
          TASK MANAGEMENT
        </h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full mb-2 p-2 border rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full mb-2 p-2 border rounded max-h-48"
            required
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="block w-full mb-2 p-2 border rounded"
          >
            <option value="To-Do">To-Do</option>
            <option value="In Progress" className="bg-yellow-500 ">
              In Progress
            </option>
            <option value="Done" className="bg-green-700 text-white ">
              Done
            </option>
          </select>
          <div className="flex items-center justify-center ">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 mt-8 rounded w-40 hover:scale-110 hover:bg-blue-700 duration-300"
            >
              {isEditing ? "Update Task" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
      <div>
        <ul className="grid grid-cols-4 space-x-6 p-12">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="mb-4 p-4 border rounded hover:scale-105 bg-blue-200/50"
            >
              <h2 className="text-xl font-bold">{task.title}</h2>
              <p>{task.description}</p>
              <p className="text-sm">{task.status}</p>
              <button
                onClick={() => editTask(task)}
                className="bg-yellow-500 mt-3 hover:bg-yellow-600 text-white p-2 rounded mr-2 hover:scale-105 duration-300 w-[90px]"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTask(task._id)}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded hover:scale-105 duration-300 w-[90px]"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
