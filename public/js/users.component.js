/* This component requires the following html
    <script src="https://www.gstatic.com/firebasejs/8.4.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.4.1/firebase-analytics.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.4.1/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.4.1/firebase-firestore.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.4.3/firebase-functions.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
    <script src="js/index.js"></script>
    <script src="js/auth.helpers.js"></script>
    <script src="js/users.component.js"></script>
*/

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    firebase.firestore().collection('users').get().then((doc) => {
      doc.forEach((doc) => {
        if (doc.data()['email'] == user.email) {
          // Load profile
          const details = doc.data();
          // console.log(details);
          
          // Set elements
          document.querySelector('#user-title').innerHTML = details.name;
          document.querySelector('#user-name').value = details.name;
          document.querySelector('#user-email').value = details.email;
          document.querySelector('#user-dob').value = details.dob;
          document.querySelector('#user-loc').value = details.location;
          document.querySelector('#user-bio').value = details.biography;
          document.querySelector('#user-exp').value = details.experience;
          document.querySelector('#user-skills').value = details.skills;

          // undefined Checks
          if (document.querySelector('#user-title').innerHTML == 'undefined') {
            document.querySelector('#user-title').innerHTML = details.email;
          }
          if (document.querySelector('#user-name').value == 'undefined') {
            document.querySelector('#user-name').value = "";
          }
          if (document.querySelector('#user-dob').value == 'undefined') {
            document.querySelector('#user-dob').value = "";
          }
          if (document.querySelector('#user-loc').value == 'undefined') {
            document.querySelector('#user-loc').value = "";
          }
          if (document.querySelector('#user-bio').value == 'undefined') {
            document.querySelector('#user-bio').value = "";
          }
          if (document.querySelector('#user-exp').value == 'undefined') {
            document.querySelector('#user-exp').value = "";
          }
          if (document.querySelector('#user-skills').value == 'undefined') {
            document.querySelector('#user-skills').value = "";
          }

        // Hide/Show elements
        document.querySelector('.progress').style.display = "none"; // Hide loading bar
        document.querySelector('.card').style.display = "block"; // Show profile

        // updateUserProfile form
        const updateUserProfile = document.querySelector('#update-user-profile');
        updateUserProfile.addEventListener('submit', (e) => {
          e.preventDefault();
          firebase.firestore().collection('users').doc(doc.id).update({
            // Update Details
            name: document.querySelector('#user-name').value,
            email: document.querySelector('#user-email').value,
            dob: document.querySelector('#user-dob').value,
            location: document.querySelector('#user-loc').value,
            biography: document.querySelector('#user-bio').value,
            experience: document.querySelector('#user-exp').value,
            //skills: document.querySelector('#user-skills').value,
          }).then(() => {
            location.reload(); // Reload Page
          }).catch(err => { console.log(err.message) });
        });
        }
      })
    }, err => { 
      console.log("ERROR\n" + err.message);
    })
  } else {
    location.replace("/");
  }
})
