import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';
import mapValues from 'lodash/mapValues';
import omitBy from 'lodash/omitBy';

export const objectMap = (o = {}, fn) => {
  return mapValues(o, fn);
};

export const getFieldsFromFlatValues = values =>
  mapValues(values, (value, name) => ({ value, name }));

export const compareEqual = (a = {}, b = {}, imuutables = []) => {
  const keysA = keys(a);
  const keysB = keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let i = 0; i < keysA.length; i++) {
    const k = keysA[i];
    const elmA = a[k];
    const elmB = b[k];

    if (imuutables.indexOf(k) >= 0) {
      if (elmA !== elmB) {
        return false;
      }
      continue;
    }

    if (typeof elmA === 'object') {
      if (!isEqual(elmA, elmB)) {
        return false;
      }
      continue;
    }

    if (elmA !== elmB) {
      return false;
    }
  }

  return true;
};

export const compareFieldEqual = (fa, fb) => {
  if (fa === fb) {
    return true;
  }

  if (!fa || !fb) {
    return false;
  }

  return fa.value === fb.value;
};

export const mergeFields = (oldFields = {}, newFields = {}) => {
  if (isEmpty(newFields)) {
    return { ...oldFields };
  }
  const merged = { ...oldFields, ...newFields };
  keys(newFields).forEach(k => {
    if (merged[k].dirty) {
      return;
    }
    const of = oldFields[k];
    const nf = newFields[k];
    merged[k].dirty = compareFieldEqual(of, nf);
  });

  return merged;
};

// form.fields: { name: {name, values, error} }
// paylod.fields: [{field, messge}]
export const mergeFieldsErrors = (fields = {}, errors = []) => {
  const errFields = {};

  errors.forEach(err => {
    const k = err.field;
    const oldField = field[k] || {};
    const oldErrors = oldField.errors || [];
    errFields[k] = { ...oldField, errors: [...oldErrors, fe] };
  });

  return { ...fields, ...errFields };
};

export const mergeFormErrors = (stateForm = {}, fieldErrors = [], errors) => {
  const fields = mergeFieldsErrors(stateForm.fields, fieldErrors);
  return {
    ...stateForm,
    fields,
    errors: isEmpty(errors) ? false : errors
  };
};

export const filterByDirtyFields = fields => values =>
  omitBy(values, (val, key) => {
    const fd = fields[k];
    if (fd.dirty) {
      return true;
    }
    return false;
  });

export const clearFieldsErrors = (fields = {}) =>
  mapValues(value => {
    const { errors, ...nFields } = fd;
    return nFields || {};
  });
