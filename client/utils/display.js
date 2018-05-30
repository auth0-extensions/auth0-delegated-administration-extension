import _ from 'lodash';
import moment from 'moment';

export const getProperty = (obj, path) => {
  var args = path.split('.'), i, l;

  for (i=0, l=args.length; i<l; i++) {
    if (!obj.hasOwnProperty(args[i]))
      return;
    obj = obj[args[i]];
  }

  return obj;
};

export const getName = (user, fields, languageDictionary) => {
  fields = fields || [];
  const field = _.find(fields, {property: 'name'});
  if (field) {
    return getValue(user, field, languageDictionary);
  }

  return user && (user.name || user.user_name || user.email);
};

export const getValueForType = (type, user, field, languageDictionary = {}, additionalData = {}) => {
  const mergedField = _.assign({}, field, field[type]);
  return getValue(user, mergedField, languageDictionary, additionalData);
};

export const getValue = (user, field, languageDictionary = {}, additionalData = {}) => {
  if (!user || user.size === 0) {
    return null;
  }

  if (_.isFunction(field.display)) {
    try {
      return field.display(user, languageDictionary, additionalData);
    } catch (e) {
      /* Swallow eval errors */
      console.log(`Could not display ${field.property} because: ${e.message}`);
      return null;
    }
  }

  let value = getProperty(user, field.property);
  if (value === undefined) return null;

  if (field.type && field.type === 'elapsedTime') {
    value = moment(value).locale(languageDictionary.momentLocale || 'en').fromNow();
  }

  if (_.isObject(value)) {
    value = JSON.stringify(value);
  }

  if (_.isBoolean(value)) {
    value = value ? (languageDictionary.trueLabel || 'TRUE') : (languageDictionary.falseLabel || 'FALSE');
  }

  return value;
};

export const mapValues = (user, fieldNames, fields, type, languageDictionary = {}, additionalData = {}) => {
  const mappedUser = {};
  if (user) {
    fieldNames.forEach(fieldName => {
      const field = _.find(fields, { property: fieldName });
      if (field) {
        const value = getValueForType(type, user, field, languageDictionary, additionalData);
        if (value) mappedUser[fieldName] = value;
        return;
      }

      if (user[fieldName]) mappedUser[fieldName] = user[fieldName];
    });
  }
  return mappedUser;
};
