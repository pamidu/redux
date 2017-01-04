(function ()
{
    'use strict';

    angular
        .module('app.invoices')
        .controller('emailCtrl', emailCtrl);

    /** @ngInject */
    function emailCtrl($scope, item, $http, $rootScope,$apis, $helpers, $sce, $cbsCall, InvoiceService,$auth, $serviceCall, MultipleDudtesService, $mdToast, $document, $mdDialog, $mdMedia, $state)
    {
    	var vm = this;
        vm.test = item;
        vm.cancel = cancel;
         var securityToken=$helpers.getCookie("securityToken");

        var scopeJson = {data : {Invoice:{allow:"r"}}};
        //getJWT();

          function getJWT(){
            $http({
               method: "GET",
               url :  $apis.getHost() + "/auth/GetSessionStatic/"+securityToken,
               headers : {"securityToken":securityToken, "scope": JSON.stringify(scopeJson)}
              }).success(function(data){
               
                vm.CustomerToken = data.Otherdata.JWT;
                console.log(vm.CustomerToken);
                getTinyUrl();
              },function(response){
                console.log(response)
              });
        }
vm.emailBody= "<html>Dear Customer, <br><br>Attached Invoice No.@@no@@. <br>To pay online or download click on the below link<br>@@accounturl@@<br><br>Thank You for your business! <br><br>@@companyName@@<\/html>"
        function getTinyUrl(){
            $http({
                method : "POST",
                url :   $apis.getHost() +"/tinyurl/create",
                headers : {"securityToken":securityToken},
                 data : {"URL":"http://"+window.location.hostname+"/12thDoorPaymentPortal/#/exploredocument?guInv="+ vm.test.invoiceGUID+"&securityToken="+securityToken +"&jwt="+vm.CustomerToken}
            }).then(function(response){
                
                vm.getUrl = response.data.TinyURL

                $http({
                    method : "GET",
                    url : "/apis/template/getTemplate/T_EMAIL_INV_NEWMAIL",
                    securityToken : {"securityToken" : securityToken}
                }).then(function(response){
                    console.log(response)
                    vm.tempID = response.data.TemplateID
                    vm.subject = response.data.Title;
                    vm.subject = vm.subject.replace("@@no@@",vm.test.invoiceNo );
                    vm.subject = vm.subject.replace("@@companyName@@",vm.emailCOmpanyName);

                    var str=response.data.Body.toString();
                           var arr = {
                            "<html>": "",
                            "</html>": "",
                            "<br>": "\n"
                           }

                    var re = new RegExp(Object.keys(arr).join("|"),"gi");
                    str = str.replace(re, function(matched){
                     return arr[matched];
                    });

                    vm.emailBody = str;
                    vm.emailBody = vm.emailBody.replace("@@no@@", vm.test.invoiceNo)
                    vm.emailBody = vm.emailBody.replace("@@accounturl@@", "<br><a href="+vm.getUrl+">"+vm.getUrl+"</a>")
                    vm.emailBody = vm.emailBody.replace("@@companyName@@", vm.emailCOmpanyName);
                    vm.emailBody = $sce.trustAsHtml(vm.emailBody);
                   // console.log(vm.emailContent);
                },function(response){

                })

            console.log(vm.getUrl)
            }, function(response){

            })
        }




        function cancel(){
            $mdDialog.hide();
        }

    vm.Emailerror = false;
    vm.emailrec = []; 
    vm.Sender = vm.test.email;

     vm.pdfChipArr = [];
     if($rootScope.pdfEnable == true){
       vm.pdfChipArr.push(vm.test.invoiceNo + ".pdf") 
     }
     
     vm.emailBCCrec = "divani@duosoftware.com";
     vm.pdfInvoNo = [vm.test.invoiceNo]


 
     var jsondata = {};

     function emailWithPdf() {
         jsondata.attachments = [{
             "filename": invo.invoiceNo + '.pdf',
             "path": "http://" + $helpers.getHost() + "/apis/media/tenant/invoicePdf/" + item.invoiceNo + '.pdf'
         }]
         sendEmailBody()
     }

     function sendEmailBody() {

         var client = $cbsCall.setClient('notification');
            client.ifSuccess(function(result){
            var data = result.data;
            $mdDialog.hide();
            var toast = $mdToast.simple()
            .content(data.message) 
            .highlightAction(false)
            .position("bottom right"); 
            $mdToast.show(toast).then(function () {
            });           
            })
            client.ifError(function(result){
            })
            client.singleMail(jsondata)
     }

     function toDataUrl(url, callback) {
         var xhr = new XMLHttpRequest();
         xhr.responseType = 'blob';
         xhr.onload = function() {
             var reader = new FileReader();
             reader.onloadend = function() {
                 callback(reader.result);
             }
             reader.readAsDataURL(xhr.response);
         };
         xhr.open('GET', url);
         xhr.send();
     }

     function hasNull(target) {
         for (var member in target) {
             if (target[member] == null)
                 target[member] = "";
         }
         return target;
     }

     vm.sendmail = sendmail;

          function sendmail () {
            console.log("dfsdf")
         jsondata = {
             "type": "email",
             "to":vm.Sender,
             "subject": vm.subject,
             "bcc": vm.emailBCCrec,
             "from": "Invoice <noreply-12thdoor@duoworld.com>",
             "Namespace": "kvzucejzeeubtestcompany.dev12thdoor.duoworld.com",
             "TemplateID": "T_EMAIL_INV_NEWMAIL",
             "DefaultParams": {
                 "@@no@@": item.invoiceNo.toString(),
                 "@@accounturl@@": " " + vm.geRemindertUrl,
                 "@@companyName@@": "vm.emailCOmpanyName"
             },
             "CustomParams": {
                 "@@no@@": "0001",
                 "@@accounturl@@": " " + vm.geRemindertUrl,
                 "@@companyName@@": "12thdoor"
             }
         }

         if (vm.pdfChipArr.length > 0) {
             emailPdf(item)
             setTimeout(function() {
                 var decodeUrl = vm.dataUrl;
                 var blobFile = dataURItoBlob(decodeUrl)
                 blobFile.name = item.invoiceNo + '.pdf'

                 var uploadUrl = $invoiceLocation.imagePath+ "/invoicePdf/"+ blobFile.name; 
                console.log(uploadUrl);

                fd =blobFile;

                $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': "multipart/form-data"}
                })
                .success(function(){
                  emailWithPdf()
                })
                .error(function(){
                  console.log("error")
                  var toast = $mdToast.simple()
                    .content('There was an error, please upload!')
                    .action('OK')
                    .highlightAction(false)
                    .position("bottom right");
                  $mdToast.show(toast).then(function () {
                    //whatever
                  });
                }); 
             }, 1000)
         } else
             sendEmailBody()
     }

     function dataURItoBlob(dataURI, callback) {
         // convert base64 to raw binary data held in a string
         // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
         var byteString = atob(dataURI.split(',')[1]);

         // separate out the mime component
         var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

         // write the bytes of the string to an ArrayBuffer
         var ab = new ArrayBuffer(byteString.length);
         var ia = new Uint8Array(ab);
         for (var i = 0; i < byteString.length; i++) {
             ia[i] = byteString.charCodeAt(i);
         }

         // write the ArrayBuffer to a blob, and you're done
         var bb = new Blob([ab]);
         return bb;
     }
        
    }
})();