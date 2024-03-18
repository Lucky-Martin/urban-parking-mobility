// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyD5EXUrF9LPCleSpUmMnHbk2cxsvhGp1YI",
    authDomain: "parking-mobility.firebaseapp.com",
    projectId: "parking-mobility",
    storageBucket: "parking-mobility.appspot.com",
    messagingSenderId: "982984420131",
    appId: "1:982984420131:web:635222392275684f68fa96",
    measurementId: "G-VT8DZ48GDH"
  },
  API_URL: 'http://localhost:8000/api/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
