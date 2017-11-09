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

  switch (type) {
    case FORM_INIT: {
      const { fields } = payload;
      return {
        ...state,
        [form]: { fields }
      };
    }
    case FORM_DESTROY: {
      const { forms } = meta;
      const newState = {};
      Object.keys(state).forEach(k => {
        for (let i = 0; i < forms.length; i++) {
          if (forms[i] === k) {
          }
          return;
        }

        newState[k] = state[k];
      });

      return newState;
    }
    case FORM_CHANGE: {
      const { fields } = payload;
      const oldFields = (state[form] || {}).fields;
      return {
        ...state,
        [form]: {
          ...state[form],
          fields: { ...oldFields, ...fields },
          errors: false,
        }
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
      const { errors } = payload;
      const newState = {
        ...state,
        [form]: {
          ...state[form],
          submitting: false
        }
      };

      if (error) {
        newState[form].errors = errors;
      }

      console.log(newState);

      return newState;
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
      return {
        ...state,
        [form]: {
          ...state[form],
          submitFailed: false,
          errors: false
        }
      };
    }
    default:
      return state;
  }
}
