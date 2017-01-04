(function(){
	angular
        .module('app.products')
        .controller('emailController', emailController);

    function emailController(proCode,$mdDialog,$serviceCall,$apis){
    	var vm = this,
            companyName;

        vm.productCode = proCode;

    	vm.cancel = cancel;

        vm.attachPdfCk = true;

        init();


    	function cancel(){
    		$mdDialog.hide();
    	}

        function init(){
            var client =  $serviceCall.setClient("getAllByQuery","product"); // method name and service
            client.ifSuccess(function(data){
                vm.productData = data.result;
                if (Array.isArray( vm.productData)) {
                    vm.pdfName = vm.productData[0].uploadBrochure[0].name
                }
            })
            client.ifError(function(data){
                
            })          
            client.postReq({
              'where' : "productCode = '"+vm.productCode+"' "
            });


            var settingClient =  $serviceCall.setClient("getAllByQuery","setting"); // method name and service
            settingClient.ifSuccess(function(data){
                 vm.profileData = data[0].profile;
                 companyName = vm.profileData.companyName;
                 updateBody()
                 
            })
            settingClient.ifError(function(data){

            })          
            settingClient.postReq({
                "setting" : "profile"
            });
        }

        var apis = $apis.getApis();
        apis.ifSuccess(function(data){
            console.log(data)
        });
        apis.ifError(function(data){

        });
        apis.getTemplate('getTemplate','T_EMAIL_PRO_NEWMAIL');

        vm.emailBody = "<html>Dear Customer, <br><br>Please find the attach brochure of the product<br><br>Thank You for your business! <br><br>@@companyName@@</html>";
         
        function updateBody(){
            vm.emailBody = vm.emailBody.replace('@@companyName@@',companyName);
        }
 
    }
})();