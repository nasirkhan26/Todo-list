'use client';
import { useState, useEffect } from "react";
import { Modal } from 'antd';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';

export default function Home() {
  // Load tasks from localStorage on first render
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("tasks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [inputValue, setInputValue] = useState("");
  const [editIndex, setEditIndex] = useState(null); // tracks which task is being edited
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null); // tracks which task is pending deletion

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // function for adding OR saving an edited task
  function handleSubmit() {
    if (!inputValue.trim()) {
      alert("Please enter a task. Empty task cannot be added");
      return;
    }

    if (editIndex !== null) {
      // SAVE EDIT: replace the task at editIndex
      const updatedTasks = tasks.map((task, i) =>
        i === editIndex ? inputValue : task
      );
      setTasks(updatedTasks);
      setEditIndex(null); // exit edit mode
    } else {
      // ADD NEW TASK
      setTasks([...tasks, inputValue]);
    }

    setInputValue("");
  }

  // opens the confirmation modal for the chosen task
  function confirmDelete(index) {
    setDeleteIndex(index);
    setIsModalOpen(true);
  }

  // called when user confirms deletion in the modal
  function handleDeleteConfirm() {
    const newTasks = tasks.filter((_, i) => i !== deleteIndex);
    setTasks(newTasks);
    // if we were editing this task, cancel edit mode
    if (editIndex === deleteIndex) {
      setEditIndex(null);
      setInputValue("");
    }
    setIsModalOpen(false);
    setDeleteIndex(null);
  }

  // called when user cancels deletion
  function handleDeleteCancel() {
    setIsModalOpen(false);
    setDeleteIndex(null);
  }

  // clicking edit loads the task text into the input
  function startEdit(index) {
    setEditIndex(index);
    setInputValue(tasks[index]);
  }

  // filter tasks using the same inputValue — one field for both add & search
  // (only filter when NOT in edit mode)
  const filteredTasks = editIndex !== null
    ? tasks
    : tasks.filter((task) => task.toLowerCase().includes(inputValue.toLowerCase()));

  return (
    <div className="flex flex-col items-center mt-10 gap-4">

      {/* Add / Edit Task Row */}
      <div className="flex gap-4">
        <input
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          type="text"
          placeholder={editIndex !== null ? "Edit your task..." : "Enter to add or search"}
          className={`border rounded-md h-10 px-2 w-[450px] placeholder:text-gray-500 outline-none transition-colors
            ${editIndex !== null
              ? "border-blue-500 text-blue-600 bg-blue-50"
              : "border-black text-blue-500"
            }`}
        />
        <button
          onClick={handleSubmit}
          className={`border rounded-md px-2 h-10 w-[100px] cursor-pointer transition-colors text-white
            ${editIndex !== null
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-green-600 hover:bg-green-700"
            }`}
        >
          {editIndex !== null ? "Save" : "Submit"}
        </button>

        {/* Cancel button — only shown in edit mode */}
        {editIndex !== null && (
          <button
            onClick={() => { setEditIndex(null); setInputValue(""); }}
            className="border rounded-md px-2 h-10 w-[100px] cursor-pointer bg-gray-400 hover:bg-gray-500 transition-colors text-white"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Task List */}
      <div className="flex flex-col justify-center items-center gap-4">
        {filteredTasks.length === 0 ? (
          <p className="text-lg text-gray-500 animate-bounce">
            {tasks.length === 0 ? "No tasks added yet!" : "No tasks match your search"}
          </p>
        ) : (
          filteredTasks.map((task, index) => (
            <div
              key={index}
              className={`flex gap-2 items-center justify-between w-full px-2 py-1 rounded-md transition-colors
                ${editIndex === index ? "bg-blue-50 border border-blue-300" : ""}`}
            >
              <div className="flex gap-2 items-center justify-center">
                <p className="text-blue-500 text-xl">{index + 1}.</p>
                <p className="text-green-500 text-xl">{task}</p>
              </div>
              <div className="flex gap-3 items-center justify-center">
                <DeleteTwoTone
                  onClick={() => confirmDelete(index)}
                  twoToneColor="#f10b0b"
                  className="text-[25px] cursor-pointer"
                />
                <EditTwoTone
                  onClick={() => startEdit(index)}
                  twoToneColor="#0096FF"
                  className="text-[25px] cursor-pointer"
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Task"
        open={isModalOpen}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="Yes, Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete{" "}
          <strong className="text-red-500">
            "{deleteIndex !== null ? tasks[deleteIndex] : ""}"
          </strong>
          ?<br />
          <span className="text-gray-500 text-sm">This action cannot be undone.</span>
        </p>
      </Modal>
    </div>
  );
}
