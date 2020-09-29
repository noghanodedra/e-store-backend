export const validateData = (data, schema) => {
  const options = { abortEarly: false };
  const errors = schema.validate(data, options);
  return errors.error ? buildUsefulErrorObject(errors.error.details) : undefined;
};

const buildUsefulErrorObject = (errors) => {
  const usefulErrors = {};
  errors.map((error) => {
    const path = error.path.join('_');
    if (!usefulErrors.hasOwnProperty(path)) {
      usefulErrors[path] = {
        message: error.message,
      };
    }
  });
  return usefulErrors;
};
