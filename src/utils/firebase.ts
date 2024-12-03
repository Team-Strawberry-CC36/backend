import * as firebaseAdmin from "firebase-admin";

const firebaseSettings = process.env.FIREBASE_JSON_KEY;

if (firebaseAdmin === undefined) {
  throw "firebaseJsonPath must be in ENV";
}

const settings = JSON.parse(firebaseSettings as string);

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(settings),
});

export default firebaseAdmin;
