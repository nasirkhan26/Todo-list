'use client';
import { useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");


  function addTask() {
    if (!inputValue.trim()) {
      alert("Please enter a task. Empty task cannot be added");
      return;
    }
    const newTasks = [...tasks, inputValue];
    setTasks(newTasks);
    setInputValue("");
  }
  function removeTask(index) {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  }

  return (
    <div className="flex flex-col items-center mt-10 gap-4">
      <div className="flex gap-4">
        <input
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          type="text"
          placeholder="Enter your task for today"
          className="border border-black rounded-md h-10 px-2 text-blue-500 w-[450px] placeholder:text-gray-500 outline-none"
        />
        <button
          onClick={addTask}
          className="border rounded-md px-2 h-10 w-[100px] cursor-pointer bg-green-600 hover:bg-green-700 transition-colors text-white"
        >
          Submit
        </button>
      </div>
      <div className="flex flex-col justify-center items-center gap-2">
        {
          tasks.length === 0 ? "No tasks added yet" :
            tasks.map((task, index) => (
              <div key={index} className="flex gap-2 items-center justify-between w-full">
                <div className="flex gap-2 items-center justify-center">
                  <p className="text-blue-500 text-xl">{index + 1}.</p>
                  <p className="text-green-500 text-xl">{task}</p>
                </div>
                <button onClick={() => removeTask(index)} className="border rounded-md px-1 w-10 cursor-pointer text-red-500">
                  &times;
                </button>
              </div>
            ))
        }
      </div>
    </div>
  );
}
