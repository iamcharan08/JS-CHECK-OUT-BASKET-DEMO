$(document).ready(function(){

  //function that handles both add and remove item click
  $(".addRemove div").click(function() {

      var selectedObj = $(this);  
      var selectedOption = selectedObj.attr("class");
      var quantityObj = selectedObj.parent().siblings(".quantity").find("input");
      var itemQuantity = quantityObj.val();
      
      if(isNumeric(itemQuantity)){
      
        //check whether the add or delete element is being selected
        if(selectedOption === "add"){

          //define error message if the user select more than 10 items
          var errorMessageClickEventAdd = "Sorry, it is not possible to select more than 10 items";

          //check if the quantity selected is between both 1(included) and 9(included) 
          if(itemQuantity >= 1 && itemQuantity <= 9){ 
            //update input box quantity
            quantityObj.val(++itemQuantity);
            //do calculations
            updateAddRemoveItemCost(itemQuantity,selectedObj); 
          }
          else{  
             //mark the input border as red to signal the error     
             quantityObj.css("border-color","#F33333");
             validationMessage(errorMessageClickEventAdd);
          }
        }
        else{ //delete selected

          //mark the input border as red to signal the error   
          quantityObj.css("border-color","#F33333");

          //define error message if the user select less than 1 item
          var errorMessageClickEventRemove = "Sorry, it is not possible to select less than 1 item";
 
          //check if the quantity selected is between both 1 and 10(included) 
          if(itemQuantity > 1 && itemQuantity <= 10){  

            //update input box quantity
            quantityObj.val(--itemQuantity);
            //do calculations
            updateAddRemoveItemCost(itemQuantity,selectedObj); 
          }
          else{
            validationMessage(errorMessageClickEventRemove);
          }
        }
      }
      return false;
  });

  //this shows customise error messages
  function validationMessage(errorMessageType){
     $("#validationBox").html("<span>" + errorMessageType + "</span>").fadeIn(200);
  }

  //check if the value inserted is a valid number
  function isNumeric(itemQuantity)
  {
    //define regular expression to check if the value inserted is a valid number
    var regexp = /^[0-9]{1,10}$/;
    
    //define error message for when the user inserts an invalid value
    var errorMessage = "Please insert a valid numeric value between 1 and 10";
        
    if(!regexp.test(itemQuantity))
    {
      validationMessage(errorMessage);
      return false;
    }
    return true;
  }


  function updateAddRemoveItemCost(itemQuantity, selectedObj){

    var elementFinder = selectedObj.parent();
    var costObj = elementFinder.siblings(".cost"); 
    var priceObj = elementFinder.siblings(".price"); 
    var subTotal = $(".subTotal").find(".cost");  

    //hide error message in case has been visualised
    $("#validationBox").fadeOut(200);
    $("td.quantity input").css("border-color","#999999").fadeIn(200);

    //get single item price and calculate the new cost according to the quantity chosen
    var getSinglePrice = parseFloat(priceObj.html().substring(1) ,10);
    var multiplyQtyPrice = itemQuantity * getSinglePrice;

    //strip out the £ symbol and make calculation
    var itemCost = parseFloat(costObj.html().substring(1) ,10);

    //calculates the single item cost
    var updateSingleCost = (multiplyQtyPrice).toFixed(2);

    //add £ symbol and show updated cost
    costObj.html("£" + updateSingleCost);

    //convert and update sub total
    var subTotalTemp = (parseFloat(subTotal.html().substring(1),10) + multiplyQtyPrice) - itemCost;
    subTotalTemp = parseFloat(subTotalTemp.toFixed(2),10);
    subTotal.html("£" + subTotalTemp);

    //calculates and update the vat according to the new sub total
    var subTotalVat =  (subTotalTemp.toFixed(2) * 20) / 100;
    var updateVat =  $(".vat").find(".cost").html("£" + subTotalVat.toFixed(2));

    //update total cost
    var newTotalCostUpdate = subTotalVat + subTotalTemp ;
    $(".totalCost").find(".cost").html("£" + newTotalCostUpdate.toFixed(2));

  }


  //function that handles the bin/delete button
  function updateTotalRowDeleted(rowSelected){

     //get the sub total cost
     var subTotalObj = $(".subTotal").find(".cost");

     //get the row selected
     var rowTobeRemoved = rowSelected.closest('tr');

     //get the row cost to be removed from the total
     var getRowCost = rowTobeRemoved.find(".cost").html().substring(1);

     //get sub total value
     var getSubTotal = subTotalObj.html().substring(1);

     //calculates new sub total value
     var newSubTotal = (getSubTotal - getRowCost).toFixed(2);
     subTotalObj.html("£" + newSubTotal);

     //calculates new VAT
     var subTotalVat = ((newSubTotal * 20) / 100).toFixed(2);   
     var updateVat = $(".vat").find(".cost").html("£" + subTotalVat);

     //calculates the new total cost
     var newTotalCost = (parseFloat(newSubTotal,10) + parseFloat(subTotalVat,10)).toFixed(2); 
     $(".totalCost").find(".cost").html("£" + newTotalCost);

     //fade out while removing
     rowTobeRemoved.fadeOut(400, function(){
        rowTobeRemoved.remove();
     });
  }

  //function that handles the bin/delete button
  $(".deleteIcon .remove").click(function() {

    var rowSelected = $(this);

    //remove from the dom row selected
    updateTotalRowDeleted(rowSelected);  

    //disable "buy now" button if there are no items shwon anymore
    if($(this).closest("tbody").find("tr.item").length === 1 ) {

      var noItemsPresentMessage = "All items have been removed. Checkout not available anymore."
      //disable buy now button and show disable button
      $(".buyNowButton").attr({src:'./images/cta_buynow_disable.jpg'}).prop("disabled", true);
     
      validationMessage(noItemsPresentMessage);
          
    }
    return false;
  });


  //this handles the enter key down event when the user inserts manually quantity
  $(".quantity input").on("keydown",function search(e) {
      
      //if the enter key is pressed and a valid numeric number is inserted
      if(e.keyCode == 13) {
        
        //get selected obj - what input field selected
        var selectedInputField = $(this); 

        //get item quantity inserted
        var itemQuantity = selectedInputField.val();

        //define error message for when the user inserts an invalid value
        var errorMessageKeyInsertion = "Please insert a valid numeric value between 1 and 10";
        
        //check if the value inserted is valid and between 1 and 10
        if(isNumeric(itemQuantity)){
           if(itemQuantity >= 1 && itemQuantity <= 10){ 
            //do calculations
            updateAddRemoveItemCost(itemQuantity,selectedInputField);
          }
          else{
             //mark the input border as red to signal the error     
             selectedInputField.css("border-color","#F33333");
             validationMessage(errorMessageKeyInsertion);
             return false;
          }
        }else{
          selectedInputField.css("border-color","#F33333");
        }
         return false;
      }

  });

  //this handles the form submit and simulates Ajax call to server
  $(".buyNowButton").click(function(event){

    //array to contain the data to be sent
    var formData = [];

    //var flag that signals whether or not the data inserted is valid
    var flagNotContinue = false;

    //create array which contains data items to be sent
    $(".itemsContainer tr.item").each(function(i,row){

      var row = $(row);
      var product = row.find(".product").html();
      var quantity = row.find(".quantity input").val();
      var cost = row.find(".cost").html();

      //if the data inserted is a number between 1 and 10(both included), then send data
      if(quantity >= 1 && quantity <= 10){

        //push data into formData array
        formData.push({
          'id': ++i,
          'product': product,
          'quantity':quantity,
          'cost':cost
        });

      }
      else{ //if data not valid then raise the error message
        
        //define error message for when the user inserts an invalid value
        var errorMessageKeyInsertion = "Please insert a valid numeric value between 1 and 10";

        //raise the error on screen
        row.find(".quantity input").css("border-color","#F33333");
        validationMessage(errorMessageKeyInsertion);

        //signal the error
        flagNotContinue = true;

        //exit the loop - don't need to continue
        return false;
      }

    });

    //if data inserted is valid then proceed and send data
    if(!flagNotContinue){

      //add totals to array of items
      formData.push({
          'sub_total': $(".subTotal").find(".cost").html(),
          'vat': $(".vat").find(".cost").html(),
          'total_cost':$(".totalCost").find(".cost").html()
        });

      //performs Ajax call
      $.ajax({
            url: '',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(formData),
            contentType : "application/json"
          })
            //using the done promise callback
            .done(function(data) {
                //show form data when success - in this case it will fail as no webservice available      
            })

            // using the fail promise callback to show server errors
            .fail(function(data) {
                // show any errors - in this case it gives a 404 error as the webservice(landing page) is not available
            })

            //using the always promise callback to show on complete regardless
            .always(function(data) {

              //since there's no webservice available I use the always promise to show results in "thank you" page
              //formData array contains the items and subTotals - the formData string in the URL is used as the key to access the array
              var url = "./pages/thankYouPage.html?formData=" + encodeURIComponent(JSON.stringify(formData));
              window.location.href = url;
            
            });
      }
      return false;
  });


});

