import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";

const serviceAccount = require("../../serviceAccount.json");

export function initFirebase() {
  try {
    initializeApp({
      credential: credential.cert(serviceAccount),
    });
  } catch (error) {
    console.log(error);
  }
}
