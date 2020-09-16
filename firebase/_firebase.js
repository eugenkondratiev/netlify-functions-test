const firebaseConfig = require('./connection-pefl-firebase');


// import * as firebase from 'firebase/app';
// import 'firebase/database';
// import 'firebase/auth'


const firebase = require('firebase');
// const app = firebase.initializeApp(firebaseConfig);

class Firebase {
  constructor() {
    firebase.initializeApp(firebaseConfig);
    this.db = firebase.database();
    this.auth = firebase.auth();
    this.userUid = null
    this.userInfo = null
  }

  signWithEmail = (email, password) => this.auth.signInWithEmailAndPassword(email, password);
  getUserWords = () => {
    console.log("!!!! --   getUserWords this", this, new Date().toUTCString())
    return this.db.ref(`/${this.userUid}`)
  };
  getAllData = () => {
    console.log('getAllData   ..... ')
    return this.db.ref('/')
  };

  setUserUid = (uid) => this.userUid = uid;
  setUserInfo = (user) => this.userInfo = user;

  shutdownConnection = ()=> {
    this.db.goOffline();
  }
}

module.exports = Firebase
  // export default Firebase
