function submitForm() {
  // Name validation
  var name = document.getElementById("name").value.trim();
  if (name === "") {
    alert("Name is required");
    return;
  }
  if (!/^[A-Za-z ]+$/.test(name)) {
    alert("Name must contain only letters");
    return;
  }

  // Phone validation
  var phone = document.getElementById("phone").value.trim();
  if (phone === "") {
    alert("Phone number is required");
    return;
  }
  if (!/^[0-9]{10}$/.test(phone)) {
    alert("Phone number must be exactly 10 digits");
    return;
  }

  // Address validation
  var address = document.getElementById("address").value.trim();
  if (address === "") {
    alert("Address is required");
    return;
  }

  // Gender validation
  var genderInput = document.querySelector('input[name="gender"]:checked');
  if (!genderInput) {
    alert("Please select gender");
    return;
  }
  var gender = genderInput.value;

  // City validation
  var city = document.getElementById("city").value;
  if (city === "") {
    alert("Please select a city");
    return;
  }

  // Email validation
  var email = document.getElementById("email").value.trim();
  if (email === "") {
    alert("Email is required");
    return;
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    alert("Enter a valid email address");
    return;
  }

  // Password validation
  var password = document.getElementById("password").value;
  if (password === "") {
    alert("Password is required");
    return;
  }
  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  // AJAX data
  var data =
    "name=" +
    encodeURIComponent(name) +
    "&phone=" +
    encodeURIComponent(phone) +
    "&address=" +
    encodeURIComponent(address) +
    "&gender=" +
    encodeURIComponent(gender) +
    "&city=" +
    encodeURIComponent(city) +
    "&email=" +
    encodeURIComponent(email);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "output.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onload = function () {
    var newWindow = window.open("", "_blank");
    newWindow.document.write(xhr.responseText);
  };

  xhr.send(data);
}
