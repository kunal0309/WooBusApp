/**
 * Created by pariskshitdutt on 17/10/15.
 */
$("#btnPinConfirm").click(function () {
    if (ValidateForm("txtPinNumber", "pin number") && minLength("txtPinNumber", 5, "Please enter valid pin number") && IsNumber("txtPinNumber", 5, "Please enter valid phone number")) {
        $(this).html("please wait...");
        confirmPin(localStorage.pin);
    }
});
$("#txtPinNumber").val(JSON.parse(localStorage.userData).pin);

function confirmPin(){
    $.ajax({
        type: 'POST',
        url: _apiBaseUrl + '/users/verifyPhonenumber',
        data: JSON.parse(localStorage.userData),
        contentType: 'application/x-www-form-urlencoded',
        dataType: "json",
        success: dataParserReg,
        error: ServiceError
    });
    function dataParserReg(data) {
        console.log(data);
        localStorage.token=data.token;
        localStorage.expiry=data.expiry;
        localStorage.secret=data.secret;
        $(location).attr('href','home.html');
        //$(location).attr('href','confirmForm.html');
    }
}