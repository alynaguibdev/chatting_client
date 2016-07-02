/**
 * Created by Aly Naguib on 7/1/2016.
 */
var $ = function (ele) {
    if (typeof ele === 'string') {
        return angular.element(document.querySelector(ele));
    } else if (typeof ele === 'object') {
        return angular.element(ele);
    }
};
var indexOf = function (needle) {
    if (typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (needle) {
            var i = -1, index = -1;

            for (i = 0; i < this.length; i++) {
                if (this[i] === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle);
};

function onLoadPage() {

    angular.element(document).ready(function () {
        angular.bootstrap(document, ["chattingApp"]);

    });

}

var chattingApp = angular.module('chattingApp', ['ui.router', 'ngEmbed', 'ngAnimate']);

chattingApp.run(function ($location, $rootScope, $state, $log, $window, $document) {
    $rootScope.currentActionImg = 'chats';

    $('#action_switcher').removeClass('hidden');
    $('#calls').removeClass('hidden');
    $('#contacts').removeClass('hidden');

    $rootScope.currentActionImg = 'chats';
    $rootScope.currentView = 'subviews/chats.html';


    $rootScope.changeView = function (val) {
        $rootScope.currentActionImg = val;
        switch (val) {
            case 'chats':
                $rootScope.currentView = 'subviews/chats.html';
                break;
            case 'calls':
                $rootScope.currentView = 'subviews/calls.html';
                break;
            case 'contacts':
                $rootScope.currentView = 'subviews/contacts.html';
                break;
            default:
                $rootScope.currentView = 'subviews/chats.html';
        }

    };

});
//////////////////////////////////Instead of creating each type of component in separate file///////////////////////////
//////////////////////////////////services//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////factories/////////////////////////////////////////////////////////////////////////////
chattingApp.factory('webservices', ['$rootScope', '$log', '$http', '$q', function ($rootScope, $log, $http, $q) {
    return {
        'get': function (url) {
            var deferred = $q.defer();
            $http({
                url: url,
                method: "GET",
                timeout: 3000,
                headers: {
                    'Content-Type': 'text/json'
                }
            }).success(function (data, status, headers, config) {
                // console.log(data);
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.resolve(undefined);
            });
            deferred.promise;
        }
    };
}]);
//////////////////////////////////controllers///////////////////////////////////////////////////////////////////////////


chattingApp.controller('chats', ['$rootScope', '$log', '$scope', '$location', '$state', function ($rootScope, $log, $scope, $location, $state) {

}]);

chattingApp.controller('contacts', ['$rootScope', '$log', '$scope', '$location', '$state', function ($rootScope, $log, $scope, $location, $state) {

}]);

chattingApp.controller('calls', ['$rootScope', '$log', '$scope', '$location', '$state', function ($rootScope, $log, $scope, $location, $state) {

}]);