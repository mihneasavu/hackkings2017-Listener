/**
 * Created by aayushchadha on 26/11/17.
 */
var twilio = require('twilio');

var admin = require("firebase-admin");
var serviceAccount = require("./hckkings.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://hackkings2k17.firebaseio.com"
});



var db = admin.database();
var ref = db.ref("/");

// Request for riders
const riderRequestRef = ref.child("Request_for_rider");

// Request for drivers
const driverRequestRef = ref.child("Request_for_driver");

const riders = ref.child("riders");

const drivers = ref.child("drivers");

// The driver has requested for riders
riderRequestRef.orderByKey().limitToLast(1).on('child_added', function (riderRequest) {
    let driverData = riderRequest.val();
    riders.once("value")
       .then(function (snapShot) {
           snapShot.forEach(function (childSnapshot) {
               let riders = childSnapshot.val();
               let ridersMessage = "A driver is going from " + driverData.origin + " to " + driverData.destination +
                       ". Vehicle can accommodate " + driverData.vehicle_capacity + "people/s. " + "The driver can be reached on " +
                       driverData.phone_number + ". Please call the driver on this number to confirm other details."
               sendMessage(ridersMessage, riders.phone_number);
           })
       })
});

driverRequestRef.orderByKey().limitToLast(1).on('child_added', function (driverRequestBy) {
    let riderData = driverRequestBy.val();
    drivers.once("value")
        .then(function (snapShot) {
            console.log("Added request for driver");
            console.log("data", snapShot.val());
            snapShot.forEach(function (childSnapshot) {
                let drivers = childSnapshot.val();
                console.log(drivers.phone_number);
                let driversMessage = "A rider requests a ride from " + riderData.origin + " to " + riderData.destination +
                    ". Number of travellers are " + riderData.number_of_travellers  + ". The traveller/s can be reached on " +
                    riderData.Requested_by + ". Please call them on this number to confirm other details."
                sendMessage(driversMessage, drivers.phone_number);
            })
        })
});

const sendMessage = (text,recipient) => {

    let accountSid = 'ACf710fb920ebfe1e478f4e2a2531067d2';
    let authToken = '9f3175e2b5b8786c1e245bd1750fd513';

    //require the Twilio module and create a REST client
    let client = require('twilio')(accountSid, authToken);

    client.messages.create({
        to: recipient,
        from: "+441554260044",
        body: text,
    }, function(err, message) {
        if(err) {
            console.log(err.message);
        }
    });

}