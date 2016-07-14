import { normalize, arrayOf } from 'normalizr';

export default (function (body, _ref) {
  var collection = _ref.collection;
  var model = _ref.model;
  return normalize(body, collection ? arrayOf(model) : model);
});