(function() {

  //Initialize firebase
    const config = {
        apiKey: "AIzaSyBTwjq3Vh6FDQwFhCqV7zFZpjOxpIOvQAY",
        authDomain: "green-leaf-b00681947.firebaseapp.com",
        databaseURL: "https://green-leaf-b00681947.firebaseio.com",
        storageBucket: "green-leaf-b00681947.appspot.com",
    };
    firebase.initializeApp(config);

    // Get Elements
    const txtEmail = document.getElementById('txtEmail');
    const txtPassword = document.getElementById('txtPassword');
    const btnLogin = document.getElementById('btnLogin');
    const btnLogout = document.getElementById('btnLogout');

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
    });

    // Add a realtime listener
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser) {
            console.log(firebaseUser);
            btnLogout.classList.remove('hide');
            window.location.href = "index.html";
        } else {
            console.log('not logged in');
            btnLogout.classList.add('hide');
        }
    });

    
}());