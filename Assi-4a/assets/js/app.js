$(document).on("pagecreate", "#home-page, #about-page, #register-page", function () {
    var year = new Date().getFullYear();
    $("#year-home, #year-about, #year-register").text(year);
});

$(document).on("submit", "#newsletter-form", function (event) {
    event.preventDefault();

    var username = $.trim($("#username").val());
    var email = $.trim($("#email").val());
    var password = $.trim($("#password").val());

    if (!username || !email || !password) {
        alert("Please fill all required fields.");
        return;
    }

    $("#success-popup").popup("open");
    this.reset();
});
