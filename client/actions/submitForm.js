import {submit} from 'redux-form';

const submitForm = (formName) => {
  return (dispatch) => {
    dispatch(submit(formName));
  }
};

export default submitForm;