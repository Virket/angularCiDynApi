angular.LoadDynApi({
	ngApp: 'example',
	moduleName: 'MyRessources',
	dynamicResources: [{
		name: 'Api',
		url: '/Api'
	}]
});

var App = angular.module('example', ['MyRessources']);

App.controller('myController', function($scope, Api) {
	$scope.list = Api.getList({
		value: 'value'
	},function(){
		console.log(arguments);
	});
	console.log($scope.list);

	$scope.obj = Api.getObject({
		key: 'keyName',
		value: 'a value'å
	});
	console.log($scope.obj);

	$scope.result = Api.postData({
		id: 'AnID',
		data: 'some Data',
		moreData: 'and More Data'
	});
	console.log($scope.result);

});