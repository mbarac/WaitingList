var mysql = require('./database');

var reloadTable = function(res,string) {
console.log(string[0]+string[1]);
  if(string[1] === '1'){
var choice = "SELECT * ,DATE_FORMAT(SLOBODNI_TERMIN, '%d.%m.%Y.') AS datum, time_format(SLOBODNI_TERMIN, '%H:%i') AS vrijeme FROM ustanove,podaci,kzn, ocijena WHERE SLOBODNI_TERMIN > NOW() AND ustanove.USTANOVA_ID=podaci.USTANOVA_ID AND kzn.ZAHVAT_ID=podaci.ZAHVAT_ID and ocijena.ZAHVAT_ID=podaci.ZAHVAT_ID and ocijena.USTANOVA_ID = ustanove.USTANOVA_ID and kzn.IME='"+string[0]+"' ORDER BY SLOBODNI_TERMIN ASC limit 10";
}else if(string[1]==='2'){

  var choice = 'SELECT * FROM ustanove,podaci,kzn WHERE  ustanove.USTANOVA_ID=podaci.USTANOVA_ID AND kzn.ZAHVAT_ID=podaci.ZAHVAT_ID AND kzn.IME="'+string[0]+'" AND KONTAKT_ADRESA LIKE "%'+string[3]+'%" ORDER BY SLOBODNI_TERMIN ASC limit 10';
}
else if(string[1]==='3') {
      if (string[2]==='4') {
        var choice = "SELECT * ,DATE_FORMAT(SLOBODNI_TERMIN, '%d.%m.%Y.') AS datum, time_format(SLOBODNI_TERMIN, '%H:%i') AS vrijeme FROM ustanove,podaci,kzn, ocijena WHERE ustanove.USTANOVA_ID=podaci.USTANOVA_ID AND kzn.ZAHVAT_ID=podaci.ZAHVAT_ID and ocijena.ZAHVAT_ID=podaci.ZAHVAT_ID and ocijena.USTANOVA_ID = ustanove.USTANOVA_ID and kzn.IME='"+string[0]+"' ORDER BY UKUPNO_ZADOVOLJSTVO DESC limit 10";
      }
      else if (string[2]==='5'){
        var choice = "SELECT * ,DATE_FORMAT(SLOBODNI_TERMIN, '%d.%m.%Y.') AS datum, time_format(SLOBODNI_TERMIN, '%H:%i') AS vrijeme FROM ustanove,podaci,kzn, ocijena WHERE ustanove.USTANOVA_ID=podaci.USTANOVA_ID AND kzn.ZAHVAT_ID=podaci.ZAHVAT_ID and ocijena.ZAHVAT_ID=podaci.ZAHVAT_ID and ocijena.USTANOVA_ID = ustanove.USTANOVA_ID and kzn.IME='"+string[0]+"' ORDER BY PROFESIONALNOST_OSOBLJA DESC limit 10";
      }
      else {
        var choice = "SELECT * ,DATE_FORMAT(SLOBODNI_TERMIN, '%d.%m.%Y.') AS datum, time_format(SLOBODNI_TERMIN, '%H:%i') AS vrijeme FROM ustanove,podaci,kzn, ocijena WHERE ustanove.USTANOVA_ID=podaci.USTANOVA_ID AND kzn.ZAHVAT_ID=podaci.ZAHVAT_ID and ocijena.ZAHVAT_ID=podaci.ZAHVAT_ID and ocijena.USTANOVA_ID = ustanove.USTANOVA_ID and kzn.IME='"+string[0]+"' ORDER BY KVALITETA_PROSTORA DESC limit 10";
      }
}

  mysql.sendQuery(choice, function(rows,fields)
  {
    //console.log(rows);
    res.send({scrapped:rows});
  });
};

var loadtable = function(res) {
  mysql.sendQuery("SELECT *, if(KONTAKT_EMAIL is null, '-', KONTAKT_EMAIL) AS KONTAKT_EMAIL2, if(KONTAKT_TELEFON is null, '-', KONTAKT_TELEFON) AS KONTAKT_TELEFON2, DATE_FORMAT(SLOBODNI_TERMIN, '%d.%m.%Y.') AS datum, time_format(SLOBODNI_TERMIN, '%H:%i') AS vrijeme FROM ustanove, podaci, ocijena WHERE SLOBODNI_TERMIN > NOW() AND ustanove.USTANOVA_ID=podaci.USTANOVA_ID and ocijena.ZAHVAT_ID=podaci.ZAHVAT_ID and ocijena.USTANOVA_ID = ustanove.USTANOVA_ID limit 20",
    function(rows,fields)
    {
  //console.log(rows);
    res.render('index',{scrapped:rows});
    }
  );
};
var rateIt = function(res,ocjene){
  var query = "SELECT * FROM ustanove , kzn , podaci where ustanove.NAZIV='"+ocjene[0]+"' and kzn.ime='"+ocjene[1]+"' and ustanove.USTANOVA_ID=podaci.USTANOVA_ID and kzn.ZAHVAT_ID=podaci.ZAHVAT_ID";
mysql.sendQuery(query,function(rows){
  for(var i=0;i<rows.length;i++){
    var ustanovaID = rows[i].USTANOVA_ID;
    var zahvatID = rows[i].ZAHVAT_ID;
  }

  var query1="insert into ocijena (USTANOVA_ID,ZAHVAT_ID,UKUPNO_ZADOVOLJSTVO,PROFESIONALNOST_OSOBLJA,KVALITETA_PROSTORA,SPOL,DOBNA_SKUPINA,BROJ_UNOSA) VALUES ("+ustanovaID+","+zahvatID+","+ocjene[2]+","+ocjene[3]+","+ocjene[4]+",'"+ocjene[5]+"','"+ocjene[6]+"',1) ON DUPLICATE KEY UPDATE UKUPNO_ZADOVOLJSTVO=UKUPNO_ZADOVOLJSTVO+"+ocjene[2]+",PROFESIONALNOST_OSOBLJA=PROFESIONALNOST_OSOBLJA+"+ocjene[3]+",KVALITETA_PROSTORA=KVALITETA_PROSTORA+"+ocjene[4]+",broj_unosa=broj_unosa +1";

   mysql.sendQuery(query1,function(rows){
      console.log(rows);
    });
  });
};

module.exports = {
  reloadTable: reloadTable,
  loadtable:loadtable,
  rateIt:rateIt
};
