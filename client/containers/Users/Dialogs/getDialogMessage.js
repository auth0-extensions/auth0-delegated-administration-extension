const getDialogMessage = (message, fieldName, defaults) => {
  if (message) {
    const regexp = /^([^{]*){([^}]*)}(.*)$/; // rudimentary string replacement
    const match = regexp.exec(message);
    if (match && match[2].trim() === fieldName) {
      return {
        preText: match[1],
        postText: match[3]
      };
    } else {
      return {
        preText: message,
        postText: ''
      };
    }
  }

  return defaults;
};

export default getDialogMessage;
