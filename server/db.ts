import * as admin from "firebase-admin";
require("dotenv").config();
import { serviceAccount } from "./key";

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount as any),
	databaseURL: "https://dwf-m6-ale-default-rtdb.firebaseio.com",
});

const baseDeDatos = admin.firestore();
const rtdb = admin.database();

export { baseDeDatos, rtdb };
