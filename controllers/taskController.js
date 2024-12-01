const Task = require("../models/task");

exports.createTask = async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;
        const task = new Task({ title, description, dueDate, userId: req.user.userId });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: "Task creation failed" });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.userId });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(400).json({ error: "Failed to update task" });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Task deleted" });
    } catch (error) {
        res.status(400).json({ error: "Failed to delete task" });
    }
};
