/* This helper requires the following html

    <h4>Login and signup</h4>
    <input  type="text" id="email" name="email" placeholder="Email"/>
    <input  type="password" id="password" name="password" placeholder="Password"/>
    <button disabled id="sign-in" name="signin">Sign In</button>
    <button  id="sign-up" name="signup">Sign Up</button>
    <label for="role">Choose a role:</label>
    <select name="role" id="role">
      <option value="employee">Employee</option>
      <option value="employer">Employer</option>
    </select> 
  </div>

  <script src="https://www.gstatic.com/firebasejs/8.4.1/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.4.1/firebase-analytics.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.4.1/firebase-auth.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.4.1/firebase-firestore.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
  <script src="js/index.js"></script>
  <script src="js/navbar.auth.helpers.js"></script>
*/

// Handles sign in and signout
function toggleSignIn() {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
    location.reload();
  } else {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }
    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }
    // Sign in with email and pass.
    firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
      location.reload();
    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } 
      else {
        alert(errorMessage);
      }
      console.log(error);
      document.getElementById('sign-in').disabled = false;
    });
  }
  document.getElementById('sign-in').disabled = true;
}

// Handles sign up
function handleSignUp(){
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var role = document.getElementById('role').value;
  //Input validation
  if (email.length < 4) {
    alert('Please enter an email address.');
    return;
  }
  if (password.length < 4) {
    alert('Please enter a password.');
    return;
  }
  if (role == "employee" || role == "employer") {

  } 
  else {
    alert('Please select a role from the drop down list');
    return;
  }
  // Create user with email and pass.
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function (firebaseUser) {
    // Create firestore entry for user
    firebase.firestore().collection('users').add({
      email: email,
      role: role
    }).then(function (){
      location.reload();
    });
  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode == 'auth/weak-password') {
      alert('The password is too weak.');
    } 
    else {
      alert(errorMessage);
    }
    console.log(error);
  });
}

// Sets up UI event listeners
function initApp() {
  // Listening for auth state changes.
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      document.getElementById('sign-in').textContent = 'Sign out';
    } 
    else {
      // User is signed out.
      document.getElementById('sign-in').textContent = 'Sign in';
    }
    document.getElementById('sign-in').disabled = false;
  });

  if (document.getElementById('sign-in') != null){
    document.getElementById('sign-in').addEventListener('click', toggleSignIn, false);
  }
  if (document.getElementById('sign-up') != null){
    document.getElementById('sign-up').addEventListener('click', handleSignUp, false);
  }
  if (document.getElementById('logout') != null){
    document.getElementById('logout').addEventListener('click', toggleSignIn, false);
  } 
}

window.onload = function () {
  initApp();
};