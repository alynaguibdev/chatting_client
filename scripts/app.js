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


    $rootScope.views = {
        chats: {
            mockURL: 'data/chats.json',
            view: 'subviews/chats.html',
            menu: ['New group', 'New broadcast', 'WhatsApp Web', 'Starred messages', 'Status', 'Settings']
        },
        calls: {
            mockURL: 'data/calls.json',
            view: 'subviews/calls.html',
            menu: ['Clear call log', 'Status', 'Settings']
        },
        contacts: {
            mockURL: 'data/contacts.json',
            view: 'subviews/contacts.html',
            menu: ['Refresh', 'Status', 'Settings']
        }
    };
    $rootScope.currentMenu = $rootScope.views.chats.menu;
    $rootScope.currentActionImg = 'chats';
    $rootScope.currentView = $rootScope.views.chats.view;

    $rootScope.changeView = function (val) {
        $rootScope.currentActionImg = val;
        switch (val) {
            case 'chats':
                $rootScope.currentView = $rootScope.views.chats.view;
                $rootScope.currentMenu = $rootScope.views.chats.menu;
                break;
            case 'calls':
                $rootScope.currentView = $rootScope.views.calls.view;
                $rootScope.currentMenu = $rootScope.views.calls.menu;
                break;
            case 'contacts':
                $rootScope.currentView = $rootScope.views.contacts.view;
                $rootScope.currentMenu = $rootScope.views.contacts.menu;
                break;
            default:
                $rootScope.currentView = $rootScope.views.chats.view;
                $rootScope.currentMenu = $rootScope.views.chats.menu;
        }

    };

});
//////////////////////////////////Instead of creating each type of component in separate file///////////////////////////
//////////////////////////////////directives////////////////////////////////////////////////////////////////////////////
chattingApp.directive('body', function ($compile, $rootScope, $window) {
    return {
        restrict: 'E',
        require: 'ngModel',
        compile: function (element, attr, ctrl) {
            // handel drop down menu
            $(element).on('click', function ($event) {
                if ($event.target != $('#icon_menu')[0]) {
                    $('.menuContainer').removeClass('open');
                } else {
                    $('.menuContainer').toggleClass('open');
                }
            });
        }
    };
});
//////////////////////////////////services//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////factories/////////////////////////////////////////////////////////////////////////////
chattingApp.factory('webservices', ['$rootScope', '$log', '$http', '$q', function ($rootScope, $log, $http, $q) {
    return {
        get: function (url) {
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
            return deferred.promise;
        },
        getData: function (view) {
            var deferred = $q.defer();
            switch (view) {
                case 'chats':
                    this.get($rootScope.views.chats.mockURL).then(function (res) {
                        deferred.resolve(res);
                    });
                    break;
                case 'calls':
                    this.get($rootScope.views.calls.mockURL).then(function (res) {
                        for (var v = 0; v < res.length; v++) {
                            if (res[v].dir == 0) {
                                res[v].call_type_img = 'img/call_missed.png';
                            } else if (res[v].dir == 1) {
                                res[v].call_type_img = 'img/call_out.png';
                            } else if (res[v].dir == 2) {
                                res[v].call_type_img = 'img/call_inc.png';
                            }
                        }
                        deferred.resolve(res);
                    });
                    break;
                case 'contacts':
                    this.get($rootScope.views.contacts.mockURL).then(function (res) {
                        deferred.resolve(res);
                    });
                    break;
                default:
                    this.get($rootScope.views.chats.mockURL).then(function (res) {
                        deferred.resolve(res);
                    });
            }
            return deferred.promise;
        }
    };
}]);
//////////////////////////////////controllers///////////////////////////////////////////////////////////////////////////

chattingApp.controller('chats', ['$rootScope', '$log', '$scope', '$location', '$state', 'webservices', function ($rootScope, $log, $scope, $location, $state, webservices) {

    webservices.getData('chats').then(function (res) {

    });

}]);

chattingApp.controller('contacts', ['$rootScope', '$log', '$scope', '$location', '$state', 'webservices', function ($rootScope, $log, $scope, $location, $state, webservices) {
    webservices.getData('contacts').then(function (res) {

    });

}]);

chattingApp.controller('calls', ['$rootScope', '$log', '$scope', '$location', '$state', 'webservices', function ($rootScope, $log, $scope, $location, $state, webservices) {

    webservices.getData('calls').then(function (res) {
        $scope.calls = res;
    });

}]);