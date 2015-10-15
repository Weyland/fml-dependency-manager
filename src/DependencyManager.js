'use strict';

class DependencyManager {
	constructor() {
		this._pool = [];
	}

	createNode(node) {
		this._pool.push(node);
		return node;
	}

	getNode(name) {
		return this._pool.find(task => task.name === name);
	}

	getChain(taskName) {
		return orderTasksByDependencies(getAllUnorderedDependenciesForTask(this, taskName));
	}
}

module.exports = DependencyManager;

function getAllUnorderedDependenciesForTask(taskManager, rootTaskName) {
	var results = {},
		unresolvedTasks = [taskManager.getNode(rootTaskName)];

	// Pile all tasks that are either rootTask of it's descendant onto one array
	unresolvedTasks.forEach(function heapAllDependencies(task) {
		var dependencies = task.dependencies
			.map(depName => taskManager.getNode(depName)).filter(dep => unresolvedTasks.indexOf(dep) === -1);
		unresolvedTasks = unresolvedTasks.concat(dependencies);
		dependencies.forEach(heapAllDependencies);
	});

	return unresolvedTasks;
}

function orderTasksByDependencies(unresolvedTasks) {
	var resolvedTasks = [];
	while (unresolvedTasks.length) {
		var newlyResolvedTasks = unresolvedTasks
			.filter(t => t.hasAllResolvedDependencies(resolvedTasks));

		if (!newlyResolvedTasks.length)
			throw new Error('Circulair dependency');

		newlyResolvedTasks.forEach(t => {
			resolvedTasks = resolvedTasks.concat(unresolvedTasks.splice(unresolvedTasks.indexOf(t), 1));
		});
	}
	return resolvedTasks;
}
