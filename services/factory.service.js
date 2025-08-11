const deleteOneService = async (Model, id) => {
  const document = await Model.findByIdAndDelete(id);
  return document;
};

const createOneService = async (Model, document) => {
  const addedDocument = new Model({
    ...document,
  });

  await addedDocument.save();

  const doc = addedDocument.toObject();

  delete doc.password;

  return doc;
};

const updateOneService = async (Model, id, body) => {
  const document = await Model.findByIdAndUpdate(id, body, {
    new: true,
  });
  return document;
};

export { deleteOneService, createOneService, updateOneService };
