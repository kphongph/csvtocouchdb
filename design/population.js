module.exports.name = 'population';

// "IDCARD","SUR_CODE","PRE_NAME","NAME1","NAME2",
// "BIRTHD","BIRTHD_DD","BIRTHD_MM","BIRTHD_YY","BIRTHD_NEW",
// "SEXCODE","SEX","NATIONALIT","HOUSECODE","HOUSENUM",
// "V_CODE","VILLAGENO","ALLEY","LANE","ROAD","T_CODE",
// "T_NAME","D_NAME","P_NAME","AGE","SOURCE","SEQ","sequenceNumber"

// type = pop_info

module.exports.views = {
  "by_idcard": {
    "map": function(doc) {
      if(doc.type == "pop_info") {
        var idcard = doc['IDCARD'];
        var pre_name = doc['PRE_NAME'];
        var first_name = doc['NAME1'];
        var last_name = doc['NAME2'];
        var birthd = doc['BIRTHD'];
        emit([idcard,pre_name,first_name,last_name,birthd],1);
      }
    },
    "reduce":function(key,values,rereduce) {
      return sum(values);
    }
  }
};
