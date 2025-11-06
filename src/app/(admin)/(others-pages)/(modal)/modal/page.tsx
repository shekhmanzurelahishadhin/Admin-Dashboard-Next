// pages/index.tsx or your component
"use client";
import { useState } from 'react';
import TaskModal, { TaskFormData } from '@/components/modal/TaskModal';

const HomePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateTask = (taskData: TaskFormData) => {
    console.log('New task created:', taskData);
    // Handle task creation logic here
  };

  return (
    <div className="p-8">
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Add New Task
      </button>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
};

export default HomePage;