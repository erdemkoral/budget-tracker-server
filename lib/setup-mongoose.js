const mongoose = require( 'mongoose' );

// we need a URI that points to our database
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost/expense-tracker'; 

mongoose.Promise = Promise;
mongoose.connect( dbURI ); 

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {  
    console.log( 'Mongoose default connection open to ' + dbURI );// eslint-disable-line
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
    console.log( 'Mongoose default connection error: ' + err );// eslint-disable-line
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
    console.log( 'Mongoose default connection disconnected' ); // eslint-disable-line
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
    mongoose.connection.close(function () { 
        console.log( 'Mongoose default connection disconnected through app termination' ); // eslint-disable-line
        process.exit(0); 
    }); 
});

module.exports = mongoose.connection;