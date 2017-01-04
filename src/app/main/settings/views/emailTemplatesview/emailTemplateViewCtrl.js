(function()
{
'use strict';

angular
.module('app.settings')
.controller('emailTemplatesViewController',emailTemplatesViewController);

	/** @ngInject */
function emailTemplatesViewController($scope,$rootScope, $document, $mdDialog, $mdMedia, $mdToast,$serviceCall, $mdSidenav, $state, msApi, $auth, $apis)
{
			// use the below code on all child view controllers
			var vm = this;

			vm.toggleSidenav = toggleSidenav;

			function toggleSidenav(sidenavId)
			{
				$mdSidenav(sidenavId).toggle();
			}
			// dont change above code !

//START OF INVOICE EMAIL TEMPLATE....................................................................................
function emailInvoiceTemplate(){
	var apis = $apis.getApis();
	apis.ifSuccess(function(data){

		if(data.length!==0){
			vm.invoicebtnName="Update";
		}
		else{
			vm.invoicebtnName="Save";
		}
		console.log(data.Body);
		console.log(data.Title);

		vm.subject=data.Title;

		if(data.length!==0){

			var str=data.Body.toString();
			console.log(str);
			var arr = {
				"<html>": "",
				"</html>": "",
				"<br>": "\n"
			}

			var re = new RegExp(Object.keys(arr).join("|"),"gi");
			str = str.replace(re, function(matched){
				return arr[matched];
			});
			console.log(str);
			vm.invoiceemailContent=str;
			console.log(vm.invoiceemailContent);
		}
		else{
			vm.invoicebtnName="Save";
		}
	});
	apis.ifError(function(data){
		console.log(data)
		vm.invoicebtnName="Save";
		var toast = $mdToast.simple().content('there was a error, when invoice email loading').action('OK').highlightAction(false).position("bottom right");
		$mdToast.show(toast).then(function() {});
	});
	apis.getTemplate('getTemplate','T_EMAIL_INV_NEWMAIL');
}
emailInvoiceTemplate();

vm.invoiceSubmit=invoiceSubmit;

function invoiceSubmit(){

	var apis = $apis.getApis();
	apis.ifSuccess(function(data){
		if(data.length!==0){
			vm.uEmailTemplateMeata={};
			vm.uEmailTemplateMeata.TemplateID="T_EMAIL_INV_NEWMAIL";
			vm.uEmailTemplateMeata.description="Invoice param";
			vm.uEmailTemplateMeata.param="[@@no@@,@@companyName@@,@@accounturl@@,@@customer@@]" ;

			var apis = $apis.getApis();
			apis.ifSuccess(function(data){

			});
			apis.ifError(function(data){
				var toast = $mdToast.simple().content('there was a error, when invoice saving').action('OK').highlightAction(false).position("bottom right");
				$mdToast.show(toast).then(function() {});
			});
			apis.sendTemplate('updateTemplateMeta',vm.uEmailTemplateMeata);

			console.log(vm.invoiceemailContent);

			vm.emailContent1=vm.invoiceemailContent.replace(/(\r\n|\n|\r)/gm,"<br>");
			console.log(vm.emailContent1);

			var str3 = "<html>"+vm.emailContent1+"</html>";
			console.log(str3);

				//set template data
				vm.UemailTemplate={};
				vm.UemailTemplate.TemplateID="T_EMAIL_INV_NEWMAIL",
				vm.UemailTemplate.Title=vm.subject,
				vm.UemailTemplate.Owner="12thdoor",
				vm.UemailTemplate.Body=str3;

				var apis = $apis.getApis();
				apis.ifSuccess(function(data){
					var toast = $mdToast.simple().content('Successfully invoice email updated').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
					vm.invoicebtnName="Update";
				});
				apis.ifError(function(data){
					var toast = $mdToast.simple().content('there was a error, when invoice saving').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
				});
				apis.sendTemplate('updateTemplate',vm.UemailTemplate);
			}

			else
			{

				vm.emailTemplateMeata={};
				vm.emailTemplateMeata.TemplateID="T_EMAIL_INV_NEWMAIL";
				vm.emailTemplateMeata.description="Invoice param";
				vm.emailTemplateMeata.param="[@@no@@,@@companyName@@,@@accounturl@@,@@customer@@]" ;

				var apis = $apis.getApis();
				apis.ifSuccess(function(data){

				});
				apis.ifError(function(data){
					var toast = $mdToast.simple().content('there was a error, when invoice saving').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
				});
				apis.sendTemplate('setTemplateMeta',vm.emailTemplateMeata);

				console.log(vm.invoiceemailContent);
				
				vm.emailContent1=vm.invoiceemailContent.replace(/(\r\n|\n|\r)/gm,"<br>");
				console.log(vm.emailContent1);

				var str3 = "<html>"+vm.emailContent1+"</html>";
				console.log(str3);

				//set template data
				vm.emailTemplate={};
				vm.emailTemplate.TemplateID="T_EMAIL_INV_NEWMAIL",
				vm.emailTemplate.Title=vm.subject,
				vm.emailTemplate.Owner="12thdoor",
				vm.emailTemplate.Body=str3;

				var apis = $apis.getApis();
				apis.ifSuccess(function(data){
					var toast = $mdToast.simple().content('Successfully invoice email saved').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
					vm.invoicebtnName="Update";
				});
				apis.ifError(function(data){
					var toast = $mdToast.simple().content('there was a error, when invoice email updating').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
				});
				apis.sendTemplate('setTemplate',vm.emailTemplate);
			}


		});
	apis.ifError(function(data){
		var toast = $mdToast.simple().content('there was a error').action('OK').highlightAction(false).position("bottom right");
		$mdToast.show(toast).then(function() {});
	});

	apis.getTemplate('getTemplate','T_EMAIL_INV_NEWMAIL');
}
//END OF INVOICE EMAIL TEMPLATE...............................................................

//START OF CONTACT EMAIL TEMPLATE.............................................................
function emailContactTemplate(){
	var apis = $apis.getApis();
	apis.ifSuccess(function(data){

		if(data.length!==0){
			vm.contactbtnName="Update";
		}
		else{
			vm.contactbtnName="Save";
		}
		console.log(data.Body);
		console.log(data.Title);

		vm.subject1=data.Title;

		if(data.length!==0){

			var str=data.Body.toString();
			console.log(str);
			var arr = {
				"<html>": "",
				"</html>": "",
				"<br>": "\n"
			}

			var re = new RegExp(Object.keys(arr).join("|"),"gi");
			str = str.replace(re, function(matched){
				return arr[matched];
			});
			console.log(str);
			vm.contactemailContent=str;
			console.log(vm.contactemailContent);
		}
		else{
			vm.contactbtnName="Save";
		}
	});
	apis.ifError(function(data){
		console.log(data)
		vm.contactbtnName="Save";
		var toast = $mdToast.simple().content('there was a error, when contact email loading').action('OK').highlightAction(false).position("bottom right");
		$mdToast.show(toast).then(function() {});
	});
	apis.getTemplate('getTemplate','T_EMAIL_CNT_NEWMAIL');
}
emailContactTemplate();

vm.contactSubmit=contactSubmit;

function contactSubmit(){

	var apis = $apis.getApis();
	apis.ifSuccess(function(data){
		if(data.length!==0){
			vm.uEmailTemplateMeata={};
			vm.uEmailTemplateMeata.TemplateID="T_EMAIL_CNT_NEWMAIL";
			vm.uEmailTemplateMeata.description="Invoice param";
			vm.uEmailTemplateMeata.param="[@@no@@,@@companyName@@,@@accounturl@@,@@customer@@]" ;

			var apis = $apis.getApis();
			apis.ifSuccess(function(data){

			});
			apis.ifError(function(data){
				var toast = $mdToast.simple().content('there was a error, when contact saving').action('OK').highlightAction(false).position("bottom right");
				$mdToast.show(toast).then(function() {});
			});
			apis.sendTemplate('updateTemplateMeta',vm.uEmailTemplateMeata);

			console.log(vm.contactemailContent);

			vm.emailContent1=vm.contactemailContent.replace(/(\r\n|\n|\r)/gm,"<br>");
			console.log(vm.emailContent1);

			var str3 = "<html>"+vm.emailContent1+"</html>";
			console.log(str3);

				//set template data
				vm.UemailTemplate={};
				vm.UemailTemplate.TemplateID="T_EMAIL_CNT_NEWMAIL",
				vm.UemailTemplate.Title=vm.subject1,
				vm.UemailTemplate.Owner="12thdoor",
				vm.UemailTemplate.Body=str3;

				var apis = $apis.getApis();
				apis.ifSuccess(function(data){
					var toast = $mdToast.simple().content('Successfully contact email updated').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
					vm.contactbtnName="Update";
				});
				apis.ifError(function(data){
					var toast = $mdToast.simple().content('there was a error, when contact updating').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
				});
				apis.sendTemplate('updateTemplate',vm.UemailTemplate);
			}

			else
			{

				vm.emailTemplateMeata={};
				vm.emailTemplateMeata.TemplateID="T_EMAIL_CNT_NEWMAIL";
				vm.emailTemplateMeata.description="Invoice param";
				vm.emailTemplateMeata.param="[@@no@@,@@companyName@@,@@accounturl@@,@@customer@@]" ;

				var apis = $apis.getApis();
				apis.ifSuccess(function(data){

				});
				apis.ifError(function(data){
					var toast = $mdToast.simple().content('there was a error, when contact saving').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
				});
				apis.sendTemplate('setTemplateMeta',vm.emailTemplateMeata);

				console.log(vm.contactemailContent);
				
				vm.emailContent1=vm.contactemailContent.replace(/(\r\n|\n|\r)/gm,"<br>");
				console.log(vm.emailContent1);

				var str3 = "<html>"+vm.emailContent1+"</html>";
				console.log(str3);

				//set template data
				vm.emailTemplate={};
				vm.emailTemplate.TemplateID="T_EMAIL_CNT_NEWMAIL",
				vm.emailTemplate.Title=vm.subject1,
				vm.emailTemplate.Owner="12thdoor",
				vm.emailTemplate.Body=str3;

				var apis = $apis.getApis();
				apis.ifSuccess(function(data){
					var toast = $mdToast.simple().content('Successfully contact email saved').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
					vm.contactbtnName="Update";
				});
				apis.ifError(function(data){
					var toast = $mdToast.simple().content('there was a error, when contact email saving').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
				});
				apis.sendTemplate('setTemplate',vm.emailTemplate);
			}


		});
	apis.ifError(function(data){
		var toast = $mdToast.simple().content('there was a error').action('OK').highlightAction(false).position("bottom right");
		$mdToast.show(toast).then(function() {});
	});

	apis.getTemplate('getTemplate','T_EMAIL_CNT_NEWMAIL');
}
//END OF CONTACT EMAIL TEMPLATE...............................................................

//START OF PAYMENT EMAIL TEMPLATE...............................................................
function emailPaymentTemplate(){
	var apis = $apis.getApis();
	apis.ifSuccess(function(data){

		if(data.length!==0){
			vm.paymentbtnName="Update";
		}
		else{
			vm.paymentbtnName="Save";
		}
		console.log(data.Body);
		console.log(data.Title);

		vm.subject2=data.Title;

		if(data.length!==0){

			var str=data.Body.toString();
			console.log(str);
			var arr = {
				"<html>": "",
				"</html>": "",
				"<br>": "\n"
			}

			var re = new RegExp(Object.keys(arr).join("|"),"gi");
			str = str.replace(re, function(matched){
				return arr[matched];
			});
			console.log(str);
			vm.paymentemailContent=str;
			console.log(vm.paymentemailContent);
		}
		else{
			vm.paymentbtnName="Save";
		}
	});
	apis.ifError(function(data){
		console.log(data)
		vm.paymentbtnName="Save";
		var toast = $mdToast.simple().content('there was a error, when payment email loading').action('OK').highlightAction(false).position("bottom right");
		$mdToast.show(toast).then(function() {});
	});
	apis.getTemplate('getTemplate','T_EMAIL_PAY_NEWMAIL');
}
emailPaymentTemplate();

vm.paymentSubmit=paymentSubmit;

function paymentSubmit(){

	var apis = $apis.getApis();
	apis.ifSuccess(function(data){
		if(data.length!==0){
			vm.uEmailTemplateMeata={};
			vm.uEmailTemplateMeata.TemplateID="T_EMAIL_PAY_NEWMAIL";
			vm.uEmailTemplateMeata.description="Invoice param";
			vm.uEmailTemplateMeata.param="[@@no@@,@@companyName@@,@@accounturl@@,@@customer@@]" ;

			var apis = $apis.getApis();
			apis.ifSuccess(function(data){

			});
			apis.ifError(function(data){
				var toast = $mdToast.simple().content('there was a error, when payment saving').action('OK').highlightAction(false).position("bottom right");
				$mdToast.show(toast).then(function() {});
			});
			apis.sendTemplate('updateTemplateMeta',vm.uEmailTemplateMeata);

			console.log(vm.paymentemailContent);

			vm.emailContent1=vm.paymentemailContent.replace(/(\r\n|\n|\r)/gm,"<br>");
			console.log(vm.emailContent1);

			var str3 = "<html>"+vm.emailContent1+"</html>";
			console.log(str3);

				//set template data
				vm.UemailTemplate={};
				vm.UemailTemplate.TemplateID="T_EMAIL_PAY_NEWMAIL",
				vm.UemailTemplate.Title=vm.subject2,
				vm.UemailTemplate.Owner="12thdoor",
				vm.UemailTemplate.Body=str3;

				var apis = $apis.getApis();
				apis.ifSuccess(function(data){
					var toast = $mdToast.simple().content('Successfully payment email updated').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
					vm.paymentbtnName="Update";
				});
				apis.ifError(function(data){
					var toast = $mdToast.simple().content('there was a error, when payment updating').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
				});
				apis.sendTemplate('updateTemplate',vm.UemailTemplate);
			}

			else
			{

				vm.emailTemplateMeata={};
				vm.emailTemplateMeata.TemplateID="T_EMAIL_PAY_NEWMAIL";
				vm.emailTemplateMeata.description="Invoice param";
				vm.emailTemplateMeata.param="[@@no@@,@@companyName@@,@@accounturl@@,@@customer@@]" ;

				var apis = $apis.getApis();
				apis.ifSuccess(function(data){

				});
				apis.ifError(function(data){
					var toast = $mdToast.simple().content('there was a error, when payment saving').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
				});
				apis.sendTemplate('setTemplateMeta',vm.emailTemplateMeata);

				console.log(vm.paymentemailContent);
				
				vm.emailContent1=vm.paymentemailContent.replace(/(\r\n|\n|\r)/gm,"<br>");
				console.log(vm.emailContent1);

				var str3 = "<html>"+vm.emailContent1+"</html>";
				console.log(str3);

				//set template data
				vm.emailTemplate={};
				vm.emailTemplate.TemplateID="T_EMAIL_PAY_NEWMAIL",
				vm.emailTemplate.Title=vm.subject2,
				vm.emailTemplate.Owner="12thdoor",
				vm.emailTemplate.Body=str3;

				var apis = $apis.getApis();
				apis.ifSuccess(function(data){
					var toast = $mdToast.simple().content('Successfully payment email saved').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
					vm.paymentbtnName="Update";
				});
				apis.ifError(function(data){
					var toast = $mdToast.simple().content('there was a error, when payment email saving').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
				});
				apis.sendTemplate('setTemplate',vm.emailTemplate);
			}


		});
	apis.ifError(function(data){
		var toast = $mdToast.simple().content('there was a error').action('OK').highlightAction(false).position("bottom right");
		$mdToast.show(toast).then(function() {});
	});

	apis.getTemplate('getTemplate','T_EMAIL_PAY_NEWMAIL');
}
//END OF PAYMENT EMAIL TEMPLATE...............................................................

//START OF PRODUCT EMAIL TEMPLATE...............................................................
function emailProductTemplate(){
	var apis = $apis.getApis();
	apis.ifSuccess(function(data){

		if(data.length!==0){
			vm.productbtnName="Update";
		}
		else{
			vm.productbtnName="Save";
		}
		console.log(data.Body);
		console.log(data.Title);

		vm.subject3=data.Title;

		if(data.length!==0){

			var str=data.Body.toString();
			console.log(str);
			var arr = {
				"<html>": "",
				"</html>": "",
				"<br>": "\n"
			}

			var re = new RegExp(Object.keys(arr).join("|"),"gi");
			str = str.replace(re, function(matched){
				return arr[matched];
			});
			console.log(str);
			vm.productemailContent=str;
			console.log(vm.productemailContent);
		}
		else{
			vm.productbtnName="Save";
		}
	});
	apis.ifError(function(data){
		console.log(data)
		vm.productbtnName="Save";
		var toast = $mdToast.simple().content('there was a error, when product email loading').action('OK').highlightAction(false).position("bottom right");
		$mdToast.show(toast).then(function() {});
	});
	apis.getTemplate('getTemplate','T_EMAIL_PRO_NEWMAIL');
}
emailProductTemplate();

vm.productSubmit=productSubmit;

function productSubmit(){

	var apis = $apis.getApis();
	apis.ifSuccess(function(data){
		if(data.length!==0){
			vm.uEmailTemplateMeata={};
			vm.uEmailTemplateMeata.TemplateID="T_EMAIL_PRO_NEWMAIL";
			vm.uEmailTemplateMeata.description="Product param";
			vm.uEmailTemplateMeata.param="[@@no@@,@@companyName@@,@@accounturl@@,@@customer@@]" ;

			var apis = $apis.getApis();
			apis.ifSuccess(function(data){

			});
			apis.ifError(function(data){
				var toast = $mdToast.simple().content('there was a error, when product saving').action('OK').highlightAction(false).position("bottom right");
				$mdToast.show(toast).then(function() {});
			});
			apis.sendTemplate('updateTemplateMeta',vm.uEmailTemplateMeata);

			console.log(vm.productemailContent);

			vm.emailContent1=vm.productemailContent.replace(/(\r\n|\n|\r)/gm,"<br>");
			console.log(vm.emailContent1);

			var str3 = "<html>"+vm.emailContent1+"</html>";
			console.log(str3);

				//set template data
				vm.UemailTemplate={};
				vm.UemailTemplate.TemplateID="T_EMAIL_PRO_NEWMAIL",
				vm.UemailTemplate.Title=vm.subject3,
				vm.UemailTemplate.Owner="12thdoor",
				vm.UemailTemplate.Body=str3;

				var apis = $apis.getApis();
				apis.ifSuccess(function(data){
					var toast = $mdToast.simple().content('Successfully product email updated').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
					vm.productbtnName="Update";
				});
				apis.ifError(function(data){
					var toast = $mdToast.simple().content('there was a error, when product updating').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
				});
				apis.sendTemplate('updateTemplate',vm.UemailTemplate);
			}

			else
			{

				vm.emailTemplateMeata={};
				vm.emailTemplateMeata.TemplateID="T_EMAIL_PRO_NEWMAIL";
				vm.emailTemplateMeata.description="Product param";
				vm.emailTemplateMeata.param="[@@no@@,@@companyName@@,@@accounturl@@,@@customer@@]" ;

				var apis = $apis.getApis();
				apis.ifSuccess(function(data){

				});
				apis.ifError(function(data){
					var toast = $mdToast.simple().content('there was a error, when payment saving').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
				});
				apis.sendTemplate('setTemplateMeta',vm.emailTemplateMeata);

				console.log(vm.productemailContent);
				
				vm.emailContent1=vm.productemailContent.replace(/(\r\n|\n|\r)/gm,"<br>");
				console.log(vm.emailContent1);

				var str3 = "<html>"+vm.emailContent1+"</html>";
				console.log(str3);

				//set template data
				vm.emailTemplate={};
				vm.emailTemplate.TemplateID="T_EMAIL_PRO_NEWMAIL",
				vm.emailTemplate.Title=vm.subject3,
				vm.emailTemplate.Owner="12thdoor",
				vm.emailTemplate.Body=str3;

				var apis = $apis.getApis();
				apis.ifSuccess(function(data){
					var toast = $mdToast.simple().content('Successfully product email saved').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
					vm.productbtnName="Update";
				});
				apis.ifError(function(data){
					var toast = $mdToast.simple().content('there was a error, when product email saving').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
				});
				apis.sendTemplate('setTemplate',vm.emailTemplate);
			}


		});
	apis.ifError(function(data){
		var toast = $mdToast.simple().content('there was a error').action('OK').highlightAction(false).position("bottom right");
		$mdToast.show(toast).then(function() {});
	});

	apis.getTemplate('getTemplate','T_EMAIL_PRO_NEWMAIL');
}
//END OF PRODUCT EMAIL TEMPLATE...............................................................

//START OF EXPENSE EMAIL TEMPLATE............................................................
    function emailExpenseTemplate(){
	var apis = $apis.getApis();
	apis.ifSuccess(function(data){

		if(data.length!==0){
			vm.expensebtnName="Update";
		}
		else{
			vm.expensebtnName="Save";
		}
		console.log(data.Body);
		console.log(data.Title);

		vm.subject4=data.Title;

		if(data.length!==0){

			var str=data.Body.toString();
			console.log(str);
			var arr = {
				"<html>": "",
				"</html>": "",
				"<br>": "\n"
			}

			var re = new RegExp(Object.keys(arr).join("|"),"gi");
			str = str.replace(re, function(matched){
				return arr[matched];
			});
			console.log(str);
			vm.expenseemailContent=str;
			console.log(vm.expenseemailContent);
		}
		else{
			vm.expensebtnName="Save";
		}
	});
	apis.ifError(function(data){
		console.log(data)
		vm.expensebtnName="Save";
		var toast = $mdToast.simple().content('there was a error, when expense email loading').action('OK').highlightAction(false).position("bottom right");
		$mdToast.show(toast).then(function() {});
	});
	apis.getTemplate('getTemplate','T_EMAIL_EXP_NEWMAIL');
}
emailExpenseTemplate();

vm.expenseSubmit=expenseSubmit;

function expenseSubmit(){

	var apis = $apis.getApis();
	apis.ifSuccess(function(data){
		if(data.length!==0){
			vm.uEmailTemplateMeata={};
			vm.uEmailTemplateMeata.TemplateID="T_EMAIL_EXP_NEWMAIL";
			vm.uEmailTemplateMeata.description="Expense param";
			vm.uEmailTemplateMeata.param="[@@no@@,@@companyName@@,@@accounturl@@,@@customer@@]" ;

			var apis = $apis.getApis();
			apis.ifSuccess(function(data){

			});
			apis.ifError(function(data){
				var toast = $mdToast.simple().content('there was a error, when expense saving').action('OK').highlightAction(false).position("bottom right");
				$mdToast.show(toast).then(function() {});
			});
			apis.sendTemplate('updateTemplateMeta',vm.uEmailTemplateMeata);

			console.log(vm.expenseemailContent);

			vm.emailContent1=vm.expenseemailContent.replace(/(\r\n|\n|\r)/gm,"<br>");
			console.log(vm.emailContent1);

			var str3 = "<html>"+vm.emailContent1+"</html>";
			console.log(str3);

				//set template data
				vm.UemailTemplate={};
				vm.UemailTemplate.TemplateID="T_EMAIL_EXP_NEWMAIL",
				vm.UemailTemplate.Title=vm.subject4,
				vm.UemailTemplate.Owner="12thdoor",
				vm.UemailTemplate.Body=str3;

				var apis = $apis.getApis();
				apis.ifSuccess(function(data){
					var toast = $mdToast.simple().content('Successfully expense email updated').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
					vm.expensebtnName="Update";
				});
				apis.ifError(function(data){
					var toast = $mdToast.simple().content('there was a error, when expense saving').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
				});
				apis.sendTemplate('updateTemplate',vm.UemailTemplate);
			}

			else
			{

				vm.emailTemplateMeata={};
				vm.emailTemplateMeata.TemplateID="T_EMAIL_EXP_NEWMAIL";
				vm.emailTemplateMeata.description="Expense param";
				vm.emailTemplateMeata.param="[@@no@@,@@companyName@@,@@accounturl@@,@@customer@@]" ;

				var apis = $apis.getApis();
				apis.ifSuccess(function(data){

				});
				apis.ifError(function(data){
					var toast = $mdToast.simple().content('there was a error, when expense saving').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
				});
				apis.sendTemplate('setTemplateMeta',vm.emailTemplateMeata);

				console.log(vm.expenseemailContent);
				
				vm.emailContent1=vm.expenseemailContent.replace(/(\r\n|\n|\r)/gm,"<br>");
				console.log(vm.emailContent1);

				var str3 = "<html>"+vm.emailContent1+"</html>";
				console.log(str3);

				//set template data
				vm.emailTemplate={};
				vm.emailTemplate.TemplateID="T_EMAIL_EXP_NEWMAIL",
				vm.emailTemplate.Title=vm.subject4,
				vm.emailTemplate.Owner="12thdoor",
				vm.emailTemplate.Body=str3;

				var apis = $apis.getApis();
				apis.ifSuccess(function(data){
					var toast = $mdToast.simple().content('Successfully expense email saved').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
					vm.expensebtnName="Update";
				});
				apis.ifError(function(data){
					var toast = $mdToast.simple().content('there was a error, when expense email updating').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
				});
				apis.sendTemplate('setTemplate',vm.emailTemplate);
			}


		});
	apis.ifError(function(data){
		var toast = $mdToast.simple().content('there was a error').action('OK').highlightAction(false).position("bottom right");
		$mdToast.show(toast).then(function() {});
	});

	apis.getTemplate('getTemplate','T_EMAIL_EXP_NEWMAIL');
}
//END OF EXPENSE EMAIL TEMPLATE...............................................................
    
//START OF INVENTORY EMAIL TEMPLATE....................................................................................
function emailInventoryTemplate(){
	var apis = $apis.getApis();
	apis.ifSuccess(function(data){

		if(data.length!==0){
			vm.inventorybtnName="Update";
		}
		else{
			vm.inventorybtnName="Save";
		}
		console.log(data.Body);
		console.log(data.Title);

		vm.subject5=data.Title;

		if(data.length!==0){

			var str=data.Body.toString();
			console.log(str);
			var arr = {
				"<html>": "",
				"</html>": "",
				"<br>": "\n"
			}

			var re = new RegExp(Object.keys(arr).join("|"),"gi");
			str = str.replace(re, function(matched){
				return arr[matched];
			});
			console.log(str);
			vm.inventoryemailContent=str;
			console.log(vm.inventoryemailContent);
		}
		else{
			vm.inventorybtnName="Save";
		}
	});
	apis.ifError(function(data){
		console.log(data)
		vm.inventorybtnName="Save";
		var toast = $mdToast.simple().content('there was a error, when inventory email loading').action('OK').highlightAction(false).position("bottom right");
		$mdToast.show(toast).then(function() {});
	});
	apis.getTemplate('getTemplate','T_EMAIL_INVENTORY_NEWMAIL');
}
emailInventoryTemplate();

vm.inventorySubmit=inventorySubmit;

function inventorySubmit(){

	var apis = $apis.getApis();
	apis.ifSuccess(function(data){
		if(data.length!==0){
			vm.uEmailTemplateMeata={};
			vm.uEmailTemplateMeata.TemplateID="T_EMAIL_INVENTORY_NEWMAIL";
			vm.uEmailTemplateMeata.description="Inventory param";
			vm.uEmailTemplateMeata.param="[@@no@@,@@companyName@@,@@accounturl@@,@@customer@@]" ;

			var apis = $apis.getApis();
			apis.ifSuccess(function(data){

			});
			apis.ifError(function(data){
				var toast = $mdToast.simple().content('there was a error, when inventory saving').action('OK').highlightAction(false).position("bottom right");
				$mdToast.show(toast).then(function() {});
			});
			apis.sendTemplate('updateTemplateMeta',vm.uEmailTemplateMeata);

			console.log(vm.inventoryemailContent);

			vm.emailContent1=vm.inventoryemailContent.replace(/(\r\n|\n|\r)/gm,"<br>");
			console.log(vm.emailContent1);

			var str3 = "<html>"+vm.emailContent1+"</html>";
			console.log(str3);

				//set template data
				vm.UemailTemplate={};
				vm.UemailTemplate.TemplateID="T_EMAIL_INVENTORY_NEWMAIL",
				vm.UemailTemplate.Title=vm.subject5,
				vm.UemailTemplate.Owner="12thdoor",
				vm.UemailTemplate.Body=str3;

				var apis = $apis.getApis();
				apis.ifSuccess(function(data){
					var toast = $mdToast.simple().content('Successfully inventory email updated').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
					vm.inventorybtnName="Update";
				});
				apis.ifError(function(data){
					var toast = $mdToast.simple().content('there was a error, when inventory saving').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
				});
				apis.sendTemplate('updateTemplate',vm.UemailTemplate);
			}

			else
			{

				vm.emailTemplateMeata={};
				vm.emailTemplateMeata.TemplateID="T_EMAIL_INVENTORY_NEWMAIL";
				vm.emailTemplateMeata.description="Inventory param";
				vm.emailTemplateMeata.param="[@@no@@,@@companyName@@,@@accounturl@@,@@customer@@]" ;

				var apis = $apis.getApis();
				apis.ifSuccess(function(data){

				});
				apis.ifError(function(data){
					var toast = $mdToast.simple().content('there was a error, when inventory saving').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
				});
				apis.sendTemplate('setTemplateMeta',vm.emailTemplateMeata);

				console.log(vm.inventoryemailContent);
				
				vm.emailContent1=vm.inventoryemailContent.replace(/(\r\n|\n|\r)/gm,"<br>");
				console.log(vm.emailContent1);

				var str3 = "<html>"+vm.emailContent1+"</html>";
				console.log(str3);

				//set template data
				vm.emailTemplate={};
				vm.emailTemplate.TemplateID="T_EMAIL_INVENTORY_NEWMAIL",
				vm.emailTemplate.Title=vm.subject5,
				vm.emailTemplate.Owner="12thdoor",
				vm.emailTemplate.Body=str3;

				var apis = $apis.getApis();
				apis.ifSuccess(function(data){
					var toast = $mdToast.simple().content('Successfully inventory email saved').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
					vm.inventorybtnName="Update";
				});
				apis.ifError(function(data){
					var toast = $mdToast.simple().content('there was a error, when inventory email updating').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
				});
				apis.sendTemplate('setTemplate',vm.emailTemplate);
			}


		});
	apis.ifError(function(data){
		var toast = $mdToast.simple().content('there was a error').action('OK').highlightAction(false).position("bottom right");
		$mdToast.show(toast).then(function() {});
	});

	apis.getTemplate('getTemplate','T_EMAIL_INVENTORY_NEWMAIL');
}
//END OF INVENTORY EMAIL TEMPLATE...............................................................   
    
//START OF PAYMENT REMINDER EMAIL TEMPLATE....................................................................................
function emailPaymentReminderTemplate(){
	var apis = $apis.getApis();
	apis.ifSuccess(function(data){

		if(data.length!==0){
			vm.paymentReminderbtnName="Update";
		}
		else{
			vm.paymentReminderbtnName="Save";
		}
		console.log(data.Body);
		console.log(data.Title);

		vm.subject6=data.Title;

		if(data.length!==0){

			var str=data.Body.toString();
			console.log(str);
			var arr = {
				"<html>": "",
				"</html>": "",
				"<br>": "\n"
			}

			var re = new RegExp(Object.keys(arr).join("|"),"gi");
			str = str.replace(re, function(matched){
				return arr[matched];
			});
			console.log(str);
			vm.paymentReminderemailContent=str;
			console.log(vm.paymentReminderemailContent);
		}
		else{
			vm.paymentReminderbtnName="Save";
		}
	});
	apis.ifError(function(data){
		console.log(data)
		vm.paymentReminderbtnName="Save";
		var toast = $mdToast.simple().content('there was a error, when payment reminder email loading').action('OK').highlightAction(false).position("bottom right");
		$mdToast.show(toast).then(function() {});
	});
	apis.getTemplate('getTemplate','T_EMAIL_PAYREMINDER_NEWMAIL');
}
emailPaymentReminderTemplate();

vm.paymentReminderSubmit=paymentReminderSubmit;

function paymentReminderSubmit(){

	var apis = $apis.getApis();
	apis.ifSuccess(function(data){
		if(data.length!==0){
			vm.uEmailTemplateMeata={};
			vm.uEmailTemplateMeata.TemplateID="T_EMAIL_PAYREMINDER_NEWMAIL";
			vm.uEmailTemplateMeata.description="Payment reminder param";
			vm.uEmailTemplateMeata.param="[@@no@@,@@companyName@@,@@accounturl@@,@@customer@@]" ;

			var apis = $apis.getApis();
			apis.ifSuccess(function(data){

			});
			apis.ifError(function(data){
				var toast = $mdToast.simple().content('there was a error, when payment reminder saving').action('OK').highlightAction(false).position("bottom right");
				$mdToast.show(toast).then(function() {});
			});
			apis.sendTemplate('updateTemplateMeta',vm.uEmailTemplateMeata);

			console.log(vm.paymentReminderemailContent);

			vm.emailContent1=vm.paymentReminderemailContent.replace(/(\r\n|\n|\r)/gm,"<br>");
			console.log(vm.emailContent1);

			var str3 = "<html>"+vm.emailContent1+"</html>";
			console.log(str3);

				//set template data
				vm.UemailTemplate={};
				vm.UemailTemplate.TemplateID="T_EMAIL_PAYREMINDER_NEWMAIL",
				vm.UemailTemplate.Title=vm.subject6,
				vm.UemailTemplate.Owner="12thdoor",
				vm.UemailTemplate.Body=str3;

				var apis = $apis.getApis();
				apis.ifSuccess(function(data){
					var toast = $mdToast.simple().content('Successfully payment reminder email updated').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
					vm.paymentReminderbtnName="Update";
				});
				apis.ifError(function(data){
					var toast = $mdToast.simple().content('there was a error, when payment reminder saving').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
				});
				apis.sendTemplate('updateTemplate',vm.UemailTemplate);
			}

			else
			{

				vm.emailTemplateMeata={};
				vm.emailTemplateMeata.TemplateID="T_EMAIL_INV_NEWMAIL";
				vm.emailTemplateMeata.description="Payment reminder param";
				vm.emailTemplateMeata.param="[@@no@@,@@companyName@@,@@accounturl@@,@@customer@@]" ;

				var apis = $apis.getApis();
				apis.ifSuccess(function(data){

				});
				apis.ifError(function(data){
					var toast = $mdToast.simple().content('there was a error, when payment reminder saving').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
				});
				apis.sendTemplate('setTemplateMeta',vm.emailTemplateMeata);

				console.log(vm.paymentReminderemailContent);
				
				vm.emailContent1=vm.paymentReminderemailContent.replace(/(\r\n|\n|\r)/gm,"<br>");
				console.log(vm.emailContent1);

				var str3 = "<html>"+vm.emailContent1+"</html>";
				console.log(str3);

				//set template data
				vm.emailTemplate={};
				vm.emailTemplate.TemplateID="T_EMAIL_PAYREMINDER_NEWMAIL",
				vm.emailTemplate.Title=vm.subject6,
				vm.emailTemplate.Owner="12thdoor",
				vm.emailTemplate.Body=str3;

				var apis = $apis.getApis();
				apis.ifSuccess(function(data){
					var toast = $mdToast.simple().content('Successfully payment reminder email saved').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
					vm.paymentReminderbtnName="Update";
				});
				apis.ifError(function(data){
					var toast = $mdToast.simple().content('there was a error, when payment reminder email updating').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
				});
				apis.sendTemplate('setTemplate',vm.emailTemplate);
			}


		});
	apis.ifError(function(data){
		var toast = $mdToast.simple().content('there was a error').action('OK').highlightAction(false).position("bottom right");
		$mdToast.show(toast).then(function() {});
	});

	apis.getTemplate('getTemplate','T_EMAIL_PAYREMINDER_NEWMAIL');
}
//END OF  PAYMENT REMINDER TEMPLATE...............................................................
    
//START OF ESTIMATE EMAIL TEMPLATE....................................................................................
function emailEstimateTemplate(){
	var apis = $apis.getApis();
	apis.ifSuccess(function(data){

		if(data.length!==0){
			vm.estimatebtnName="Update";
		}
		else{
			vm.estimatebtnName="Save";
		}
		console.log(data.Body);
		console.log(data.Title);

		vm.subject7=data.Title;

		if(data.length!==0){

			var str=data.Body.toString();
			console.log(str);
			var arr = {
				"<html>": "",
				"</html>": "",
				"<br>": "\n"
			}

			var re = new RegExp(Object.keys(arr).join("|"),"gi");
			str = str.replace(re, function(matched){
				return arr[matched];
			});
			console.log(str);
			vm.estimateemailContent=str;
			console.log(vm.estimateemailContent);
		}
		else{
			vm.estimatebtnName="Save";
		}
	});
	apis.ifError(function(data){
		console.log(data)
		vm.estimatebtnName="Save";
		var toast = $mdToast.simple().content('there was a error, when estimate email loading').action('OK').highlightAction(false).position("bottom right");
		$mdToast.show(toast).then(function() {});
	});
	apis.getTemplate('getTemplate','T_EMAIL_EST_NEWMAIL');
}
emailEstimateTemplate();

vm.estimateSubmit=estimateSubmit;

function estimateSubmit(){

	var apis = $apis.getApis();
	apis.ifSuccess(function(data){
		if(data.length!==0){
			vm.uEmailTemplateMeata={};
			vm.uEmailTemplateMeata.TemplateID="T_EMAIL_EST_NEWMAIL";
			vm.uEmailTemplateMeata.description="Estimate param";
			vm.uEmailTemplateMeata.param="[@@no@@,@@companyName@@,@@accounturl@@,@@customer@@]" ;

			var apis = $apis.getApis();
			apis.ifSuccess(function(data){

			});
			apis.ifError(function(data){
				var toast = $mdToast.simple().content('there was a error, when estimate saving').action('OK').highlightAction(false).position("bottom right");
				$mdToast.show(toast).then(function() {});
			});
			apis.sendTemplate('updateTemplateMeta',vm.uEmailTemplateMeata);

			console.log(vm.estimateemailContent);

			vm.emailContent1=vm.estimateemailContent.replace(/(\r\n|\n|\r)/gm,"<br>");
			console.log(vm.emailContent1);

			var str3 = "<html>"+vm.emailContent1+"</html>";
			console.log(str3);

				//set template data
				vm.UemailTemplate={};
				vm.UemailTemplate.TemplateID="T_EMAIL_EST_NEWMAIL",
				vm.UemailTemplate.Title=vm.subject7,
				vm.UemailTemplate.Owner="12thdoor",
				vm.UemailTemplate.Body=str3;

				var apis = $apis.getApis();
				apis.ifSuccess(function(data){
					var toast = $mdToast.simple().content('Successfully estimate email updated').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
					vm.estimatebtnName="Update";
				});
				apis.ifError(function(data){
					var toast = $mdToast.simple().content('there was a error, when estimate saving').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
				});
				apis.sendTemplate('updateTemplate',vm.UemailTemplate);
			}

			else
			{

				vm.emailTemplateMeata={};
				vm.emailTemplateMeata.TemplateID="T_EMAIL_EST_NEWMAIL";
				vm.emailTemplateMeata.description="Estimate param";
				vm.emailTemplateMeata.param="[@@no@@,@@companyName@@,@@accounturl@@,@@customer@@]" ;

				var apis = $apis.getApis();
				apis.ifSuccess(function(data){

				});
				apis.ifError(function(data){
					var toast = $mdToast.simple().content('there was a error, when estimate saving').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
				});
				apis.sendTemplate('setTemplateMeta',vm.emailTemplateMeata);

				console.log(vm.estimateemailContent);
				
				vm.emailContent1=vm.estimateemailContent.replace(/(\r\n|\n|\r)/gm,"<br>");
				console.log(vm.emailContent1);

				var str3 = "<html>"+vm.emailContent1+"</html>";
				console.log(str3);

				//set template data
				vm.emailTemplate={};
				vm.emailTemplate.TemplateID="T_EMAIL_EST_NEWMAIL",
				vm.emailTemplate.Title=vm.subject7,
				vm.emailTemplate.Owner="12thdoor",
				vm.emailTemplate.Body=str3;

				var apis = $apis.getApis();
				apis.ifSuccess(function(data){
					var toast = $mdToast.simple().content('Successfully estimate email saved').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
					vm.estimatebtnName="Update";
				});
				apis.ifError(function(data){
					var toast = $mdToast.simple().content('there was a error, when estimate email updating').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
				});
				apis.sendTemplate('setTemplate',vm.emailTemplate);
			}


		});
	apis.ifError(function(data){
		var toast = $mdToast.simple().content('there was a error').action('OK').highlightAction(false).position("bottom right");
		$mdToast.show(toast).then(function() {});
	});

	apis.getTemplate('getTemplate','T_EMAIL_EST_NEWMAIL');
}
//END OF  ESTIMATE EMAIL TEMPLATE...............................................................    
    
//START OF CREDIT NOTE EMAIL TEMPLATE..........................................................
function emailCreditNoteTemplate(){
	var apis = $apis.getApis();
	apis.ifSuccess(function(data){

		if(data.length!==0){
			vm.creditNotebtnName="Update";
		}
		else{
			vm.creditNotebtnName="Save";
		}
		console.log(data.Body);
		console.log(data.Title);

		vm.subject8=data.Title;

		if(data.length!==0){

			var str=data.Body.toString();
			console.log(str);
			var arr = {
				"<html>": "",
				"</html>": "",
				"<br>": "\n"
			}

			var re = new RegExp(Object.keys(arr).join("|"),"gi");
			str = str.replace(re, function(matched){
				return arr[matched];
			});
			console.log(str);
			vm.creditNoteemailContent=str;
			console.log(vm.creditNoteemailContent);
		}
		else{
			vm.creditNotebtnName="Save";
		}
	});
	apis.ifError(function(data){
		console.log(data)
		vm.creditNotebtnName="Save";
		var toast = $mdToast.simple().content('there was a error, when credit note email loading').action('OK').highlightAction(false).position("bottom right");
		$mdToast.show(toast).then(function() {});
	});
	apis.getTemplate('getTemplate','T_EMAIL_CRN_NEWMAIL');
}
emailCreditNoteTemplate();

vm.creditNoteSubmit=creditNoteSubmit;

function creditNoteSubmit(){

	var apis = $apis.getApis();
	apis.ifSuccess(function(data){
		if(data.length!==0){
			vm.uEmailTemplateMeata={};
			vm.uEmailTemplateMeata.TemplateID="T_EMAIL_CRN_NEWMAIL";
			vm.uEmailTemplateMeata.description="Credit Note param";
			vm.uEmailTemplateMeata.param="[@@no@@,@@companyName@@,@@accounturl@@,@@customer@@]" ;

			var apis = $apis.getApis();
			apis.ifSuccess(function(data){

			});
			apis.ifError(function(data){
				var toast = $mdToast.simple().content('there was a error, when credit note saving').action('OK').highlightAction(false).position("bottom right");
				$mdToast.show(toast).then(function() {});
			});
			apis.sendTemplate('updateTemplateMeta',vm.uEmailTemplateMeata);

			console.log(vm.creditNoteemailContent);

			vm.emailContent1=vm.creditNoteemailContent.replace(/(\r\n|\n|\r)/gm,"<br>");
			console.log(vm.emailContent1);

			var str3 = "<html>"+vm.emailContent1+"</html>";
			console.log(str3);

				//set template data
				vm.UemailTemplate={};
				vm.UemailTemplate.TemplateID="T_EMAIL_CRN_NEWMAIL",
				vm.UemailTemplate.Title=vm.subject8,
				vm.UemailTemplate.Owner="12thdoor",
				vm.UemailTemplate.Body=str3;

				var apis = $apis.getApis();
				apis.ifSuccess(function(data){
					var toast = $mdToast.simple().content('Successfully credit note email updated').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
					vm.creditNotebtnName="Update";
				});
				apis.ifError(function(data){
					var toast = $mdToast.simple().content('there was a error, when credit note saving').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
				});
				apis.sendTemplate('updateTemplate',vm.UemailTemplate);
			}

			else
			{

				vm.emailTemplateMeata={};
				vm.emailTemplateMeata.TemplateID="T_EMAIL_CRN_NEWMAIL";
				vm.emailTemplateMeata.description="Credit Note param";
				vm.emailTemplateMeata.param="[@@no@@,@@companyName@@,@@accounturl@@,@@customer@@]" ;

				var apis = $apis.getApis();
				apis.ifSuccess(function(data){

				});
				apis.ifError(function(data){
					var toast = $mdToast.simple().content('there was a error, when credit note saving').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
				});
				apis.sendTemplate('setTemplateMeta',vm.emailTemplateMeata);

				console.log(vm.creditNoteemailContent);
				
				vm.emailContent1=vm.creditNoteemailContent.replace(/(\r\n|\n|\r)/gm,"<br>");
				console.log(vm.emailContent1);

				var str3 = "<html>"+vm.emailContent1+"</html>";
				console.log(str3);

				//set template data
				vm.emailTemplate={};
				vm.emailTemplate.TemplateID="T_EMAIL_CRN_NEWMAIL",
				vm.emailTemplate.Title=vm.subject8,
				vm.emailTemplate.Owner="12thdoor",
				vm.emailTemplate.Body=str3;

				var apis = $apis.getApis();
				apis.ifSuccess(function(data){
					var toast = $mdToast.simple().content('Successfully credit note email saved').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
					vm.creditNotebtnName="Update";
				});
				apis.ifError(function(data){
					var toast = $mdToast.simple().content('there was a error, when credit note email updating').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
				});
				apis.sendTemplate('setTemplate',vm.emailTemplate);
			}


		});
	apis.ifError(function(data){
		var toast = $mdToast.simple().content('there was a error').action('OK').highlightAction(false).position("bottom right");
		$mdToast.show(toast).then(function() {});
	});

	apis.getTemplate('getTemplate','T_EMAIL_CRN_NEWMAIL');
}
//END OF CREDIT NOTE EMAIL TEMPLATE...............................................................
    
//START OF RECURRING INVOICE EMAIL TEMPLATE....................................................................................
function emailRecurringProfileTemplate(){
	var apis = $apis.getApis();
	apis.ifSuccess(function(data){

		if(data.length!==0){
			vm.recurringProfilebtnName="Update";
		}
		else{
			vm.recurringProfilebtnName="Save";
		}
		console.log(data.Body);
		console.log(data.Title);

		vm.subject9=data.Title;

		if(data.length!==0){

			var str=data.Body.toString();
			console.log(str);
			var arr = {
				"<html>": "",
				"</html>": "",
				"<br>": "\n"
			}

			var re = new RegExp(Object.keys(arr).join("|"),"gi");
			str = str.replace(re, function(matched){
				return arr[matched];
			});
			console.log(str);
			vm.recurringProfileemailContent=str;
			console.log(vm.recurringProfileemailContent);
		}
		else{
			vm.recurringProfilebtnName="Save";
		}
	});
	apis.ifError(function(data){
		console.log(data)
		vm.recurringProfilebtnName="Save";
		var toast = $mdToast.simple().content('there was a error, when recuring profile email loading').action('OK').highlightAction(false).position("bottom right");
		$mdToast.show(toast).then(function() {});
	});
	apis.getTemplate('getTemplate','T_EMAIL_REC_NEWMAIL');
}
emailRecurringProfileTemplate();

vm.recurringProfileSubmit=recurringProfileSubmit;

function recurringProfileSubmit(){

	var apis = $apis.getApis();
	apis.ifSuccess(function(data){
		if(data.length!==0){
			vm.uEmailTemplateMeata={};
			vm.uEmailTemplateMeata.TemplateID="T_EMAIL_REC_NEWMAIL";
			vm.uEmailTemplateMeata.description="Recurring Profile param";
			vm.uEmailTemplateMeata.param="[@@no@@,@@companyName@@,@@accounturl@@,@@customer@@]" ;

			var apis = $apis.getApis();
			apis.ifSuccess(function(data){

			});
			apis.ifError(function(data){
				var toast = $mdToast.simple().content('there was a error, when recurring profile saving').action('OK').highlightAction(false).position("bottom right");
				$mdToast.show(toast).then(function() {});
			});
			apis.sendTemplate('updateTemplateMeta',vm.uEmailTemplateMeata);

			console.log(vm.recurringProfileemailContent);

			vm.emailContent1=vm.recurringProfileemailContent.replace(/(\r\n|\n|\r)/gm,"<br>");
			console.log(vm.emailContent1);

			var str3 = "<html>"+vm.emailContent1+"</html>";
			console.log(str3);

				//set template data
				vm.UemailTemplate={};
				vm.UemailTemplate.TemplateID="T_EMAIL_REC_NEWMAIL",
				vm.UemailTemplate.Title=vm.subject9,
				vm.UemailTemplate.Owner="12thdoor",
				vm.UemailTemplate.Body=str3;

				var apis = $apis.getApis();
				apis.ifSuccess(function(data){
					var toast = $mdToast.simple().content('Successfully recurring profile email updated').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
					vm.recurringProfilebtnName="Update";
				});
				apis.ifError(function(data){
					var toast = $mdToast.simple().content('there was a error, when recurring profile saving').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
				});
				apis.sendTemplate('updateTemplate',vm.UemailTemplate);
			}

			else
			{

				vm.emailTemplateMeata={};
				vm.emailTemplateMeata.TemplateID="T_EMAIL_REC_NEWMAIL";
				vm.emailTemplateMeata.description="Recurring Profile param";
				vm.emailTemplateMeata.param="[@@no@@,@@companyName@@,@@accounturl@@,@@customer@@]" ;

				var apis = $apis.getApis();
				apis.ifSuccess(function(data){

				});
				apis.ifError(function(data){
					var toast = $mdToast.simple().content('there was a error, when recurring profile saving').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
				});
				apis.sendTemplate('setTemplateMeta',vm.emailTemplateMeata);

				console.log(vm.recurringProfileemailContent);
				
				vm.emailContent1=vm.recurringProfileemailContent.replace(/(\r\n|\n|\r)/gm,"<br>");
				console.log(vm.emailContent1);

				var str3 = "<html>"+vm.emailContent1+"</html>";
				console.log(str3);

				//set template data
				vm.emailTemplate={};
				vm.emailTemplate.TemplateID="T_EMAIL_REC_NEWMAIL",
				vm.emailTemplate.Title=vm.subject9,
				vm.emailTemplate.Owner="12thdoor",
				vm.emailTemplate.Body=str3;

				var apis = $apis.getApis();
				apis.ifSuccess(function(data){
					var toast = $mdToast.simple().content('Successfully recuring profile email saved').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
					vm.recurringProfilebtnName="Update";
				});
				apis.ifError(function(data){
					var toast = $mdToast.simple().content('there was a error, when recurring profile email updating').action('OK').highlightAction(false).position("bottom right");
					$mdToast.show(toast).then(function() {});
				});
				apis.sendTemplate('setTemplate',vm.emailTemplate);
			}


		});
	apis.ifError(function(data){
		var toast = $mdToast.simple().content('there was a error').action('OK').highlightAction(false).position("bottom right");
		$mdToast.show(toast).then(function() {});
	});

	apis.getTemplate('getTemplate','T_EMAIL_REC_NEWMAIL');
}
//END OF RECURRING INVOICE EMAIL TEMPLATE...............................................................    
    

}
})();