export function epoch(date) {
  return Date.parse(date);
}

export function modifyData(firestoreData) {
  console.log("firestoreData", firestoreData.data?.docs);
  try {
    firestoreData.data?.docs.map((docSnapshot) => {
      const doc = docSnapshot.data();
      return doc;
    });
  } catch (error) {
    return [];
  }
}
