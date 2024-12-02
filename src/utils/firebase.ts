import * as firebaseAdmin from "firebase-admin";
import { readFileSync } from "fs";

const firebaseJsonPath = process.env.FIREBASE_JSON_PATH;

if (!firebaseJsonPath) {
  throw new Error(
    "FIREBASE_JSON_PATH is not defined in environment variables."
  );
}

const file = readFileSync(firebaseJsonPath, "utf-8");
const settings = JSON.parse(file);

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(settings),
});

export default firebaseAdmin;
