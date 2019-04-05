(function() {

    //Initialize firebase
    const config = {
        apiKey: "AIzaSyBTwjq3Vh6FDQwFhCqV7zFZpjOxpIOvQAY",
        authDomain: "green-leaf-b00681947.firebaseapp.com",
        databaseURL: "https://green-leaf-b00681947.firebaseio.com",
        storageBucket: "green-leaf-b00681947.appspot.com",
    };
    firebase.initializeApp(config);

    // DB Variable
    var database = firebase.database();

    // Get Elements
    const txtEmail = document.getElementById('txtEmail');
    const txtPassword = document.getElementById('txtPassword');
    const btnLogin = document.getElementById('btnLogin');
    const btnLogout = document.getElementById('btnLogout');
    const divAdmin = document.getElementById('admin_content');
    const dateSelector = document.getElementById('dateSelector');
    const dateIndex = document.getElementById('dateIndex');
    const btnConfirm = document.getElementById('btnConfirm');

    // Stats Ref
    var statsRef = database.ref("Stats");
    // Config Ref
    var updateConfigRef = database.ref('Configuration');
    var configRef = database.ref('Configuration/current_week_index');
    var weekRef = database.ref('Configuration/current_week');

    // Update Config
    btnConfirm.addEventListener('click', e => {
        // Get Date and Index
        const date = dateSelector.value;
        var dateText = date.toString();
        const index = dateIndex.value;

        // Update Configuration
        updateConfigRef.child("current_week").set(dateText);
        updateConfigRef.child("current_week_index").set(index);

        // Update Stats
        statsRef.child(index).once('value', function(snapshot) {
            if(snapshot.exists()) {
                alert('Field already exists')
            } else {
                statsRef.child(index).child("day_1_monday").set(0);
                statsRef.child(index).child("day_2_tuesday").set(0);
                statsRef.child(index).child("day_3_wednesday").set(0);
                statsRef.child(index).child("day_4_thursday").set(0);
                statsRef.child(index).child("day_5_friday").set(0);
                statsRef.child(index).child("start_date").set(dateText);
                alert('New field created');
            }
        });

    });

    // Add login event
    btnLogin.addEventListener('click', e => {
        // Get email and pass
        const email = txtEmail.value;
        const password = txtPassword.value;
        const auth = firebase.auth();
        // sign in
        const promise = auth.signInWithEmailAndPassword(email, password);
        promise.catch(e => console.log(e.message));
    });

    // Add logout event
    btnLogout.addEventListener('click', e => {
        firebase.auth().signOut();
        divAdmin.style="visibility: hidden"
    });

    //Add a realtime listener
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser) {
            console.log(firebaseUser);
            // window.location.href = "index.html";
            divAdmin.style="visibility: visible"
            btnLogin.style="visibility: hidden"
            btnLogout.style="visibility: visible"
        } else {
            console.log('not logged in');
            btnLogin.style="visibility: visible"
            btnLogout.style="visibility: hidden"
            // divAdmin.style="visibility: hidden"
        }
    });

    // Get elements
    const preObject = document.getElementById('object');
    var chartHeading = document.getElementById('weekHeading');

    weekRef.once("value").then(function(snapshot) {
        var currentWeek = snapshot.val();
        weekHeading.innerText = currentWeek;
    });
    // Obtainging Day Stats
    configRef.once("value").then(function(snapshot) {
        var index = snapshot.val();
        var monday, tuesday, wednesday, thursday, friday;

        console.log("value", index);
        statsRef.once("value").then(function(snapshot) {

            monday = snapshot.child(index).child("day_1_monday").val();
            tuesday = snapshot.child(index).child("day_2_tuesday").val();
            wednesday = snapshot.child(index).child("day_3_wednesday").val();
            thursday = snapshot.child(index).child("day_4_thursday").val();
            friday = snapshot.child(index).child("day_5_friday").val();

            console.log("text", monday);
            // Setting Chart
        var data = [{
                    x: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    y: [monday, tuesday, wednesday, thursday, friday],
                    marker:{
                    color: 'rgba(42,116,0, 0.8)'
                    },
                    type: 'bar'
                }];
                var layout = {
                    xaxis: {
                    title: 'Day of the Week'
                    },
                    yaxis: {
                    title: 'Number of Users Eating'
                    }
                }
                Plotly.newPlot('chart', data, layout, {}, {showSendToCloud:true});
        });
    });

}());