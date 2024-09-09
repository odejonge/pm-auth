const functions = require("firebase-functions");
const {Storage} = require("@google-cloud/storage");
const gcs = new Storage();
const path = require("path");
const os = require("os");
const fs = require("fs-extra");
const firestore = require("@google-cloud/firestore");
const cors = require("cors")({origin: true});
const admin = require("firebase-admin");
admin.initializeApp();

/**
 * returns the published events
 */
exports.getEvents = functions.https.onRequest((request, response) => {
  return cors(request, response, () => {
    admin
        .firestore()
        .collection("data")
        .where("recordType_select", "==", "event")
        .get()
        .then((result) => {
          const d = {data: {}};
          d.data.events = [];
          result.forEach((record) => {
            const recordData = record.data();
            d.data.events.push(recordData);
          });
          response.json(d);
        });
  });
});

/**
 * returns the published stories
 */
exports.getLocations = functions.https.onRequest((request, response) => {
  return cors(request, response, () => {
    admin
        .firestore()
        .collection("data")
        .where("recordType_select", "==", "locatie")
        .get()
        .then((result) => {
          const d = {data: {}};
          d.data.locations = [];
          result.forEach((record) => {
            const recordData = record.data();
            d.data.locations.push(recordData);
          });
          response.json(d);
        });
  });
});

/**
 * returns the published stories
 */
exports.getStories = functions.https.onRequest((request, response) => {
  return cors(request, response, () => {
    admin
        .firestore()
        .collection("data")
        .where("recordType_select", "==", "story")
        .get()
        .then((result) => {
          const d = {data: {}};
          d.data.stories = [];
          result.forEach((record) => {
            const recordData = record.data();
            d.data.stories.push(recordData);
          });
          response.json(d);
        });
  });
});

/**
 * returns the select data
 */
exports.getSelectData = functions.https.onRequest((request, response) => {
  return cors(request, response, () => {
    admin
        .firestore()
        .collection("selectData")
        .get()
        .then((result) => {
          const d = {data: {}};
          d.data.selectData = [];
          result.forEach((record) => {
            const obj = {};
            obj[record.id] = record.data().array;
            d.data.selectData.push(obj);
          });
          response.json(d);
        });
  });
});

/**
 * initiates initial admin role for given hard coded email address
 */
exports.initAdmin_XwMwUpG9PEg1yKVx9tx4 = functions.https.onRequest(
    (request, response) => {
      return cors(request, response, () => {
        const enabled = true;
        const adminEmail = "olivier.dejonge@gmail.com";
        if (enabled) {
        // get user and add custom claim (admin)
          admin
              .auth()
              .getUserByEmail(adminEmail)
              .then((user) => {
                admin.auth().setCustomUserClaims(user.uid, {
                  rights: "admin,edit,view",
                  endpoints: "getEndPoints_zfPNiFGeoxPscMEVbZqF",
                });
              })
              .then(() => {
                response.status(200).send({
                  data: {
                    result: true,
                    message: "Success! The dude is been made admin",
                  },
                });
              })
              .catch((err) => {
                response.json({result: false, message: err.message});
              });
        } else {
          response.json({result: false, message: "Not enabled"});
        }
      });
    }
);

/**
 * adds the role "admin" or "edit" to the custom user claims
 */
exports.updateRoleUser_EWo7mNbcZ3IJ3IoMH4ix = functions.https.onRequest(
    (request, response) => {
      return cors(request, response, () => {
        isAdmin(request).then((result) => {
          if (result) {
            const email = request.query.email;
            const rights = request.query.rights;
            admin
                .auth()
                .getUserByEmail(email)
                .then((user) => {
                  const obj = user.customClaims ? user.customClaims : {};
                  obj.rights = rights;
                  if (rights.indexOf("admin") != -1) {
                    obj.endpoints = "getEndPoints_zfPNiFGeoxPscMEVbZqF";
                  } else {
                    delete obj.endpoints;
                  }
                  const uid = user.uid;
                  admin.auth().setCustomUserClaims(uid, obj);
                })
                .then(() => {
                  response.json({
                    data: {
                      result: true,
                      message: `Gebruiker ${email} has rights: "${rights}".`,
                    },
                  });
                })
                .catch((err) => {
                  response.json({result2: false, message: err.message});
                });
          } else {
            response.json({
              result3: false,
              message: "You're not allowed here.",
            });
          }
        });
      });
    }
);

