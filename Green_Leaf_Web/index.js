(function() {

    //Initialize firebase
    const config = {
        apiKey: "AIzaSyBTwjq3Vh6FDQwFhCqV7zFZpjOxpIOvQAY",
        authDomain: "green-leaf-b00681947.firebaseapp.com",
        databaseURL: "https://green-leaf-b00681947.firebaseio.com",
        storageBucket: "green-leaf-b00681947.appspot.com",
    };
    firebase.initializeApp(config);

    // Get elements
    const preObject = document.getElementById('object');
    var chartHeading = document.getElementById('weekHeading');

    var database = firebase.database();

    // Stats Ref
    var statsRef = database.ref("Stats");
    // Config Ref
    var configRef = database.ref('Configuration/current_week_index');
    var weekRef = database.ref('Configuration/current_week');

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