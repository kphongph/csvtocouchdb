module.exports.name = 'dmc';

module.exports.views = {
  "by_record_as": {
    "map": function(doc) {
      if(doc.type == "dmc") {
        var cid = doc['efPeZGe28XhJ+cIUhqLSBQ=='];
        var sid = doc['L5hcQqye69tMkJGifwjraA=='];
        var level = doc['FZEZ8EDgrK3sM9aUjMikeg=='];
        emit([doc.record_as],1);
      }
    },
    "reduce":function(key,values,rereduce) {
      return sum(values);
    }
  },
  "by_student" : {
    "map": function(doc) {
      if(doc.type == "dmc") {
        var cid = doc['efPeZGe28XhJ+cIUhqLSBQ=='];
        var sid = doc['L5hcQqye69tMkJGifwjraA=='];
        var level = doc['FZEZ8EDgrK3sM9aUjMikeg=='];
        emit([cid,doc.record_as,sid,level],1);
      }
    },
    "reduce":function(key,values,rereduce) {
      return sum(values);
    }
  },
  "by_level" : {
    "map": function(doc) {
      if(doc.type == "dmc") {
        var cid = doc['efPeZGe28XhJ+cIUhqLSBQ=='];
        var sid = doc['L5hcQqye69tMkJGifwjraA=='];
        var level = doc['FZEZ8EDgrK3sM9aUjMikeg=='];
        emit([level],1);
      }
    },
    "reduce":function(key,values,rereduce) {
      return sum(values);
    }
  },
  "current_records" : {
    "map": function(doc) {
      if(doc.type == "dmc") {
        if(doc.current) {
          var cid = doc['efPeZGe28XhJ+cIUhqLSBQ=='];
          var sid = doc['L5hcQqye69tMkJGifwjraA=='];
          var level = doc['FZEZ8EDgrK3sM9aUjMikeg=='];
          emit([doc.record_as,level,sid,cid],1);
        }
      }
    },
    "reduce":function(key,values,rereduce) {
      return sum(values);
    }
  }
};
