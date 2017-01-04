/*

/*
	version 6.0.0.14

	@namespace 12th-config
	@desc common library to send http requests to 12thdoor services  
	@author RASM	
	
	*/
	(function(){
		'use strict';

		angular
		.module("12th-config",[])

    /**
       * @name getHost
       * @desc call set the domain and return it    
       */
       function getHost() {
       	var host = window.location.protocol + '//' + window.location.hostname;

       	if (host.indexOf("localhost") != -1 || host.indexOf("127.0.0.1") != -1)
            host = window.location.protocol + '//' + "kvzucejzeeubtestcompany.dev12thdoor.duoworld.com"; //test host 

        return host;
    }


	/**
	 * $setUrl Factory
	 * @namespace Factories
	 */
	 angular
	 .module("12th-config")
	 .factory('$setUrl',setUrl);

	 setUrl.$inject = [];
	/**
	   * @namespace $setUrl
	   * @desc set the service url 
	   * @memberOf Factories
	   */
	   function setUrl(){
	   	var protocol = window.location.protocol
	   	var host = window.location.host;

	   	var service = {
	   		getUrl : getUrl,
	   		getPermissionUrl : getHost() + "/apis/permission/",
	   		imagePath : getHost() +  "/apis/media/tenant/twelthdoor/",
	   		media : getHost() + "/apis/media/",
	   		authTenant : "tenant/",
	   		auth : getHost() + "/auth/",
	   		apis : getHost() + '/apis/',
	   		template : 'template/',
	   		cbs : "http://dev12thdoor.duoworld.com:3500/",
	   		command : 'command/'
	   	}

	   	return service;
	    /**
	       * @name getUrl
	       * @desc call set url method
	       * @param {String} _serviceName service Name
	       * @returns {String} url
	       * @memberOf Factories.$setUrl
	       */
	       function getUrl(_serviceName){
	       	var name = setUrl(_serviceName);
	       	return name;
	       }
	    /**
	       * @name setUrl
	       * @desc call set url method
	       * @param {String} _name service Name
	       * @returns {String} url
	       * @memberOf Factories.$setUrl
	       */
	       function setUrl(_name){
	       	var url =  getHost() + "/services/duosoftware."+ _name +".service/"+_name+"/" ;
	       	return url;
	       }
	   }

	/**
	 * $apis Factory
	 * @namespace Factories
	 */
	 angular
	 .module("12th-config")
	 .factory('$apis',factApis);

	 factApis.$inject = ["$setUrl","$http"];
	/**
	   * @namespace factApis
	   * @desc get user authentication data
	   * @memberOf Factories
	   */
	   function factApis($setUrl,$http){
	   	var service = {
	   		getApis : getApis,
	   		getHost : getHost
	   	}

	   	return service;
    	/**
	       * @name factApis
	       * @desc create object to client class
	       * @returns class object
	       * @memberOf Factories.$apis
	       */
	       function getApis(){
	       	var clients = new client(); 
	       	return clients;
	       } 
    	/**
			* @name client
	       	* @desc provide methods to access auethentication data 
	       	* @memberOf Factories.$apis
	       	*/

	       	function client(){            
	       		var ifSuccess = ifSuccess || {};
	       		var ifError = ifError || {}
	       		var sampleToken = 'testsampletoken123123';

	       		var clientService = {
	       			getMail : getMail,
	       			getName : getName,
	       			getToken : getToken,
	       			getRole : getRole,
	       			getUser : getUser,
	       			apisPermission : apisPermission,
	       			apisMedia : apisMedia,
	       			authReq : authReq,
	       			authPost : authPost,
	       			getTemplate : getTemplate,
	       			sendTemplate : sendTemplate,
	       			getSession : getSession,
	       			authReqPcode : authReqPcode,
	       			ifSuccess : ifSuccess,
	       			ifError : ifError
	       		}

	       		return clientService;
            /**
		       * @name getMail
		       * @desc create object to apis class and execute functions 
		       * @returns email
		       * @memberOf Factories.$apis.client
		       */
		       function getMail(){
		       	var clients = new apis();
		       	return clients.getCookieObj().getMail();
		       	
		       }
            /**
		       * @name getName
		       * @desc create object to apis class and execute functions 
		       * @returns user name
		       * @memberOf Factories.$apis.client
		       */
		       function getName(){
		       	var clients = new apis();
		       	return clients.getCookieObj().getName();
		       	
		       }
            /**
		       * @name getToken
		       * @desc create object to apis class and execute functions 
		       * @returns security token
		       * @memberOf Factories.$apis.client
		       */
		       function getToken(){
		       	var clients = new apis();
		       	return clients.getCookieObj().getToken();
		       	
		       }
            /**
		       * @name getRole
		       * @desc set url and create object to apis class and pass url to class method  
		       * @param {String} _mail email address
		       * @memberOf Factories.$apis.client
		       */
		       function getRole(_mail){
		       	var url = $setUrl.getPermissionUrl + "getrole/" + _mail;
		       	var clients = new apis();
		       	clients.getCookieObj().send("GET",url);
		       	
		       }
            /**
		       * @name getRole
		       * @desc set url and create object to apis class and pass url to class method  
		       * @param {String} getRole get Role
		       * @memberOf Factories.$apis.client
		       */
		       function getUser(_mail){
		       	var url = $setUrl.auth +  $setUrl.authTenant + "AddUser/" + _mail + "/user";
		       	var clients = new apis();
		       	clients.getCookieObj().send("GET",url);
		       	
		       }
            /**
		       * @name apisPermission
		       * @param {String} _methodName method name 
		       * @param {object} _body request body
		       * @desc send post req to apis/permission/ _methodName
		       * @memberOf Factories.$apis.client
		       */
		       function apisPermission(_methodName,_body){
		       	var url = $setUrl.getPermissionUrl + _methodName
		       	var clients = new apis();
		       	clients.getCookieObj().send("POST",url,_body);
		       }
            /**
		       * @name apisMedia 
		       * @param {string} _email email name
		       * @desc send post req to /apis/media/ _methodName
		       * @memberOf Factories.$apis.client
		       */
		       function apisMedia(_email){
		       	var url = $setUrl.media +'profilepic/get/' + _email
		       	var clients = new apis();
		       	clients.getCookieObj().send("GET",url);
		       }
            /**
		       * @name authReq 
		       * @param {string} _methodName method name
		       * @param {object} _body json object
		       * @desc send post req to /auth/tenant _methodName
		       * @memberOf Factories.$apis.client
		       */
		       function authReq(_methodName,_email){
		       	var url;
		       	if(_email) {
		       		url = $setUrl.auth +  $setUrl.authTenant + _methodName  +'/'+ _email;
		       	}else{
		       		url = $setUrl.auth +  $setUrl.authTenant + _methodName;
		       	} 
		       	var clients = new apis();
		       	clients.getCookieObj().send("GET",url);
		       }
            /**
		       * @name authReqPcode 
		       * @param {string} _methodName method name
		       * @param {string} _email email name
		       * @param {string} _pcode pending code 
		       * @desc send post req to /auth/tenant _methodName
		       * @memberOf Factories.$apis.client
		       */
		       function authReqPcode(_methodName,_email,_pcode){
		       	var url; 
		       	url = $setUrl.auth +  $setUrl.authTenant + _methodName  +'/'+ _email + '/' + _pcode;

		       	var clients = new apis();
		       	clients.getCookieObj().send("GET",url);
		       }
            /**
		       * @name getSession 
		       * @param {string} _methodName method name
		       * @param {string} _hostName host name
		       * @desc send post req to /auth/tenant _methodName
		       * @memberOf Factories.$apis.client
		       */
		       function getSession(_methodName,_hostName){
		       	var url;          
		       	var clients = new apis();
		       	clients.getCookieObj();
		       	url = $setUrl.auth  + _methodName  +'/'+ clients.getToken() + '/' + _hostName;		
		       	clients.send("GET",url);
		       }
            /**
		       * @name authPost 
		       * @param {string} _methodName method name
		       * @param {object} _body json object
		       * @desc send post req to /auth/_methodName
		       * @memberOf Factories.$apis.client
		       */

		       function authPost(_methodName,_body){
		       	var url = $setUrl.auth +'/'+ _methodName 
		       	var clients = new apis();
		       	clients.getCookieObj().send("POST",url,_body);
		       }
            /**
		       * @name getTemplate 
		       * @param {string} _methodName method name
		       * @param {object} _tempID template ID
		       * @desc send post req to /apis/template/getTemplate/T_EMAIL_INV_NEWMAIL
		       * @memberOf Factories.$apis.client
		       */

		       function getTemplate(_methodName,_tempID){		       	
		       	var url = $setUrl.apis +  $setUrl.template + _methodName  +'/'+ _tempID
		       	var clients = new apis();
		       	clients.getCookieObj().send("GET",url);
		       }
            /**
		       * @name sendTemplate 
		       * @param {string} _methodName method name
		       * @param {object} _body json body
		       * @desc send post req to /apis/template/updateTemplate
		       * @memberOf Factories.$apis.client
		       */

		       function sendTemplate(_methodName,_body){		       	
		       	var url = $setUrl.apis +  $setUrl.template + _methodName;
		       	var clients = new apis();
		       	clients.getCookieObj().send("POST",url,_body);
		       }
            /**
		       * @name ifSuccess
		       * @desc if http req is success then call this func 
		       * @returns class instance
		       * @param {String} func callback functoin
		       * @memberOf Factories.$apis.client
		       */
		       function ifSuccess(func){
		       	ifSuccess = func;
		       	return this;
		       }
           	/**
		       * @name ifError
		       * @desc if http req is failed then call this func 
		       * @returns class instance
		       * @param {String} func callback functoin
		       * @memberOf Factories.$apis.client
		       */
		       function ifError(func){
		       	ifError = func;
		       	return this;
		       }
             /**
				* @name apis
		       	* @desc object oriected class to set the authentication data
		       	* @memberOf Factories.$apis
		       	*/

		       	function apis(){
		       		this._authData;
		       		this._token

	            /**
			       * @name getCookieObj
			       * @desc filter cookie data  
			       * @returns class instance 
			       * @memberOf Factories.$apis.client.apis
			       */
			       apis.prototype.getCookieObj = function(){
			       	var _authData = getCookie("authData");
			       	this._authData =  decodeURIComponent(_authData);
			       	this._authData = JSON.parse(this._authData);
			       	this._token = this._authData.SecurityToken;
			       	return this;
			       }
	            /**
			       * @name getMail
			       * @desc get email
			       * @returns mail
			       * @memberOf Factories.$apis.client.apis
			       */
			       apis.prototype.getMail = function(){ 
			       	return this._authData.Email;
			       }
	            /**
			       * @name getName
			       * @desc get name
			       * @returns name
			       * @memberOf Factories.$apis.client.apis
			       */
			       apis.prototype.getName = function(){ 
			       	return this._authData.Name;
			       }
	            /**
			       * @name getToken
			       * @desc get security token
			       * @returns token
			       * @memberOf Factories.$apis.client.apis
			       */
			       apis.prototype.getToken = function(){  
			       	return (this._authData.SecurityToken) ? this._authData.SecurityToken : sampleToken;
			       }
	            /**
			       * @name send
			       * @desc filter cookie data  
			       * @param {String} _type method type(get/post) {String} _url end point url 
			       * @memberOf Factories.$apis.client.apis
			       */
			       apis.prototype.send = function(_type,_url,_body){
			       	if (_type == "POST") {
			       		$http({
			       			url : _url,
			       			method : "POST",
			       			headers : {
			       				securityToken : this._token
			       			},
			       			data : _body
			       		}).then(function(respose){
			       			var data = respose.data;
			       			if(ifSuccess) ifSuccess(data)
			       		},function(respose){
			       			var data = respose.data;
			       			if(ifError) ifError(data)
			       		})
			       	}else if (_type == "GET") {
			       		$http({
			       			url : _url,
			       			method : "GET",
			       			headers : {
			       				securityToken : this._token
			       			}
			       		}).then(function(respose){
			       			var data = respose.data;
			       			if(ifSuccess) ifSuccess(data)
			       		},function(respose){
			       			var data = respose.data;
			       			if(ifError) ifError(data)
			       		})
			       	}           
			       }
	            /**
			       * @name getCookie
			       * @desc get cookie data by name  
			       * @param {String} cname cookie name 
			       * @memberOf Factories.$apis.client.apis
			       * @return if cookie exsist return cookie else return empty string 
			       */
			       function getCookie(cname) {
			       	var name = cname + "=";
			       	var ca = document.cookie.split(';');
			       	for(var i = 0; i <ca.length; i++) {
			       		var c = ca[i];
			       		while (c.charAt(0)==' ') {
			       			c = c.substring(1);
			       		}
			       		if (c.indexOf(name) == 0) {
			       			return c.substring(name.length,c.length);
			       		}
			       	}
			       	return "";
			       }     
			   }          

			} 
		}

	/**
	 * $serviceCall Factory
	 * @namespace $serviceCall

	 */
	 angular
	 .module("12th-config")
	 .factory('$serviceCall',serviceCall);

	 serviceCall.$inject = ["$setUrl","$http","$apis","$q"];
	/**
	   * @namespace Factories
	   * @desc  handle all the service calls 
	   * @memberOf Factories
	   */
	   function serviceCall($setUrl,$http,$apis,$q){
	   	var service = {
	   		setClient : setClient
	   	}
	   	return service;
        /**
	       * @name setClient
	       * @desc set the url and create objcet to clientReq class
	       * @param {String} _methodName method name 
	       * @param {String} _service service name 
	       * @returns {object} class object
	       * @memberOf Factories.$serviceCall
	       */
	       function setClient(_methodName,_service){
	       	var url = (_service) ? $setUrl.getUrl(_service) : "";
	       	var client = new clientReq(_methodName,url,_service); 
	       	return client;
	       }
        /**
	       * @name clientReq
	       * @desc set the url parameters and send the http req
	       * @param {String} _methodName method name 
	       * @param {String} _service service name 
	       * @param {String} _url url without parameters  
	       * @memberOf Factories.$serviceCall
	       */
	       function clientReq(_method,_url,_serviceName){ 
	       	var method = _method;
	       	var url = _url;
	       	var serviceName = _serviceName;
	       	var ifSuccess;
	       	var ifError;
	       	var params="";  

	   		// call apis factory and return object 
	   		var apis = $apis.getApis();

	   		var clientService = {
	   			postReq : postReq,
	   			postResolve : postResolve,
	   			getResolve : getResolve,
	   			getReq : getReq,
	   			ifSuccess : ifSuccess,
	   			ifError : ifError,
	   			orderby : orderby,
	   			isAscending : isAscending,
	   			skip : skip,
	   			take : take,
	   			class : classFunc,
	   			timesheetID : timesheetID,
	   			projectID : projectID,
	   			type : type,
	   			typeID : typeID,
	   			getSearch : getSearch, 
	   			SheduleTime : SheduleTime,
	   			DataCount : DataCount,
	   			dayCount : dayCount,
	   			weekCount : weekCount,
	   			monthCount : monthCount,
	   			yearCount : yearCount,
	   			yearStart : yearStart,
	   			yearEnd : yearEnd,  
	   			FromDate : FromDate,
	   			ToDate : ToDate,
	   			pattern : pattern,
	   			email : email, 
	   			select : select,  
	   			viewed : viewed,     
	   			tableName : tableName,
	   			value : value,
	   			key : key,
	   			to : to,
	   			from  : from, 
	   			sendMail : sendMail, 
	   			appName : appName,
	   			profileID : profileID,
	   			prefix : prefix,
	   			sequence : sequence,
	   			preference : preference,
	   			uniqueID : uniqueID,
	   			tab : tab
	   		}

	   		return clientService;

             /**
		       * @name postReq
		       * @desc client call this method to send post request
		       * @param {String} body req body 
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function postReq(body){
		       	sendReq("POST",body);
		       }
             /**
		       * @name getReq
		       * @desc client call this method to send get request 
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function getReq(){
		       	sendReq("GET");
		       }
             /**
		       * @name postResolve
		       * @desc client call this method to send get request 
		       * @return return the $q response 
		       * @memberOf Factories.$serviceCall.clientReq
		       */

		       function postResolve(body){
		       	return sendResolve("POST",body);
		       }
             /**
		       * @name getResolve
		       * @desc client call this method to send get request 
		       * @return return the $q response 
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function getResolve(){
		       	return sendResolve("GET");
		       }
            /**
		       * @name ifSuccess
		       * @desc if http req is success then call this func 
		       * @returns class instance
		       * @param {String} func callback functoin
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function ifSuccess(func){
		       	ifSuccess = func; 
		       	return this;
		       }
           	/**
		       * @name ifError
		       * @desc if http req is failed then call this func 
		       * @returns class instance
		       * @param {func} func callback functoin
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function ifError(func){
		       	ifError = func;
		       	return this;
		       }
           	/**
		       * @name skip
		       * @desc set skip url parameter
		       * @returns class instance
		       * @param {func} num skip amount
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function skip(num){            	
		       	setParam("skip",num);
		       	return this;
		       }
           	/**
		       * @name take
		       * @desc set take url parameter
		       * @returns class instance
		       * @param {int} num take amount
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function take(num){            	
		       	setParam("take",num);
		       	return this;
		       }
           	/**
		       * @name classFunc
		       * @desc set class url parameter
		       * @returns class instance
		       * @param {string} className class Name  
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function classFunc(className){            	
		       	setParam("class",className);
		       }   
           	/**
		       * @name timesheetID
		       * @desc set timesheetID url parameter
		       * @returns class instance
		       * @param {string} timesheetID set timesheet ID  
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function timesheetID(timesheetID){            	
		       	setParam("timesheetID",timesheetID);
		       }  
           	/**
		       * @name projectID
		       * @desc set projectID url parameter
		       * @returns class instance
		       * @param {string} projectID set project ID
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function projectID(projectID){            	
		       	setParam("projectID",projectID);
		       	return this;
		       }
           	/**
		       * @name type
		       * @desc set type url parameter
		       * @returns class instance
		       * @param {string} type set type  
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function type(type){            	
		       	setParam("type",type);
		       	return this;
		       }
           	/**
		       * @name typeID
		       * @desc set typeID url parameter
		       * @returns class instance
		       * @param {string} typeID set type ID  
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function typeID(typeID){            	
		       	setParam("typeID",typeID);
		       	return this;
		       }  
           	/**
		       * @name pattern
		       * @desc set pattern url parameter
		       * @returns class instance
		       * @param {string} pattern set pattern 
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function pattern(pattern){            	
		       	setParam("pattern",pattern);
		       	return this;
		       }    
           	/**
		       * @name FromDate
		       * @desc set FromDate url parameter
		       * @returns class instance
		       * @param {string} FromDate set From Date
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function FromDate(FromDate){            	
		       	setParam("FromDate",FromDate);
		       	return this;
		       }   
           	/**
		       * @name ToDate
		       * @desc set ToDate url parameter
		       * @returns class instance
		       * @param {string} ToDate set To Date
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function ToDate(ToDate){            	
		       	setParam("ToDate",ToDate);
		       	return this;
		       } 
           	/**
		       * @name orderby
		       * @desc set orderby url parameter
		       * @returns class instance
		       * @param {string} orderby set order  
		       * @memberOf Factories.$serviceCall.clientReq
		       */ 
		       function orderby(orderby){            	
		       	setParam("orderby",orderby);
		       	return this;
		       }
           	/**
		       * @name isAscending
		       * @desc set isAscending url parameter
		       * @returns class instance
		       * @param {string} isAscending set is Ascending  
		       * @memberOf Factories.$serviceCall.clientReq
		       */   
		       function isAscending(isAscending){            	
		       	setParam("isAscending",isAscending);
		       	return this;
            }/**
		       * @name sendMail
		       * @desc set sendMail url parameter
		       * @returns class instance
		       * @param {func} select send Mail
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function sendMail(sendMail){            	
		       	setParam("sendMail",sendMail);
		       	return this;
		       } 
           	/**
		       * @name to
		       * @desc set to url parameter
		       * @returns class instance
		       * @param {func} select to date
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function to(to){            	
		       	setParam("to",to);
		       	return this;
		       }
           	/**
		       * @name from
		       * @desc set from url parameter
		       * @returns class instance
		       * @param {func} select from date
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function from(from){            	
		       	setParam("from",from);
		       	return this;
		       } 
           	/**
		       * @name tableName
		       * @desc set tableName url parameter
		       * @returns class instance
		       * @param {func} select table Name
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function tableName(tableName){            	
		       	setParam("tableName",tableName);
		       	return this;
		       }
           	/**
		       * @name key
		       * @desc set key url parameter
		       * @returns class instance
		       * @param {func} select key
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function key(key){            	
		       	setParam("key",key);
		       	return this;
		       }
           	/**
		       * @name value
		       * @desc set value url parameter
		       * @returns class instance
		       * @param {func} select value
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function value(value){            	
		       	setParam("value",value);
		       	return this;
		       }   
           	/**
		       * @name viewed
		       * @desc set viewed url parameter
		       * @returns class instance
		       * @param {func} select viewed
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function viewed(viewed){            	
		       	setParam("viewed",viewed);
		       	return this;
		       } 
           	/**
		       * @name SheduleTime
		       * @desc set SheduleTime url parameter
		       * @returns class instance
		       * @param {func} select Shedule Time 
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function SheduleTime(SheduleTime){            	
		       	setParam("SheduleTime",SheduleTime);
		       	return this;
		       }
           	/**
		       * @name DataCount
		       * @desc set DataCount url parameter
		       * @returns class instance
		       * @param {func} select Data Count
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function DataCount(DataCount){            	
		       	setParam("DataCount",DataCount);
		       	return this;
		       }
           	/**
		       * @name weekCount
		       * @desc set weekCount url parameter
		       * @returns class instance
		       * @param {func} select week Count
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function weekCount(weekCount){            	
		       	setParam("weekCount",weekCount);
		       	return this;
		       }
           	/**
		       * @name dayCount
		       * @desc set dayCount url parameter
		       * @returns class instance
		       * @param {func} select day Count
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function dayCount(dayCount){            	
		       	setParam("dayCount",dayCount);
		       	return this;
		       }
           	/**
		       * @name monthCount
		       * @desc set monthCount url parameter
		       * @returns class instance
		       * @param {func} select month Count
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function monthCount(monthCount){            	
		       	setParam("monthCount",monthCount);
		       	return this;
		       }
           	/**
		       * @name yearCount
		       * @desc set yearCount url parameter
		       * @returns class instance
		       * @param {func} select year Count
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function yearCount(yearCount){            	
		       	setParam("yearCount",yearCount);
		       	return this;
		       }
           	/**
		       * @name yearStart
		       * @desc set yearStart url parameter
		       * @returns class instance
		       * @param {func} select year Start
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function yearStart(yearStart){            	
		       	setParam("yearStart",yearStart);
		       	return this;
		       }
           	/**
		       * @name yearEnd
		       * @desc set yearEnd url parameter
		       * @returns class instance
		       * @param {func} select year End
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function yearEnd(yearEnd){            	
		       	setParam("yearEnd",yearEnd);
		       	return this;
		       }
           	/**
		       * @name select
		       * @desc set select url parameter
		       * @returns class instance
		       * @param {func} select select tab
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function select(select){            	
		       	setParam("select",select);
		       	return this;
		       }
           	/**
		       * @name appName
		       * @desc set appName url parameter
		       * @returns class instance
		       * @param {func} appName app Name
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function appName(appName){            	
		       	setParam("appName",appName);
		       	return this;
		       }
           	/**
		       * @name email
		       * @desc set email url parameter
		       * @returns class instance
		       * @param {func} email email name
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function email(email){            	
		       	setParam("email",email);
		       	return this;
		       }  
           	/**
		       * @name profileID
		       * @desc set profileID url parameter
		       * @returns class instance
		       * @param {func} profileID profile ID 
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function profileID(profileID){            	
		       	setParam("profileID",profileID);
		       	return this;
		       }  
           	/**
		       * @name preference
		       * @desc set preference url parameter
		       * @returns class instance
		       * @param {func} preference preference
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function preference(preference){            	
		       	setParam("preference",preference);
		       	return this;
		       } 
           	/**
		       * @name sequence
		       * @desc set sequence url parameter
		       * @returns class instance
		       * @param {func} sequence sequence
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function sequence(sequence){            	
		       	setParam("sequence",sequence);
		       	return this;
		       } 
           	/**
		       * @name prefix
		       * @desc set prefix url parameter
		       * @returns class instance
		       * @param {func} prefix prefix
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function prefix(prefix){            	
		       	setParam("prefix",prefix);
		       	return this;
		       }  
           	/**
		       * @name uinqueID
		       * @desc set uinqueID url parameter
		       * @returns class instance
		       * @param {func} uniqueID uinque ID
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function uniqueID(uniqueID){            	
		       	setParam("uniqueID",uniqueID);
		       	return this;
		       }  
           	/**
		       * @name tab
		       * @desc set tab url parameter
		       * @returns class instance
		       * @param {func} tab
		       * @memberOf Factories.$serviceCall.clientReq
		       */
		       function tab(tab){            	
		       	setParam("tab",tab);
		       	return this;
		       }  
   			/**
		       * @name setParam
		       * @desc append all the url params 
		       * @param {string} _key param name
		       * @param {string} _val param value
		       * @memberOf Factories.$serviceCall.clientReq
		       */  
		       function setParam(_key,_val){
		       	if (!params) {
		       		params = "?" 
		       	}else{
		       		params += "&"
		       	}
		       	params += _key + "=" + _val;
		       }

   			/**
		       * @name sendReq
		       * @desc send post or get request
		       * @param {string} _type method type
		       * @param {string} _body json data
		       * @memberOf Factories.$serviceCall.clientReq
		       */ 
		       function sendReq(_type,_body){
		       	var body;

		       	if (_type == "POST") {
		       		(_body) ? body = _body : body = {};

		       		$http({
		       			url : url + method + params,
		       			method : "POST",
		       			data : body,
		       			headers : {
		       				'securityToken': apis.getToken()
		       			}
		       		}).then(function(respose){
		       			var data = respose.data;
		       			if (ifSuccess) ifSuccess(data)
		       		},function(respose){
		       			if (ifError) ifError(respose)
		       		})
		       	}else{
		       		$http({                    
		       			url : url + method + params,
		       			method : "GET",
		       			headers : {
		       				'securityToken':  apis.getToken()
		       			}
		       		}).then(function(respose){
		       			var data = respose.data;
		       			if (ifSuccess) ifSuccess(data)
		       		},function(respose){
		       			if (ifError) ifError(respose)
		       		})
		       	}
		       }


   			/**
		       * @name sendResolve
		       * @desc send post or get request using $q
		       * @param {string} _type method type
		       * @param {string} _body json data
		       * @memberOf Factories.$serviceCall.clientReq
		       */ 
		       function sendResolve(_type,_body){
		       	var body;
		       	if (_type === "POST") {
		       		var deferred = $q.defer();
		       		(_body) ? body = _body : body = {};

		       		$http({
		       			url : url + method + params,
		       			method : "POST",
		       			data : body,
		       			headers : {
		       				'securityToken': apis.getToken()
		       			}
		       		}).then(function(respose){
		       			var data = respose.data; 
		       			deferred.resolve(data)
		       		},function(respose){
		       			var data = respose.data; 
		       			deferred.reject(data)
		       		})
		       		return deferred.promise
		       	}else{
		       		var deferred = $q.defer(); 
		       		$http({
		       			url : url + method + params,
		       			method : "GET",
		       			headers : {
		       				'securityToken': apis.getToken()
		       			}
		       		}).then(function(respose){
		       			var data = respose.data; 
		       			deferred.resolve(data)
		       		},function(respose){
		       			var data = respose.data; 
		       			deferred.reject(data)
		       		})
		       		return deferred.promise
		       	}
		       }

   			/**
		       * @name getSearch
		       * @desc return the promise to caller 
		       * @param {string} _body json data
		       * @memberOf Factories.$serviceCall.clientReq
		       */ 
		       function getSearch(_body){
		       	return $http({
		       		url : url + method + params,
		       		method : "POST",
		       		data : _body,
		       		headers : {
		       			'securityToken': apis.getToken()
		       		}		       		
		       	})
		       }
		   }
		}
  	/**
	 * Logger $imageUploader
	 * @namespace Factories
	 */
	 angular
	 .module("12th-config")
	 .factory('$imageUploader',imageUploader);

	 imageUploader.$inject = ["$setUrl","$http"];
	/**
	   * @namespace $imageUploader
	   * @desc upload images to image server
	   * @memberOf Factories
	   */
	   function imageUploader($setUrl,$http){
	   	var service = {
	   		setImage : setImage
	   	}
	   	return service;

	 	 /**
	       * @name setImage
	       * @desc create object to uploader class and return to caller
	       * @param {String} _uniqueToken image uniiqueCode/ name 
	       * @returns {object} class instance
	       * @memberOf Factories.$imageUploader
	       */
	       function setImage(_uniqueToken){
	       	var client = new uploader(_uniqueToken);
	       	return client;
	       }
     	 /**
	       * @name uploader
	       * @desc class provide methods that can access by the caller
	       * @param {String} _token image uniiqueCode/ name  
	       * @memberOf Factories.$imageUploader
	       */
	       function uploader(_token){
	       	var ifSuccess;
	       	var ifError;
	       	var clientService = {
	       		ifSuccess : ifSuccess,
	       		ifError : ifError,
	       		sendImage : sendImage
	       	}

	       	return clientService;

            /**
		       * @name ifSuccess
		       * @desc if http req is success then call this func 
		       * @returns class instance
		       * @param {String} func callback functoin
		       * @memberOf Factories.$imageUploader.uploader
		       */
		       function ifSuccess(func){
		       	ifSuccess = func;
		       	return this;
		       }
           	/**
		       * @name ifError
		       * @desc if http req is failed then call this func 
		       * @returns class instance
		       * @param {func} func callback functoin
		       * @memberOf Factories.$imageUploader.uploader
		       */
		       function ifError(func){
		       	ifError = func;
		       	return this;
		       }
           	/**
		       * @name sendImage
		       * @desc set the url and sent image to server 
		       * @param {object} json data
		       * @memberOf Factories.$imageUploader.uploader
		       */
		       function sendImage(_data){
		       	var client = new image();
		       	client.setUrl().send(_data);
		       }
           	/**
		       * @name image
		       * @desc class that implement http request  
		       * @memberOf Factories.$imageUploader.uploader.image
		       */
		       
		       function image(){
		       	this._url;  
                /**
			       * @name setUrl
			       * @desc set the image url 
			       * @returns {object} class instance
		       	   * @memberOf Factories.$imageUploader.uploader.image
		       	   */
		       	   image.prototype.setUrl = function(){
		       	   	this._url = $setUrl.imagePath +_token;
		       	   	return this;
		       	   }
	            /**
			       * @name send
			       * @desc send http req
			       * @param {object} image data  
		           * @memberOf Factories.$imageUploader.uploader.image
		           */
		           image.prototype.send = function(_data){

		           	$http.post(this._url, _data, {
		           		transformRequest: angular.identity,
		           		headers: {'Content-Type': "multipart/form-data"}
		           	}).success(function(data){
		           		if (ifSuccess) ifSuccess(data)
		           	}).error(function(data){
		           		if (ifError) ifError(data)
		           	})
		       }             
		   }  
		}
	}
	/*
		var client = $imageUploader.setImage('fafsaferadagfas.png'); // pass token 
		client.ifSuccess(function(data){
	
		})
		client.ifError(function(data){
	
		})
		client.sendImage(arr[0]) // image object 
		
		*/


	/**
	 * Logger $cbsCall
	 * @namespace Factories
	 */
	 angular
	 .module("12th-config")
	 .factory('$cbsCall',cbsCall);

	 cbsCall.$inject = ["$setUrl","$http","$apis","$serviceCall"];
	/**
	   * @namespace $cbsCall
	   * @desc call to cbs services
	   * @memberOf Factories
	   */
	   function cbsCall($setUrl,$http,$apis,$serviceCall){

	   	var service = {
	   		setClient : setClient
	   	}
	   	return service;

	 	/*
	       * @name setClient
	       * @desc create object to cbsClient class and return to caller
	       * @param {String} _methodName cbs endpoint
	       * @returns {object} class instance
	       * @memberOf Factories.$cbsCall
	       */  
	       function setClient(_methodName){
	       	var client = new cbsClient(_methodName);
	       	return client
	       }

     	 /**
	       * @name cbsClient
	       * @desc class provide methods and that can access by the caller
	       * @param {String} _token image uniiqueCode/ name  
	       * @memberOf Factories.$cbsCall
	       */
	       function cbsClient(_methodName){
	       	var ifSuccess;
	       	var ifError;

	       	var mailService = {
	       		singleMail : singleMail,
	       		bulkMail : bulkMail,
	       		ifSuccess : ifSuccess,
	       		ifError : ifError
	       	}

	       	return mailService;

            /**
		       * @name ifSuccess
		       * @desc if http req is success then call this func 
		       * @returns class instance
		       * @param {String} func callback functoin
		       * @memberOf Factories.$cbsCall.cbsClient
		       */
		       function ifSuccess(func){
		       	ifSuccess = func;
		       	return this;
		       }
           	/**
		       * @name ifError
		       * @desc if http req is failed then call this func 
		       * @returns class instance
		       * @param {func} func callback functoin
		       * @memberOf Factories.$cbsCall.cbsClient
		       */
		       function ifError(func){
		       	ifError = func;
		       	return this;
		       }

           	/**
		       * @name singleMail
		       * @desc send to one person. 
		       * @param {json} _body json body 
		       * @memberOf Factories.$cbsCall.cbsClient
		       */
		       function singleMail(_body){
		       	var url = $setUrl.cbs +  $setUrl.command + _methodName
		       	var client = new cbsClass();
		       	client.send('POST',_body,url);
		       }

           	/**
		       * @name bulkMail
		       * @desc send to multiple person. 
		       * @param {json} _body json body 
		       * @param {array} _email list of emails 
		       * @memberOf Factories.$cbsCall.cbsClient
		       */
		       function bulkMail(_body,_email){	   			
		       	var url = $setUrl.cbs +  $setUrl.command + _methodName
		       	var client = new cbsClass();
		       	client.sendBulk('POST',_body,_email,url);

		       }

	     	 /**
		       * @name cbsClass
		       * @desc class provide methods and that can access by the caller 
		       * @memberOf Factories.$cbsCall.cbsClient
		       */
		       function cbsClass(){

		   		// call apis factory and return object 
		   		var apis = $apis.getApis();

	            /**
			       * @name sendBulk
			       * @desc loop over email array list and call send function
			       * @param {string} _type method type  
			       * @param {object} _body email body  
			       * @param {array} _email email list  
			       * @param {string} _url endpoint url body  
		           * @memberOf Factories.$cbsCall.cbsClient.cbsClass
		           */
		           cbsClass.prototype.sendBulk = function(_type,_body,_email,_url){
		           	if (angular.isArray(_email) && _email.length > 0) {	   					
		           		for(var em=0; em<= _email.length-1; em++ ){
		           			_body.to = _email[em];
		           			this.send(_type,_body,_url);
		           		}
		           	}
		           } 		

	            /**
			       * @name send
			       * @desc send http req
			       * @param {string} _type method type  
			       * @param {object} _body email body  
			       * @param {string} _url endpoint url body  
		           * @memberOf Factories.$cbsCall.cbsClient.cbsClass
		           */
		           cbsClass.prototype.send = function(_type,_body,_url){
		           	if (_type === "POST") {
		           		$http({
		           			url : _url,
		           			method : "POST",
		           			headers : {
		           				'Content-type' : 'application/json',
		           				'securitytoken' : apis.getToken()
		           			},
		           			data : JSON.stringify(_body)
		           		}).then(function(respose){
		           			if (ifSuccess) ifSuccess(respose.data)
		           		},function(respose){
		           			if (ifError) ifError(respose.data)
		           		})
		           	}else{
		           		$http({
		           			url : _url,
		           			method : "GET",
		           			headers : {
		           				'Content-type' : 'application/json',
		           				'securitytoken' : token
		           			}
		           		}).then(function(respose){
		           			if (ifSuccess) ifSuccess(respose.data)
		           		},function(respose){
		           			if (ifError) ifError(respose.data)
		           		})

		           	}
		           }

		       }

		   }
		}

	   /*
		var client = $cbsCall.setClient('notification');
		client.ifSuccess(function(data){
	
		})
		client.ifError(function(data){
	
		})
		client.bulkMail(cb_json_obj, email_to_list)
		
		*/


	})();


/*
	
    version 6.0.0.12 add prefix params		12/22/2016
	version 6.0.0.13 get cookies method modified 12/16/2016
    version 6.0.0.12 add getUser method		12/07/2016
    version 6.0.0.11 get session method		12/06/2016
    version 6.0.0.10 add tab method 		12/06/2016
    version 6.0.0.9  modify authReq method	11/21/2016
    version 6.0.0.8  add getHost method 	11/21/2016
    version 6.0.0.7  add email methods  	11/18/2016
    version 6.0.0.6  add template methods  	11/17/2016
    version 6.0.0.5  reduce the url params 	11/17/2016
    version 6.0.0.4  add authPost method 	11/15/2016
    version 6.0.0.3  add url parameters 	11/11/2016
    version 6.0.0.2  format the structure 	11/11/2016
    version 6.0.0.1 'getSearch' method 		11/03/2016

*/