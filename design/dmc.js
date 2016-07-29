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
  },
  "current_records_by_school" : {
    "map": function(doc) {
      if(doc.type == "dmc") {
        if(doc.current) {
          var cid = doc['efPeZGe28XhJ+cIUhqLSBQ=='];
          var sid = doc['L5hcQqye69tMkJGifwjraA=='];
          var level = doc['FZEZ8EDgrK3sM9aUjMikeg=='];
          emit([sid,doc.record_as,level,cid],1);
        }
      }
      if(doc.type=="school") {
        var sid = doc['TUMQkGfq3smdyI/l/LZtew=='];
        var area_code = doc['0LKGe5ETMywEjU+p+SFGvA=='];
        var school_name = doc['ZyuDe9+wxOw8t4TIGokL8w=='];
        emit([sid,'name',school_name,area_code],1);
      }
    },
    "reduce":function(key,values,rereduce) {
      return sum(values);
    }
  },
};
