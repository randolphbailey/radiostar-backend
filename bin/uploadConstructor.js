function Upload(key) {
  this.key = key;
}

Upload.prototype.getUploadURL = function() {
  console.log(this.key);
};

module.exports = Upload;
