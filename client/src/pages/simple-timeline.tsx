import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Calendar, CheckCircle, Clock, AlertTriangle, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TaskForm from "@/components/task-form";
import { getTasks, deleteTask, updateTask } from "@/lib/storage";
import type { Task } from "@shared/schema";

export default function Timeline() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    setIsLoading(true);
    const taskData = getTasks();
    setTasks(taskData);
    setIsLoading(false);
  };

  const handleDeleteTask = (id: number) => {
    const success = deleteTask(id);
    if (success) {
      loadTasks();
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const handleToggleComplete = (task: Task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    const success = updateTask(task.id, { status: newStatus });
    if (success) {
      loadTasks();
      toast({
        title: "Success",
        description: `Task marked as ${newStatus}`,
      });
    }
  };

  const handleFormSuccess = () => {
    loadTasks();
    setIsFormOpen(false);
    setSelectedTask(null);
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedTask(null);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-gray-600">Loading timeline...</div>
    </div>;
  }

  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const sortedTasks = [...tasks].sort((a, b) => {
    // Sort by due date, then by priority
    if (a.dueDate && b.dueDate) {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
    }
    
    const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
    return (priorityOrder[b.priority] || 1) - (priorityOrder[a.priority] || 1);
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "in_progress":
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate: string | null, status: string) => {
    if (!dueDate || status === "completed") return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Wedding Timeline</h1>
          <p className="text-gray-600">Track your wedding planning tasks and deadlines</p>
        </div>
        <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Overall Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tasks Completed</span>
              <span>{completedTasks} of {totalTasks}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-sm text-gray-500">{progressPercentage}% complete</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {sortedTasks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
              <p className="text-gray-500 mb-4">Start planning by adding your first wedding task</p>
              <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Task
              </Button>
            </CardContent>
          </Card>
        ) : (
          sortedTasks.map((task) => (
            <Card key={task.id} className={`hover:shadow-md transition-shadow ${
              isOverdue(task.dueDate, task.status) ? 'border-red-200 bg-red-50' : ''
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <button
                      onClick={() => handleToggleComplete(task)}
                      className="mt-1"
                    >
                      {getStatusIcon(task.status)}
                    </button>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3 className={`font-semibold ${
                          task.status === "completed" ? "line-through text-gray-500" : "text-gray-900"
                        }`}>
                          {task.title}
                        </h3>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                        {isOverdue(task.dueDate, task.status) && (
                          <Badge variant="destructive">Overdue</Badge>
                        )}
                      </div>
                      
                      {task.description && (
                        <p className="text-gray-600 text-sm">{task.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {task.dueDate && (
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Due: {formatDate(task.dueDate)}</span>
                          </span>
                        )}
                        {task.category && (
                          <span>Category: {task.category}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(task)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedTask ? "Edit Task" : "Add New Task"}
            </DialogTitle>
          </DialogHeader>
          <TaskForm 
            task={selectedTask} 
            onSuccess={handleFormSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}