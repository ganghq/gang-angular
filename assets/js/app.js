!function(){"use strict";function config($urlProvider,$locationProvider,FacebookProvider){$urlProvider.otherwise("/welcome"),$locationProvider.html5Mode({enabled:!1,requireBase:!1}),$locationProvider.hashPrefix("!"),FacebookProvider.init("343745845810440")}function run($rootScope,$location,$state){FastClick.attach(document.body),$rootScope.$on("$stateChangeStart",function(e,toState){var isLogin="welcome"===toState.name;if(!isLogin){var auth=localStorage.getItem("authenticated");auth||(e.preventDefault(),$state.go("welcome"))}})}var Gang=angular.module("application",["ui.router","ngAnimate","facebook","luegg.directives","foundation","foundation.dynamicRouting","foundation.dynamicRouting.animations"]).config(config).run(run);config.$inject=["$urlRouterProvider","$locationProvider","FacebookProvider"],Gang.service("Gang",function(Facebook){var self=this,ws=new WebSocket("ws://zeus.fikrimuhal.com:9000/ws"),messages=[];ws.onmessage=function(e){messages.push({text:JSON.parse(e.data).msg})},this.messages=messages,this.sendMessage=function(message){ws.send(JSON.stringify({type:"message",self:!1,msg:message,uid:"db8893bb-06fe-4761-b875-b06ee7d33e1a"})),messages.push({text:message})},this.facebook={login:function(){return new Promise(function(resolve){Facebook.login(function(response){localStorage.setItem("authenticated",!0),self.authenticated=!0,resolve(response)})})},logout:function(){return new Promise(function(resolve){Facebook.logout(function(response){localStorage.removeItem("authenticated"),self.authenticated=!1,resolve(response)})})},me:function(){return new Promise(function(resolve){Facebook.api("/me",function(response){Gang.user=response,resolve(response)})})}}}).controller("WelcomeCtrl",function($scope,$state,Gang){$scope.login=function(){Gang.facebook.login().then(function(){$state.go("home")})}}).controller("HomeCtrl",function($scope,$state,Gang){$scope.message="",$scope.messages=Gang.messages,$scope.send=function(){Gang.sendMessage($scope.message),$scope.message=""},$scope.logout=function(){Gang.facebook.logout().then(function(){$state.go("welcome")})}})}();