module.exports.name = 'student';

module.exports.views = {
  "study_records": {
    "map": function(doc) {
      if(doc.type == "dmc") {
        var cid = doc['efPeZGe28XhJ+cIUhqLSBQ=='];
        var sid = doc['L5hcQqye69tMkJGifwjraA=='];
        // var level = doc['FZEZ8EDgrK3sM9aUjMikeg=='];
        if(doc.current) {
          emit([cid,doc.record_as,1],null);
        } else {
          emit([cid,doc.record_as,0],null);
        }
      }
    }
  }
};
