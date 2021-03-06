// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  dropperAddress:"0xC6c2e5a86569B8107Be86AFe9D3fAD01d895c488",
  dropperAddressMainnet:"0x7f12D6e6c2E3b608A01e4dEf372921da2B3C471B",
  contractFactory:"0xab6572f241af091084ba254dad4eac91a82def40",
  contractFactoryMainnet:"",
  testToken:"0x75d0462e6ebd792d2873d4d3c0710df326d4ba17",
  firebase: {
    apiKey: "AIzaSyCcgNyNC21ICe66zh8PjozBHU0cbcNwpyA",
    authDomain: "ethtoolkit.firebaseapp.com",
    databaseURL: "https://ethtoolkit.firebaseio.com",
    projectId: "ethtoolkit",
    storageBucket: "ethtoolkit.appspot.com",
    messagingSenderId: "551656511388"
  }
};


/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