/**
 * adds the role 'admin", "edit" or "view" to the custom user claims
 */
exports.getEndPoints_zfPNiFGeoxPscMEVbZqF = functions.https.onRequest(
    (request, response) => {
      return cors(request, response, () => {
        isAdmin(request).then((result) => {
          if (result) {
            response.json({
              data: {
                result: true,
                endpoints: {
                  initAdmin: "initAdmin_XwMwUpG9PEg1yKVx9tx4",
                  updateRoleUser: "updateRoleUser_EWo7mNbcZ3IJ3IoMH4ix",
                  listAllUsers: "listAllUsers_PuUYXtQEBXlUGypkSnrf",
                  createUpdateUser: "createUpdateUser_RJSNjlNkR68FxeuLAYhX",
                  exportData: "exportData_wsgBpRLBpS2IdW7cHER1",
                  downloadCSV: "downloadCSV_S7CjuCIeFiWe9Gooui0B",
                },
              },
            });
          } else {
            response.json({result: false, message: "You're not allowed here."});
          }
        });
      });
    }
);

/**
 * returns a list of all users of the app
 */
exports.listAllUsers_PuUYXtQEBXlUGypkSnrf = functions.https.onRequest(
    (request, response) => {
      return cors(request, response, () => {
        isAdmin(request)
            .then((result) => {
              if (result) {
                listAllUsers().then((obj) => {
                  response.json({
                    data: {
                      result: true,
                      users: obj,
                    },
                  });
                });
              } else {
                response.json({
                  result: false,
                  message: "You're not allowed here.",
                });
              }
            })
            .catch((error) => {
              console.log("Error listAllUsers", error);
            });
      });
    }
);

/**
 * for now only used for update user
 */
exports.createUpdateUser_RJSNjlNkR68FxeuLAYhX = functions.https.onRequest(
    (request, response) => {
      return cors(request, response, () => {
        if (!request.query.uid) {
          response.json({
            result: false,
            message:
            "The uid was not sent. Function can only update users for now",
          });
        }
        isAdmin(request).then((result) => {
          if (result) {
            updateUser(request, response).then((user) => {
              response.json({
                data: {
                  result: true,
                  message: "Gegevens zijn aangepast",
                  user: user,
                },
              });
            });
          } else {
            response.json({result: false, message: "You're not allowed here."});
          }
        });
      });
    }
);

/**
 * returns a json object of all data in firestore db
 */
exports.exportData_wsgBpRLBpS2IdW7cHER1 = functions.https.onRequest(
    (request, response) => {
      return cors(request, response, () => {
        const backup = {data: {}};
        isAdmin(request)
            .then((result) => {
              if (result) {
                return admin.firestore().collection("data").get();
              } else {
                response.json({
                  result: false,
                  message: "You're not allowed here.",
                });
              }
            })
            .then((result) => {
              backup.data.data = [];
              result.forEach((record) => {
                backup.data.data.push(record.data());
              });
              return admin.firestore().collection("selectData").get();
            })
            .then((result) => {
              backup.data.selectData = [];
              result.forEach((record) => {
                const sD = {};
                sD["id"] = record.id;
                sD["data"] = record.data();
                backup.data.selectData.push(sD);
              });
              return admin.firestore().collection("users").get();
            })
            .then((result) => {
              backup.data.users = [];
              result.forEach((record) => {
                const usr = {};
                usr["id"] = record.id;
                usr["data"] = record.data();
                backup.data.users.push(usr);
              });
              response.json(backup);
            })
            .catch((error) => {
              console.log("Error exportData", error);
            });
      });
    }
);

let tempFilePath = "";
let fileName = "";
/**
 * returns a scv object of the data in firestore db
 */
