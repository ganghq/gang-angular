!function(){"use strict";function config($urlRouterProvider,$locationProvider,$stateProvider,FacebookProvider){$urlRouterProvider.otherwise("/welcome"),$stateProvider.state("welcome",{url:"/welcome",templateUrl:"templates/welcome.html",controller:"WelcomeCtrl",onEnter:function(fb,$state){return fb.checkStatus().then(function(){$state.go("home")})}}).state("home",{url:"/",templateUrl:"templates/home.html",controller:"HomeCtrl",resolve:{data:function(fb){return fb.checkStatus().then(function(){return fb.user().then(function(user){return fb.groups(user).then(function(groups){return{user:user,groups:groups}})})}).catch(function(){$state.go("welcome")})}}}).state("chat",{url:":channel",templateUrl:"templates/chat.html",controller:"ChatCtrl",parent:"home"}),$locationProvider.html5Mode({enabled:!1,requireBase:!1}),$locationProvider.hashPrefix("!"),FacebookProvider.init({appId:"343745845810440",status:!0})}function run(){FastClick.attach(document.body)}angular.module("application",["ui.router","ngAnimate","facebook","luegg.directives","ngWebSocket","foundation"]).config(config).run(run)}();
!function(){"use strict";angular.module("application").service("chat",function($websocket){var activeChannel,ws=$websocket("ws://zeus.fikrimuhal.com:9000/ws"),messages=[];ws.onMessage(function(e){messages.push(JSON.parse(e.data))}),this.messages=messages,this.sendMessage=function(message){var channelName="#channel";activeChannel&&(channelName="#"+activeChannel.id),ws.send(JSON.stringify({msg:message,channel:channelName}))},this.setActiveChannel=function(channel){activeChannel=channel}})}();
!function(){"use strict";angular.module("application").service("fb",function(Facebook,$rootScope){var saveAuthResponse=function(authResponse){localStorage.setItem("access-token",authResponse.accessToken),localStorage.setItem("expiresIn",authResponse.expiresIn),localStorage.setItem("userId",authResponse.userId),localStorage.setItem("signedRequest",authResponse.signedRequest)},removeAuthResponse=function(){localStorage.removeItem("access-token"),localStorage.removeItem("expiresIn"),localStorage.removeItem("userId"),localStorage.removeItem("signedRequest")};$rootScope.$watch(function(){return Facebook.isReady()},function(newVal){this.ready=newVal}),this.checkStatus=function(){return new Promise(function(resolve,reject){Facebook.getLoginStatus(function(response){"connected"===response.status?(saveAuthResponse(response.authResponse),resolve()):(removeAuthResponse(),reject())},!0)})},this.login=function(){return new Promise(function(resolve){Facebook.login(function(response){var authResponse=response.authResponse;saveAuthResponse(authResponse),resolve(authResponse.userId)},{scope:"email,user_groups"})})},this.logout=function(){return new Promise(function(resolve){Facebook.logout(function(){removeAuthResponse(),resolve()})})},this.user=function(){return new Promise(function(resolve){Facebook.api("/me",function(response){resolve(response)},{access_token:localStorage.getItem("access-token")})})},this.groups=function(user){return new Promise(function(resolve){Facebook.api("/"+user.id+"/groups",function(groups){resolve(groups.data)},{access_token:localStorage.getItem("access-token")})})}})}();
!function(){"use strict";angular.module("application").controller("ChatCtrl",function($scope,chat){$scope.messages=chat.messages})}();
!function(){"use strict";angular.module("application").controller("HomeCtrl",function($scope,$state,chat,fb,data){$scope.message="",$scope.messages=chat.messages,$scope.user=data.user,$scope.groups=data.groups,$scope.send=function(){chat.sendMessage($scope.message),$scope.message=""},$scope.logout=function(){fb.logout().then(function(){$state.go("welcome")})},$scope.changeChannel=function(channel){chat.setActiveChannel(channel),$state.go("chat",{channel:channel.id})}})}();
!function(){"use strict";angular.module("application").controller("WelcomeCtrl",function($scope,$rootScope,$state,fb){$scope.fbReady=fb.ready,$scope.login=function(){fb.login().then(function(){$state.go("home")})}})}();