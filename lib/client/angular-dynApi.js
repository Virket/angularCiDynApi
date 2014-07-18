function resourceFactory(apiDesc,$resource) {
	function DynResource() {};
	angular.forEach(apiDesc.endpoints, function(endpoint, name) {
		var endpointUrl = apiDesc.baseEndpoint + '/' + name;
		var resourceParamDefaults = {};
		for (var i = 0; i < endpoint.params.length; i++) {
			var param = Object.keys(endpoint.params[i])[0];
			endpointUrl += '/:' + param;
			resourceParamDefaults[param] = '@' + param;
		};
		var action = {}
		action[endpoint.method.toLowerCase()] = {
			method: endpoint.method,
			isArray: endpoint.returns == "array"
		};

		DynResource.prototype[name] = $resource(endpointUrl, resourceParamDefaults, action)[endpoint.method.toLowerCase()];
	});
	return new DynResource();
}

/*
var opts = {
	ngApp: //MainApp to load
	moduleName: //Name of the module
	dynamicResources:[
		{
			name: // Ressource Name
			url: // api's description url
		}
	]
}
*/
angular.LoadDynApi = function(opts) {
	var initInjector = angular.injector(['ng','ngResource']); 
	
	var moduleName = opts.moduleName || 'DynApi';
	var Module = angular.module(moduleName, []); //Module name could be configurable too 

	var $http = initInjector.get('$http');
	var $q = initInjector.get('$q');
	var $resource = initInjector.get('$resource');
	var promises = {};

	angular.forEach(opts.dynamicResources, function(dynR) {
		var promise = $http.get(dynR.url);
		promises[dynR.name] = promise;
	});

	$q.all(promises).then(function(configs) {
		angular.forEach(configs, function(conf, apiName) {
			var apiDesc = conf.data;
			console.log(apiName, apiDesc);
			Module.config(function($provide) {
				$provide.factory(apiName, function() {
					return resourceFactory(apiDesc,$resource);
				});
			});
		});

		angular.element(document).ready(function() {
			angular.bootstrap(document, [opts.ngApp]);
		});
	});
};