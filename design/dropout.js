module.exports.name = 'dropout';

module.exports.views = {
  "by_cid": {
    "map": function(doc) {
      if(doc.type == "pop_info") {
        emit([doc['IDCARD'],0],null);
      }
      if(doc.type == "bstudent_info") {
        emit([doc['IDCODE'],1,doc['MOE_CODE'],doc['YEAR_ED']],null);
      }
      if(doc.type == "dmc") {
        var cid = doc['efPeZGe28XhJ+cIUhqLSBQ=='];
        var sid = doc['L5hcQqye69tMkJGifwjraA=='];
        emit([cid,2,doc.record_as,sid],null);
      }
    }
  }
};
