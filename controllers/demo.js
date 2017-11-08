angularapp.controller('DemoCtrl', function ($scope, $sce, $websocket, $interval, clipboard, DEMO) {
   angular.element(document).ready(function () {
        document.body.className = "loaded";
        loadWss();
    });

    $scope.Timer = null;
    $scope.autorefresh = false;
    $scope.messages = [];
    $scope.wssUrl = DEMO.wss;
    $scope.status = "";
    $scope.copied = false;
    $scope.isMine = true;

    var ws;
    var iframeclass = '';

    $scope.reload = function() {
        if ($scope.template.length > 0) {
            document.getElementById('iframe').src = document.getElementById('iframe').src
        }
    }
    $scope.load = function() {
        document.body.classList.add("loading-iframe");
        if ($scope.template.length > 0) {
            $scope.activeTemplate = $sce.trustAsResourceUrl($scope.template);
        }
    };

    $scope.startTimer = function () {
        if ($scope.template.length > 0) {
            $scope.Timer = $interval(function () {
                $scope.autorefresh = true;
                document.getElementById('iframe').src = document.getElementById('iframe').src
            }, 1000);
        }
    };

    $scope.stopTimer = function () {
        if (angular.isDefined($scope.Timer)) {
            $scope.autorefresh = false;
            $interval.cancel($scope.Timer);
        }
    };

    $scope.clickHandler = function () {
        clipboard.copyText($scope.wssUrl);
        $scope.copied = true;
    };

    $scope.toggleWss = function () {
        if ($scope.isMine) {
            $scope.wssUrl = "wss://gra1.logs.ovh.com/tail/?tk=demo";
            ws.close();
            loadWss();
            $scope.isMine = false;
        } else {
            $scope.wssUrl = DEMO.wss;
            ws.close();
            loadWss();
            $scope.isMine = true;
        }
    }

    function loadWss() {
        ws = $websocket($scope.wssUrl);
        ws.onMessage(function(event) {
            var res;
            var gelf;
            try {
                res = JSON.parse(event.data);
                gelf = JSON.parse(res.message);
            } catch(e) {
                res = {'username': 'anonymous', 'message': event.data};
                gelf = {};
            }
            $scope.messages.unshift({
                status_code: gelf['_status_code'],
                timestamp: gelf.timestamp,
                short_message: gelf['short_message'],
                host: gelf['host']
            });
            if($scope.messages.length > 15) {
                $scope.messages.pop();
            }
        });

        ws.onError(function(event) {
            $scope.status = 'Connection error';
        });

        ws.onClose(function(event) {
            $scope.status = 'Connection closed';
        });

        ws.onOpen(function() {
            $scope.status = 'Connection open';
        });
    }

}).filter('message_status_color', function() {
    return function(level) {
    return "c" + level;
};
});
