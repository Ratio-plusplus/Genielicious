//initialize firebase
firebase.initializeApp(firebaseConfig);

//reference database
var flavorProfileDB = firebase.database().ref('Flavor Profiles');

document.getElementById('profileSubmit').addEventListener('submit', submitForm);

function submitForm(e) {
    e.preventDefault();

    var username = getElementVal('uname');
    var flavorProfName = getElementVal('flavorName')
    // distance output
    var distance = [getElementVal('distance1'), getElementVal('distance2'), getElementVal('distance3')]

    //budget output
    var budget = [getElementVal('budget1'), getElementVal('budget2'), getElementVal('budget3')];

    //taste preference output
    var tastePref = [getElementVal('savory'), getElementVal('salty'), getElementVal('sweet'), getElementVal('spicy'), getElementVal('bitter'), getElementVal('sour'), getElementVal('cool'), getElementVal('hot')];

    //dietary restriction output
    var dietRestrict= [getElementVal('vegan'), getElementVal('nuts'), getElementVal('fish'), getElementVal('eggs'), getElementVal('vegetarian'), getElementVal('wheat'), getElementVal('shellfish'), getElementVal('soy'), getElementVal('keto')];

    console.log('form submitted!')
    saveProfiles(username, flavorProfName, distance, budget, tastePref, dietRestrict);
}

const saveProfiles = (username, flavorProfName, distance, budget, tastePref, dietRestrict) => {
    //pushes form information to db
    var newContactForm = flavorProfileDB.push();

    newContactForm.set({
        name: username,
        flavorProfileName: flavorProfName,
        distance: distance,
        budget: budget,
        tastePreference: tastePref,
        dietRestrict: dietRestrict
    })
};

const getElementVal = (id) => {
    return document.getElementById(id).value;
}



