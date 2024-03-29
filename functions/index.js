// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// localhost:5001/group-01-match-making-co-78d4c/us-central1/matchUsers
exports.matchUsers = functions.https.onCall( async (data, context) => {
    const listings = await admin.firestore().collection("listings").get().then((listingDoc) => {
        const res = listingDoc.forEach((listingDoc) => {
            const users =  admin.firestore().collection("users").get().then((userDoc) => {

                let list = []

                const res = userDoc.forEach((userDoc) => {
                    if (userDoc.data()['skills']){

                        skillWanted = listingDoc.data()['skills']
                        skillAquire = userDoc.data()['skills']
                        skillsMatch = []

                        for ( i in skillWanted ){
                            for ( j in skillAquire ){
                                if ( skillWanted[i] == skillAquire[j] ){
                                    skillsMatch.push(skillAquire[j])
                                }
                            }
                        }

                        var percentage = 0;
                        percentage = (skillsMatch.length / skillWanted.length) * 100;

                        if ( percentage >= 50 ) {
                            console.log("\t\t\t\t\t\tMatch: " + percentage);
                            list.push(userDoc.data()['email'])  
                        }
                    }
                })
                let docRef = admin.firestore().collection("listings").doc(listingDoc.id);
                docRef.update({
                    candidates: list
                })

            })
        })
    })
    //res.send("Job listings have been matched with appropriate candidates")
  });




/*
This can be called through the following example html

<script src="https://www.gstatic.com/firebasejs/8.4.3/firebase.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.4.3/firebase-functions.js"></script>

<script>
    var getJobCandidates = firebase.functions().httpsCallable('getJobCandidates');
    getJobCandidates({ id: "2" })
      .then((result) => {
        console.log(result.data);
      });
</script>
*/
exports.getJobCandidates = functions.https.onCall( async (data, context) => {
    let candidates;
    if ( data.id ){
        let candidatesRef = admin.firestore().collection('listings').doc(data.id);
        const doc = await candidatesRef.get();
        if (!doc.exists) {
            data = "No documents";
        }
        else {
            candidates = doc.data().candidates;
        }
        return candidates
    }
  });

  exports.getJobListing = functions.https.onCall( async (data, context) => {
    let listing;
    if ( data.id ){
        let listingRef = admin.firestore().collection('listings').doc(data.id);
        const doc = await listingRef.get();
        if (!doc.exists) {
            data = "No documents";
        }
        else {
            listing = doc.data();
        }
        return listing
    }
  });

// // localhost:5001/group-01-match-making-co-78d4c/us-central1/testData
// exports.testData = functions.https.onRequest(async (req, res) => {
//     // Test user 1
//     var docData = {
//         email: "test@test.com",
//         skills: ["Dancing", "Piano", "Vocals", "Charismatic"],
//     };
//     admin.firestore().collection("users").doc("1").set(docData).then(() => {
//         console.log("Document successfully written!");
//     });

//     // Test user 2
//     var docData = {
//         email: "test2@test2.com",
//         skills: ["Jumping", "Climbing", "Vaulting", "Hugging"],
//     };
//     admin.firestore().collection("users").doc("2").set(docData).then(() => {
//         console.log("Document successfully written!");
//     });

//     // Test user 3
//     var docData = {
//         email: "test3@test3.com",
//         skills: ["Javascript", "Angular", "NodeJs", "Deno"],
//     };
//     admin.firestore().collection("users").doc("3").set(docData).then(() => {
//         console.log("Document successfully written!");
//     });

//     // Test user 4
//     var docData = {
//         email: "test4@test4.com",
//         skills: ["Packing"],
//     };
//     admin.firestore().collection("users").doc("4").set(docData).then(() => {
//         console.log("Document successfully written!");
//     });

//     // Test listing 1
//     var docData = {
//         jobName: "Running friends",
//         skills: ["Running", "Climbing", "Vaulting"],
//         candidates: []
//     };
//     admin.firestore().collection("listings").doc("1").set(docData).then(() => {
//         console.log("Document successfully written!");
//     });

//     // Test listing 2
//     var docData = {
//         jobName: "A Very Active Programmer",
//         skills: ["Running", "Climbing", "Vaulting", "Javascript", "Angular", "NodeJs", "Deno"],
//         candidates: []
//     };
//     admin.firestore().collection("listings").doc("2").set(docData).then(() => {
//         console.log("Document successfully written!");
//     });

//     // Test listing 3
//     var docData = {
//         jobName: "Active Programmer - Meblourne Central Safeway",
//         skills: ["Running", "NodeJs", "Deno"],
//         candidates: []
//     };
//     admin.firestore().collection("listings").doc("3").set(docData).then(() => {
//         console.log("Document successfully written!");
//     });
    
//     // Test listing 4
//     var docData = {
//         jobName: "General Labour - Box Hill",
//         skills: ["RF Scanning", "Mathematics", "Hard Labour"],
//         candidates: []
//     };
//     admin.firestore().collection("listings").doc("4").set(docData).then(() => {
//         console.log("Document successfully written!");
//     });

//     // Test listing 5
//     var docData = {
//         jobName: "Packing",
//         skills: ["Packing"],
//         candidates: []
//     };
//     admin.firestore().collection("listings").doc("5").set(docData).then(() => {
//         console.log("Document successfully written!");
//     });
//     res.send("Test data added")
// })