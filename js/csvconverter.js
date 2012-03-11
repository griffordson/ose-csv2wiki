/**
 * 
 */

$(function(){
  
  $('#convert-button').on('click', function(){
    var csvVal = $('#csv').val();
    // console.log('click');
    if(_.isEmpty(csvVal)) {
      alert('Please paste the CSV data into the first textarea.');
      return;
    }
    var csvData = CSVToArray(csvVal, ',');
    var template = getSelectedTemplate();

    /*
    _.each(csvData[0], function(h, i) {
      console.log(i, h);
    });
    */

    var text = '';

    _.each(csvData, function(entry) {
      var member = new Member(entry, $('#type').val());
      // console.log('member', member.isValid());
      if(member.isValid()) {
        text += template(member);
      }
    });

    $('#wiki').text(text);

  });
});

function getSelectedTemplate() {
  var id = '#wiki-template-' + $('#type').val();
  var el = $(id);
  // console.log('getSelectedTemplate', id, el);
  return _.template(el.html());
}

var Member = function(entry) {
  this.initialize.apply(this, arguments);
};

_.extend(Member.prototype, {
  initialize: function(entry, region) {
    this.valid = false;
    if(_.isArray(entry) 
      && (('us' == region && entry.length == 25) || ('eu' == region && entry.length >= 25)) 
      && "Timestamp" != entry[0]) {
      this.updatedAt = this._getUpdatedAt(region);
      this.valid = true;
      this.rawEntry = entry;
      this.name = this._convertText(entry[1]);
      this.loc = this._convertText(entry[2]);
      this.contact = this._parseContact(entry[3]);
      this.picture = this._convertText(entry[4]);
      this.video = this._convertText(entry[5]);
      this.cv = this._convertText(entry[6]);
      this.endorse = this._convertText(entry[7]);
      this.whyCollab = this._convertText(entry[8]);
      this.pressingWorldIssues = this._convertText(entry[9]);
      this.moreInvolved = this._convertText(entry[10]);
      this.whatDoYouLikeEU = this._convertText(entry[10]);
      this.whatIsMissing = this._convertText(entry[11]);
      this.suggestedImprovements = this._convertText(entry[12]);
      this.skills = this._convertText(entry[13]);
      this.howHaveYouContributed = this._convertText(entry[14]);
      this.whatDoYouWantToDo = this._convertText(entry[15]);
      this.canYouVolunteer = this._convertText(entry[16]);
      this.workForPay = this._convertText(entry[17]);
      this.interestedInVisit = this._convertText(entry[18]);
      this.interestedInPurchase = this._convertText(entry[19]);
      this.interestedInCommunityEU = this._convertText(entry[19]);
      this.interestedInBidding = this._convertText(entry[20]);
      this.trueFan = this._convertText(entry[21]);
      this.fullTime = this._convertText(entry[22]);
      this.community = this._convertText(entry[24]);
      this.moreInvolvedEU = this._convertText(entry[25]);
      this.interestedInBuildingEU = this._convertText(entry[26]);
      this.trueFanEU = this._convertText(entry[27]);
      this.fullTimeEU = this._convertText(entry[28]);
      this.whatFriendsDoingWorkEU = this._convertText(entry[30]);
      this.techNeedsCommunityEU = this._convertText(entry[31]);
      this.areFriendsWorkingEU = this._convertText(entry[32]);

    }
  },

  isValid: function() {
    return this.valid;
  },

  _parseContact: function(rawContact) {
    rawContact || (rawContact = '');
    return rawContact.replace(/@/g, ' (at) ').replace(/\./g, ' (dot) ');
  },

  _convertText: function(rawText) {
    rawText || (rawText = '');
    return rawText.trim().replace(/\n/g, '\n<br />');
  },

  _getUpdatedAt: function(region) {
    var d = new Date();
    if('us' == region)
      return this._monthNames[d.getMonth()] 
        + ' ' + d.getDate()
        + ', ' + d.getFullYear();
    else
      return d.getDate()
        + '. ' + this._monthNames[d.getMonth()]
        + ', ' + d.getFullYear()
        + '.';
  },

  _monthNames: [ "January", "February", "March",
                 "April", "May", "June",
                 "July", "August", "September",
                 "October", "November", "December"
  ]
});


// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray( strData, strDelimiter ){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
            (
                    // Delimiters.
                    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                    // Quoted fields.
                    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                    // Standard fields.
                    "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
            );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[ 1 ];

            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
                    strMatchedDelimiter.length &&
                    (strMatchedDelimiter != strDelimiter)
                    ){

                    // Since we have reached a new row of data,
                    // add an empty row to our data array.
                    arrData.push( [] );

            }


            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[ 2 ]){

                    // We found a quoted value. When we capture
                    // this value, unescape any double quotes.
                    var strMatchedValue = arrMatches[ 2 ].replace(
                            new RegExp( "\"\"", "g" ),
                            "\""
                            );

            } else {

                    // We found a non-quoted value.
                    var strMatchedValue = arrMatches[ 3 ];

            }


            // Now that we have our value string, let's add
            // it to the data array.
            arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
}
