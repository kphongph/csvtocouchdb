module.exports.name = 'csv';

module.exports.views = {
  "_csv_md5": {
    "map": function(doc) {
      if(doc.csv_md5) {
        emit(doc.csv_md5,null);
      }
    }
  }
};
