'use strict';

class DependencyNode {
	constructor(name, dependencies) {
		this.name = name;
		this.dependencies = dependencies || [];
	}

	hasAllResolvedDependencies(results) {
		return !this.dependencies.length || this.dependencies.every(depName => results.find(result => result.name === depName));
	}
}

module.exports = DependencyNode;
