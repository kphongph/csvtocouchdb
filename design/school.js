module.exports.name = 'school';

module.exports.views = {
  "by_areacode": {
    "map": function(doc) {
      if(doc.type == "school") {
        var area_code = doc['0LKGe5ETMywEjU+p+SFGvA=='];
        var area_name = doc['IHf9RK885Kqx2BDjX29m6g=='];
        var school_id = doc['TUMQkGfq3smdyI/l/LZtew=='];
        // var mini_id   = doc['TbYgkcuqSBfov1tCZQLUJw=='];
        // var school_name = doc['ZyuDe9+wxOw8t4TIGokL8w=='];
        // var school_name_en = doc['HlW0AyS/efDdzkDyimsuRA=='];
        emit([area_code,area_name,school_id],1);
      }
    },
    "reduce":function(key,values,rereduce) {
      return sum(values);
    }
  },
  "by_school": {
    "map": function(doc) {
      if(doc.type == "school") {
        var area_code = doc['0LKGe5ETMywEjU+p+SFGvA=='];
        var area_name = doc['IHf9RK885Kqx2BDjX29m6g=='];
        var school_id = doc['TUMQkGfq3smdyI/l/LZtew=='];
        // var mini_id   = doc['TbYgkcuqSBfov1tCZQLUJw=='];
        var school_name = doc['ZyuDe9+wxOw8t4TIGokL8w=='];
        // var school_name_en = doc['HlW0AyS/efDdzkDyimsuRA=='];
        emit([school_id,school_name,area_code,area_name],null);
      }
    }
  }
};
