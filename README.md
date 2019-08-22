# Selfiemator

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Add Cloudinary & Firebase details
If you are cloning this repository, please create `environments/environment.prod.ts` (and `environments/environment.ts` for development) to add the right keys & details for the Cloudinary and Firebase integrations. This is how the structure should look like:

```typescript
export const environment = {
  production: true|false,
  cloudName: '',
  uploadPreset: '',
  firebase: {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
  }
};

```

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

[See this link for tutorial](https://blog.fullstacktraining.com/creating-a-realtime-pwa-using-angular-and-firebase-part-1/)

## Code only works for version 7 of angular