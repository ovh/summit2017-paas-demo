//! code is based on the john papa styleguide
//! https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md

// wrap controller into a function namespace
(function() {
  // declare the metrics controller to angular
  angular.module("myApp").controller("MetricsCtrl", ctrl);

  // inject dependencies
  ctrl.$inject = ["$scope", "DEMO"];

  // definition of the controller
  function ctrl($scope, DEMO) {
    $scope.demo = DEMO;
    this.ovhNic = DEMO.ovhNic
    this.ovhPassword = DEMO.ovhPassword
    this.metricsWrite = DEMO.metricsWrite
    this.vpsId = DEMO.vpsId
    this.metricsRead = DEMO.metricsRead
    this.sshUri = DEMO.sshUri
    this.warp10 = DEMO.warp10
    //const vm = this;
    //vm.nic = "sd478709-ovh";
    //vm.password = "ad6451fc94";
    //vm.token = "peTf00oNkiQBdqS7.pFdvnin5RBw9nz.MleJMybBioD6fJEPcE8aIZE27kz7iJe9wW0_YoD8JWoWZGmwwP5bPnwHlxyES50LMD9Pdas1Te3yO1VY.gCLPsetgU5kL.3oXbtzMY3ChKFtGGfjzPXLbuNYnFlGLZ6N";
  }
})();
