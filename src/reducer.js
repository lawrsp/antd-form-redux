import {
  FORM_INIT,
  FORM_DESTROY,
  FORM_CHANGE,
  FORM_SUBMIT,
  FORM_STOP_SUBMIT,
  FORM_SUBMIT_FAILED,
  FORM_SUBMIT_SUCCEEDED,
  FORM_CLEAR_SUBMIT_ERRORS
} from './actions';

import {
  getFieldsFromFlatValues,
  mergeFields,
  mergeFormErrors,
  clearFieldsErrors
} from './utils';
/*
state = {
  'some form name': {
    fields: {
      ....
    },
    submitting: bool,
    submitFailed: bool,
    errors: Object / undefined,
  },
  'another form name': {....}
}
*/
export default function reducer(state = {}, action) {
  const { type, payload, meta = {}, error = false } = action;
  const { form } = meta;

  // actions will create form data:
  switch (type) {
    case FORM_INIT: {
      const { initialValues } = payload;
      const newFields = getFieldsFromFlatValues(initialValues);
      const fields = mergeFields(state.fields, newFields);
      return {
        ...state,
        [form]: { fields, initialValues }
      };
    }
  }

  // actions would not create form data:
  if (!state[form]) {
    return state;
  }

  switch (type) {
    case FORM_DESTROY: {
      const { forms } = meta;
      const newState = { ...state };

      for (let i = 0; i < forms.length; i++) {
        delete newState[forms[i]];
      }

      return newState;
    }
    case FORM_CHANGE: {
      const { fields, initialValues } = payload;
      const old = state[form] || {};
      const oldFields = old.fields || {};
      const merged = mergeFields(oldFields, fields);

      const nForm = {
        ...state[form],
        fields: merged,
        errors: false
      };

      if (initialValues) {
        nForm.initialValues = initialValues;
      }
      return {
        ...state,
        [form]: nForm
      };
    }

    case FORM_SUBMIT: {
      return {
        ...state,
        [form]: {
          ...state[form],
          submitting: true
        }
      };
    }
    case FORM_STOP_SUBMIT: {
      //support field error
      if (error) {
        const { fields = [], ...errors } = payload;
        const nState = mergeFormErrors(state[form], fields, errors);
        nState.submitting = false;
        return {
          ...state,
          [form]: nState
        };
      }
      return {
        ...state,
        [form]: {
          ...state[form],
          submitting: false
        }
      };
    }
    case FORM_SUBMIT_FAILED: {
      return {
        ...state,
        [form]: {
          ...state[form],
          submitFailed: true
        }
      };
    }
    case FORM_SUBMIT_SUCCEEDED: {
      return {
        ...state,
        [form]: {
          ...state[form],
          submitFailed: false
        }
      };
    }
    case FORM_CLEAR_SUBMIT_ERRORS: {
      const formData = state[form];
      return {
        ...state,
        [form]: {
          ...formData,
          fields: clearFieldsErrors(formData.fields),
          submitFailed: false,
          errors: false
        }
      };
    }
    default:
      return state;
  }
}
