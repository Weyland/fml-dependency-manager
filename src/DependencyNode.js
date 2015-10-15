'use strict';

/**
 * DependencyNode
 */
class DependencyNode {

	/**
	 * Default constructor.
	 * @param  {String} name         The name of the node
	 * @param  {Array}  dependencies An array of dependencies
	 */
	constructor(name, dependencies) {

		/**
		 * The name of the node.
		 * @type {String}
		 */
		this.name = name;

		/**
		 * The dependencies of the node.
		 * @type {Array}
		 */
		this.dependencies = dependencies || [];
	}

	/**
	 * Check wether the node has resolved all it's dependencies.
	 * @param  {Object}  results An object containing the dependencies to check against.
	 * @return {Boolean}
	 */
	hasAllResolvedDependencies(results) {
		return !this.dependencies.length || this.dependencies.every(
			depName => results.find(result => result.name === depName)
		);
	}
}

module.exports = DependencyNode;
