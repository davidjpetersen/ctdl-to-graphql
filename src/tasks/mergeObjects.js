const mergeObjects = (obj1, obj2) => {
  const result = { ...obj1 };

  for (const key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (
        obj1[key] &&
        typeof obj2[key] === 'object' &&
        !Array.isArray(obj2[key])
      ) {
        // Recursively merge subproperties
        result[key] = mergeObjects(obj1[key], obj2[key]);
      } else {
        // Directly assign if not an object or if the key doesn't exist in obj1
        result[key] = obj2[key];
      }
    }
  }

  return result;
};

export default mergeObjects;
