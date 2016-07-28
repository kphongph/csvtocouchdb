module.exports.name = 'student';

module.exports.views = {
  "by_cid": {
    "map": function(doc) {
      if(doc.type == "student") {
        var cid = doc['efPeZGe28XhJ+cIUhqLSBQ=='];
        emit([cid],1);
      }
    },
    "reduce" : function(key,values,rereduce) {
      return sum(values);
    }
    
  },
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