exports.downloadCSV_S7CjuCIeFiWe9Gooui0B = functions.https.onRequest(
    (request, response) => {
      return cors(request, response, () => {
        isAdmin(request)
            .then((result) => {
              if (result) {
                return admin.firestore().collection("data").get();
              } else {
                response.json({
                  result: false,
                  message: "You're not allowed here.",
                });
              }
            })
            .then((result) => {
              fileName = "database-download.csv";
              console.log(fileName, os.tmpdir());
              tempFilePath = path.join(os.tmpdir(), fileName);
              console.log(tempFilePath);

              const data = [];
              result.forEach((record) => {
                data.push(record.data());
              });
              console.log(data);
              const {Parser} = require("json2csv");
              const fields = [];
              const props = Object.keys(listAllRecordProps(data)).sort();
              for (let i = 0; i < props.length; i++) {
                const propName = props[i];
                fields.push({label: propName, value: propName});
              }
              console.log(props);
              const json2csv = new Parser({fields: fields});
              const csv = json2csv.parse(data);
              console.log(csv);
              return fs.outputFile(tempFilePath, csv);
            })
            .then(() => {
              const storage = gcs.bucket("floriade-expo.appspot.com");
              return storage.upload(tempFilePath, {destination: fileName});
            })
            .then(() => {
              response.json({result: true, message: "file created"});
            })
            .catch((error) => {
              console.log("Error downloadCSV", error);
            });
      });
    }
);

const client = new firestore.v1.FirestoreAdminClient();
const bucket = "gs://floriade-expo.appspot.com";

/**
 * shedules a backup as described in:
 * https://firebase.google.com/docs/firestore/solutions/schedule-export
 */
exports.scheduledFirestoreExport = functions.pubsub
    .schedule("every 6 hours")
    .onRun((context) => {
      const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
      const databaseName = client.databasePath(projectId, "(default)");

      return client
          .exportDocuments({
            name: databaseName,
            outputUriPrefix: bucket,
            // Leave collectionIds empty to export all collections
            // or set to a list of collection IDs to export,
            // collectionIds: ["users", "posts"]
            collectionIds: [],
          })
          .then((responses) => {
            const response = responses[0];
            console.log(`Operation Name: ${response["name"]}`);
          })
          .catch((err) => {
            console.error(err);
            throw new Error("Export operation failed");
          });
    });

const isAdmin = (request) => {
  const idToken = request.query.idToken;
  return admin
      .auth()
      .verifyIdToken(idToken)
      .then((decodedToken) => {
        const adminEmail = decodedToken.email;
        return admin.auth().getUserByEmail(adminEmail);
      })
      .then((user) => {
        if (
          user.customClaims.rights &&
        user.customClaims.rights.indexOf("admin") != -1
        ) {
          return true;
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log("Error isAdmin", error);
      });
};

const listAllUsers = () => {
  const promise = new Promise((resolve, reject) => {
    const allUsers = [];
    return admin
        .firestore()
        .collection("users")
        .get()
        .then((result) => {
          let count = 0;
          const total = result.docs.length;
          result.forEach((record) => {
            listUserForUid(record)
                .then((user) => {
                  count++;
                  if (user) {
                    allUsers.push(user);
                  }
                  if (count == total) {
                    console.log("RESULT: ", allUsers);
                    resolve(allUsers);
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
          });
        })
        .catch((error) => {
          console.log("Error listAllUsers", error);
          reject(error);
        });
  });
  return promise;
};

const listUserForUid = (record) => {
  const promise = new Promise((resolve, reject) => {
    admin
        .auth()
        .getUser(record.data().uid)
        .then((user) => {
        // console.log("RECORD: ", user);
          resolve(user);
        })
        .catch((error) => {
          console.log(error.message);
          resolve(false);
        });
  });

  return promise;
};

// go through all records an get list of all unique records properties
const listAllRecordProps = (records) => {
  const ownPropNames = {};
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const props = Object.getOwnPropertyNames(record);
    for (let j = 0; j < props.length; j++) {
      const prop = props[j];
      if (!ownPropNames[prop]) {
        ownPropNames[prop] = 0;
      }
      ownPropNames[prop]++;
    }
  }
  return ownPropNames;
};

const updateUser = (request, response) => {
  const email = request.query.email;
  const phoneNumber = request.query.phoneNumber;
  const displayName = request.query.displayName;
  const uid = request.query.uid;

  const obj = {};
  if (email) obj.email = email;
  if (phoneNumber) obj.phoneNumber = phoneNumber;
  if (displayName) obj.displayName = displayName;
  obj.emailVerified = true;
  obj.disabled = false;
  return admin
      .auth()
      .updateUser(uid, obj)
      .then((userRecord) => {
        console.log("Successfully updated new user:", userRecord.uid);
        return userRecord;
      })
      .catch((error) => {
        console.log("Error updateUser", error);
        response.json({data: {result: false, message: error.message}});
      });
};
