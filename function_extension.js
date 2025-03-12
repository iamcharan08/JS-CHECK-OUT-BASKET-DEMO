$(document).ready(function(){

    var dataFormReceived = [];

    if (dataFormReceived.length == 0) {
        
         //this strips out the url ? and & and put the result in a var
        if (window.location.search.split('?').length > 1) {
            var params = window.location.search.split('?')[1].split('&');

            //this put the data received into an array which key is formData - the value is the string containing items and totals 
            for (var i = 0; i < params.length; i++) {
                var key = params[i].split('=')[0];
                var value = decodeURIComponent(params[i].split('=')[1]);          
                dataFormReceived[key] = value;                  
            }
        }
    }

    //converting the string data received into JSON
    var resultObj = $.parseJSON(dataFormReceived["formData"])
     
    if (dataFormReceived["formData"] != null) {

       var purchaseItemInfo, purchaseItemsTotals;
       var arrayLength =  resultObj.length -1;

       //loop through the JSON to get the items and subtotals
       $.each(resultObj, function( i, val ) { 

        if(arrayLength != i){ 

          //creating the html code containing the products purchased
          purchaseItemInfo = $('<tr class="row item">'+ '<td class="product">' 
          + val.product + '</td>' + 
          '<td class="quantity">' +  val.quantity + '</td>' + 
          '<td class="cost">' +  val.cost + '</td>' + '</tr>'); 

          //injecting the html code into the thankyou page
          purchaseItemInfo.appendTo($(".itemsSummaryContainer tbody") );
        }
        else{ //last object contains totals - has to be styled differently

          //creating the html code containing the subtotals 
          purchaseItemsTotals = $('<tr class="subTotal row summary"><td class="product">Subtotal</td>' +
          '<td class="quantity"></td><td class="cost">' +  val.sub_total + '</td></tr>' +     
          '<tr class="vat row summary"><td class="product">VAT @20%</td>'+
          '<td class="quantity"></td><td class="cost">' +  val.vat + '</td></tr>' +       
          '<tr class="totalCost row summary"><td class="product">Total Cost</td>' +
          '<td class="quantity"></td><td class="cost">' +  val.total_cost + '</td></tr>');

          //injecting the html code into the thankyou page
          purchaseItemsTotals.appendTo($(".itemsSummaryContainer tbody") );
        }
      });

    }
});

