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

chattingApp.config(function ($stateProvider, $urlRouterProvider, $logProvider, $compileProvider) {
    $stateProvider.state('main', {
        url: '/',
        templateUrl: 'subviews/main.html',
        controller: 'main',
        title: ''
    }).state('details', {
        url: '/details',
        templateUrl: 'subviews/detailed-view.html',
        controller: 'details',
        title: ''
    });
    $urlRouterProvider.otherwise('/');
});

chattingApp.run(function ($location, $rootScope, $state, $log, $window, $document, webservices) {
    $rootScope.currentActionImg = 'chats';

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



});
//////////////////////////////////Instead of creating each type of component in separate file///////////////////////////
//////////////////////////////////directives////////////////////////////////////////////////////////////////////////////
chattingApp.directive('body', function ($compile, $rootScope, $window) {
    return {
        restrict: 'A',
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
chattingApp.directive('enterEvent', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.enterEvent);
                });

                event.preventDefault();
            }
        });
    };
});
//////////////////////////////////services//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////factories/////////////////////////////////////////////////////////////////////////////
chattingApp.factory('webservices', ['$rootScope', '$log', '$http', '$q', '$filter', function ($rootScope, $log, $http, $q, $filter) {
    return {
        exceed1Day: function (val) {
            return ((new Date().getTime()) - val) > 24 * 60 * 60 * 1000;
        },
        exceed2Days: function (val) {
            return ((new Date().getTime()) - val) > (2 * 24 * 60 * 60 * 1000);
        },
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
        reformatChats: function (res) {
            for (var v = 0; v < res.length; v++) {
                if (res[v].img === '') {
                    res[v].img = 'img/avatar_group.png';
                }

                for (var t = 0; t < res[v].messages.length; t++) {
                    res[v].timeInFormat = this.exceed1Day(res[v].messages[t].time) && (!this.exceed2Days(res[v].messages[t].time))
                        ? 'YESTERDAY' : this.exceed2Days(res[v].messages[t].time) ? ($filter('date')(res[v].messages[t].time, 'MMMM d, h:mm a', '+02'))
                        : ($filter('date')(res[v].messages[t].time, 'h:mm a', '+02'));
                }

                res[v].lastMessage = res[v].messages.length > 0 ? res[v].messages[res[v].messages.length - 1] : {content: ''};

            }
            return res;
        },
        getData: function (view) {
            var deferred = $q.defer();
            var thisObj = this;
            switch (view) {
                case 'chats':
                    this.get($rootScope.views.chats.mockURL).then(function (res) {
                        res = thisObj.reformatChats(res);
                        deferred.resolve(res);
                    });
                    break;
                case 'calls':
                    this.get($rootScope.views.calls.mockURL).then(function (res) {
                        for (var v = 0; v < res.data.length; v++) {
                            if (res.data[v].dir == 0) {
                                res.data[v].call_type_img = 'img/call_missed.png';
                            } else if (res.data[v].dir == 1) {
                                res.data[v].call_type_img = 'img/call_out.png';
                            } else if (res.data[v].dir == 2) {
                                res.data[v].call_type_img = 'img/call_inc.png';
                            }
                            res.data[v].timeInFormat = thisObj.exceed1Day(res.data[v].time) ? ($filter('date')(res.data[v].time, 'MMMM d, h:mm a', '+02'))
                                : ($filter('date')(res.data[v].time, 'h:mm a', '+02'));
                        }
                        deferred.resolve(res);
                    });
                    break;
                case 'contacts':
                    this.get($rootScope.views.contacts.mockURL).then(function (res) {
                        for (var v = 0; v < res.data.length; v++) {
                            switch (res.data[v].label) {
                                case "0":
                                    res.data[v].labelVal = 'MOBILE';
                                    break;
                                case "1":
                                    res.data[v].labelVal = 'OTHER';
                                    break;
                                default:
                                    'MOBILE';
                                    break;
                            }
                        }
                        deferred.resolve(res);
                    });
                    break;
                default:
                    this.get($rootScope.views.chats.mockURL).then(function (res) {
                        res = this.reformatChats(res);
                        deferred.resolve(res);
                    });
            }
            return deferred.promise;
        }
    };
}]);
//////////////////////////////////controllers///////////////////////////////////////////////////////////////////////////

chattingApp.controller('chats', ['$rootScope', '$log', '$scope', '$location', '$state', 'webservices', function ($rootScope, $log, $scope, $location, $state, webservices) {
    $scope.goToDetails = function (obj) {
        $rootScope.obj = obj;
        $location.url('/details');
    };

}]);

chattingApp.controller('contacts', ['$rootScope', '$log', '$scope', '$location', '$state', 'webservices', function ($rootScope, $log, $scope, $location, $state, webservices) {


}]);

chattingApp.controller('calls', ['$rootScope', '$log', '$scope', '$location', '$state', 'webservices', '$timeout', function ($rootScope, $log, $scope, $location, $state, webservices, $timeout) {
    $timeout(function () {
        $rootScope.views.calls.newCalls = 0;
    }, 1000);

}]);

chattingApp.controller('main', ['$rootScope', '$log', '$scope', '$location', '$state', 'webservices', '$timeout', function ($rootScope, $log, $scope, $location, $state, webservices, $timeout) {

    $rootScope.currentMenu = $rootScope.views.chats.menu;
    $rootScope.currentActionImg = 'chats';
    $rootScope.currentView = $rootScope.views.chats.view;

    webservices.getData('chats').then(function (res) {
        $rootScope.views.chats.data = res;
        $rootScope.views.chats.newMessages = res.newMessages;

    });
    webservices.getData('contacts').then(function (res) {
        $rootScope.views.contacts.data = res.data;
    });
    webservices.getData('calls').then(function (res) {
        $rootScope.views.calls.newCalls = res.newCalls;
        $rootScope.views.calls.data = res.data;
    });

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

}]);

chattingApp.controller('details', ['$rootScope', '$log', '$scope', '$location', '$state', 'webservices', '$timeout', function ($rootScope, $log, $scope, $location, $state, webservices, $timeout) {

    $rootScope.detailedMenu = [{title: 'View contact'}, {title: 'Media'}, {title: 'Search'},
        {title: 'Mute'}, {title: 'Wallpaper'}, {
            title: 'More', action: function () {
                $rootScope.detailedMenu = [{title: 'Block'}, {title: 'Clear chat'}, {title: 'Email chat'}, {title: 'Add shortcut'}];
            }
        }];
    $log.debug($rootScope.obj);
    $scope.callBack = function (action) {
        if (action) {
            action();
        }
    };
    $scope.mInput = '';
    $scope.goToMain = function () {
        $location.url('/main');
    };
    if ($rootScope.obj) {
        var temp = $rootScope.obj;
        if ($rootScope.obj.isGroup) {
            temp.part_str = '';
            temp.part_str += temp.participants[0] + ',';
            for (var t = 1; t < temp.participants.length; t++) {
                temp.part_str += temp.participants[t] + ',';
            }
        }
        for (var t = 0; t < temp.messages.length; t++) {
            temp.messages[t].sender === '' ? temp.messages[t].className = 'right' : temp.messages[t].className = 'left';
        }

    }
    $scope.bindMessage = function () {
        $timeout(function () {
            $scope.mInput = $scope.mInput.trim();
            if ($scope.mInput !== '') {
                var tosend = {sender: '', content: $scope.mInput, className: 'right'};
                $rootScope.obj.messages.push(tosend);
                $scope.mInput = '';
            }
        }, 100);

    };


}]);