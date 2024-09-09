# floriade-expo-data

This is a bootstrap-vue project used to store data (crud) that will be used for third party Floriade apps.

## Project setup

For proper installation use node 16, not node 17 (28-11-2021)
Install Vue 2 not 3,

```
vue create floriade-expo-data
cd floriade-expo-data
vue add bootstrap-vue
npm install
```

maak root folder writable

```
sudo chmod -R 775 my-folder
```

installeer firebase indien nodig, log in bij Google en krijg een autorisatie code

```
sudo npm install -g firebase-tools
firebase login --no-localhost
firebase init hosting
firebase use floriade-expo
```

## Project deploy

Fix: "Error: Invalid project selection, please verify project floriade-expo exists and you have access."

Login with: floraiexpo@gmail.com

```
firebase login --reauth
```
fix warning divider using '/' in node sass

```
$ npm install -g sass-migrator
$ sass-migrator division **/*.scss
```

Om de deploy lokaal te bekijken installeer serve

```
npm install -g serve
# -s flag means serve it in Single-Page Application mode
serve -s dist
```

Deploy to e.g. 'acceptatie' channel: https://firebase.google.com/docs/hosting/test-preview-deploy

```
firebase hosting:channel:deploy [channel_id]
```

```
npm run build
firebase deploy --only hosting
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Asigning roles

idToken can be found when logging in

```
https://us-central1-floriade-expo.cloudfunctions.net/addAdminRole?email=x.debruine@gmail.com&idToken=[idToken]
```

## Functions

### Setup. See [Firebase functions](https://firebase.google.com/docs/functions/get-started), See [Examples functions](https://github.com/firebase/functions-samples)

```
npm install firebase-functions@latest firebase-admin@latest --save
sudo npm install -g firebase-tools
```

### Deploy.

deploy all functions or only specific functions

```
firebase deploy --only functions
firebase deploy --only functions:downloadCSV, functions:uploadCSV
```

## Emulators

### Initialize emulators

```
firebase init emulators
```

Start Firebase localhost emulators

```
firebase emulators:start
firebase emulators:start --import=./export/production-data-export/
```

### Om de eerste gebruiker, die eerst aangemaakt moet worden met registratie, "olivier.dejonge@gmail.com" admin te maken. De code moet uit de index.js functions file gehaald worden. Port is default 5001

```
http://localhost:[functions-port]/floriade-expo/us-central1/initAdmin_XwMwUpG9PEg1yKVx9tx4
```

Voor het testen van een emailverificatie-flow, print de emulator een URL naar de terminal waar
firebase emulators:start was uitgevoerd (In Terminal van VScode dus meestal). Dat ziet er zo uit:

```
To verify the email address odejongetest@outlook.com, follow this link:
http://localhost:9099/emulator/action?mode=verifyEmail&lang=en&oobCode=uCkB_iFMTSntRttP-aCIFitBU-BiCwwOa3MkAs-CCJI5h51_tzAUnC&apiKey=fake-api-key
```

## git

### To remove a file from the git cache index so doesn't keep on popping up even when it is on .gitignore

```
git rm --cached firestore-debug.log
```

### show all branches

```
git branch -l
```

### show status

```
git status
```

### switch back to master branch

```
git switch master
```

### merge a branche into the current branch

```
git merge [changed-branch-not-current-branch]
```

### delete a redundant branch

```
git branch -d [redundant branch]
```

## Problem solving

### Permission problems can be solved with

```
sudo chmod -R 775 my-folder
```

### Port taken

Als poort wordt ingenomen of nog open staat van een proces

```
sudo lsof -i :[PORT]
sudo kill -9 [PID]

olivierdejonge@Mac-mini-van-Olivier floriade-expo-data % sudo lsof -i :8090
Password:
COMMAND  PID           USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
java    4477 olivierdejonge   90u  IPv6 0xa34a7d01492194c1      0t0  TCP localhost:8090 (LISTEN)
olivierdejonge@Mac-mini-van-Olivier floriade-expo-data % sudo kill -9 4477
```

## Backup

### Go to 'Admin' and then tab 'Export'

click button [Download data] and copy paste json in .json file
To view in VScode in pretty format use:

```
alt-shift-F
```
