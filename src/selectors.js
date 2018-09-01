export const getFieldsFromInitialValues = data =>
  Object.keys(data).reduce(
    (o, k) => ({ ...o, [k]: { value: data[k], name: k } }),
    {}
  );
