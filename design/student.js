module.exports.name = 'student';

module.exports.views = {
  "_test1": {
    "map": function(doc) {
      if(doc.type == "dmc") {
        var cid = doc['efPeZGe28XhJ+cIUhqLSBQ=='];
        var sid = doc['L5hcQqye69tMkJGifwjraA=='];
        var level = doc['FZEZ8EDgrK3sM9aUjMikeg=='];
        emit([cid,doc.record_as,level,sid],1);
      }
    },
    "reduce" : function(key,values,rereduce) {
      return sum(values);
    }
  }
};
