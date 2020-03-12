function saveMessageToFirebase(msg) {
    db.collection("messages").add(msg)
}

function getAllMessagesFromFirebase() {
    let allMsgs = [];
    db.collection("messages").orderBy('dateStamp', 'asc').limit(200).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            allMsgs.push(doc.data())
        });
    });

    return allMsgs;
}

function watchFirebaseForChanges(callBack) {
    db.collection("messages").orderBy('dateStamp','asc').onSnapshot(function(querySnapshot) {
        querySnapshot.docChanges().forEach(function(change) {
            if (change.type === "added") {
                callBack(change.doc);
            }
        });
    });
}
