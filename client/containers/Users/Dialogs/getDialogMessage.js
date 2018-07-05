const getDialogMessage = (message, fieldName, value) => {
  const regexp = /^([^{]*){([^}]*)}(.*)$/; // rudimentary string replacement
  const match = regexp.exec(message);
  if (match && match[2].trim() === fieldName) {
    return `${match[1]}${value}${match[3]}`;
  }

  return `${message}${value}`;
};

export default getDialogMessage;
