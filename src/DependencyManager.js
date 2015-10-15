'use strict';

/**
 * DependencyManager
 */
class DependencyManager {

	/**
	 * Default constructor.
	 */
	constructor() {

		/**
		 * Private pool of all tracked dependencyNodes
		 * @type {Array}
		 */
		this._pool = [];
	}

	/**
	 * Create a new dependency node.
	 * @param  {Node} node The node to add to the pool
	 * @return {Node}
	 */
	createNode(node) {
		this._pool.push(node);
		return node;
	}

	/**
	 * Get node by it's name.
	 * @param  {String} name The name of the node
	 * @return {Node}
	 */
	getNodeByName(name) {
		return this._pool.find(node => node.name === name);
	}

	/**
	 * Get the chain of dependencies this node has.
	 * @param  {String} name The name of the node
	 * @return {Object}
	 */
	getChain(name) {
		return orderTasksByDependencies(
			getUnorderedDependenciesForTask(this, name)
		);
	}
}

module.exports = DependencyManager;

/**
 * Get all unordered dependencies for a given task.
 * @param  {DependencyManager} dependencyManager The manager from which to resolve dependencies
 * @param  {String}            name              The name of the node
 * @return {Object}
 */
function getUnorderedDependenciesForTask(dependencyManager, name) {
	var results = {},
		unresolvedTasks = [dependencyManager.getNodeByName(name)];

	unresolvedTasks.forEach(function heapAllDependencies(dependency) {
		var dependencies = dependency
			.dependencies
			.map(depName => dependencyManager.getNodeByName(depName))
			.filter(dep => unresolvedTasks.indexOf(dep) === -1);

		unresolvedTasks = unresolvedTasks.concat(dependencies);
		dependencies.forEach(heapAllDependencies);
	});
	return unresolvedTasks;
}

/**
 * Order the tasks by dependencies.
 * @param  {Array}  unresolvedDependencies Contains an array of unresolved dependencies
 * @return {Object}
 */
function orderTasksByDependencies(unresolvedDependencies) {
	var resolvedTasks = [];
	while (unresolvedDependencies.length) {
		var newlyResolvedTasks = unresolvedDependencies
			.filter(t => t.hasAllResolvedDependencies(resolvedTasks));

		if (!newlyResolvedTasks.length)
			throw new Error('One or more circulair dependencies found.');

		newlyResolvedTasks.forEach(t => {
			resolvedTasks = resolvedTasks.concat(unresolvedDependencies.splice(unresolvedDependencies.indexOf(t), 1));
		});
	}
	return resolvedTasks;
}
