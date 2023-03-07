export function epoch(date) {
  return Date.parse(date);
}

export function modifyData(firestoreData) {
  try {
    firestoreData.data?.docs.map((docSnapshot) => {
      const doc = docSnapshot.data();
      return doc;
    });
  } catch (error) {
    return [];
  }
}

export const modifySelectData = (data) => {
  let obj = [];
  return data.map((ob) => ({ ...ob, value: obj.name }));
};
