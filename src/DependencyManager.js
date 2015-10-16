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
	 * @return {Object}
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
		return orderNodesByDependencies(
			getUnorderedDependenciesForNode(this, name)
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
function getUnorderedDependenciesForNode(dependencyManager, name) {
	var unresolvedDependencies = [dependencyManager.getNodeByName(name)];
	unresolvedDependencies.forEach(function heapAllDependencies(dependency) {
		var dependencies = dependency.dependencies
			.map(name => dependencyManager.getNodeByName(name))
			.filter(dependency => unresolvedDependencies.indexOf(dependency) === -1);

		unresolvedDependencies = unresolvedDependencies.concat(dependencies);
		dependencies.forEach(heapAllDependencies);
	});
	return unresolvedDependencies;
}

/**
 * Order the tasks by dependencies.
 * @param  {Object}  unresolvedDependencies Contains an array of unresolved dependencies
 * @return {Object}
 */
function orderNodesByDependencies(unresolvedDependencies) {
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
