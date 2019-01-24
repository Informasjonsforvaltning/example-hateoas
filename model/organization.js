class Organization {
  constructor(obj, id) {
    this._id = id;
    this._name = obj.name;
  }

  set name(name) {
    this._name = name
  }

  get name() {
    return this._name
  }

  set name(id) {
    this._id = id
  }

  get id() {
    return this._id
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name
    }
  }
}
module.exports = Organization
