module.exports.name = 'dropout';

module.exports.views = {
  "by_cid": {
    "map": function(doc) {
      if(doc.type == "pop_info") {
        emit([doc['IDCARD'],0],null);
      }
      if(doc.type == "dmc") {
        var cid = doc['efPeZGe28XhJ+cIUhqLSBQ=='];
        var sid = doc['L5hcQqye69tMkJGifwjraA=='];
        emit([cid,1,doc.record_as,sid],null);
      }
    }
  }
};
