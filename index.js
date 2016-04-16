var cheerio = require('cheerio');
var request = require('request');

const DEWORDS = {
  'BG': 'Bulgarisch',
  'BS': 'Bosnisch',
  'CS': 'Tschechisch',
  'DA': 'Dänisch',
  'EN': 'Englisch',
  'EL': 'Griechisch',
  'EO': 'Esperanto',
  'ES': 'Spanisch',
  'FI': 'Finnisch',
  'FR': 'Französisch',
  'HR': 'Kroatisch',
  'HU': 'Ungarisch',
  'IS': 'Isländisch',
  'IT': 'Italienisch',
  'LA': 'Latein',
  'NL': 'Niederländisch',
  'NO': 'Norwegisch',
  'PL': 'Polnisch',
  'PT': 'Portugiesisch',
  'RO': 'Rumänisch',
  'RU': 'Russisch',
  'SK': 'Slowakisch',
  'SQ': 'Albanisch',
  'SR': 'Serbisch',
  'SV': 'Schwedisch',
  'TR': 'Türkisch'
};

const ENWORDS = {
  'BG': 'Bulgarian',
  'BS': 'Bosnian',
  'CS': 'Czech',
  'DA': 'Danish',
  'DE': 'Deutsch',
  'EL': 'Greek',
  'EO': 'Esperanto',
  'ES': 'Spanish',
  'FI': 'Finnish',
  'FR': 'French',
  'HR': 'Croatian',
  'HU': 'Hungarian',
  'IS': 'Icelandic',
  'IT': 'Italian',
  'LA': 'Latin',
  'NL': 'Dutch',
  'NO': 'Norwegian',
  'PL': 'Polish',
  'PT': 'Portuguese',
  'RO': 'Romanian',
  'RU': 'Russian',
  'SK': 'Slovak',
  'SQ': 'Albanian',
  'SR': 'Serbian',
  'SV': 'Swedish',
  'TR': 'Turkish'
};

exports.translate = (from, to, term, callback) => {
  'use strict';
  if ((from.toUpperCase() in ENWORDS || from.toUpperCase() in DEWORDS) && 
      (to.toUpperCase() in ENWORDS || to.toUpperCase() in DEWORDS)) {
    const options = {
      url: 'http://' + from + to + '.dict.cc/?s=' + term,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:30.0) Gecko/20100101 Firefox/30.0'
      }
    };

    let fromEnOrDe = true;
    let fromTitle, toTitle = '';

    if (!(from.toLowerCase() === 'en' || from.toLowerCase() === 'de')) {
      fromEnOrDe = false;
    }

    if (from.toLowerCase() === 'de') {
      fromTitle = 'Deutsch';
      toTitle = DEWORDS[to.toUpperCase()];
    }
    else {
      fromTitle = 'Englisch';
      toTitle = ENWORDS[to.toUpperCase()];
    }

    request(options, (err, res, body) => {
      const $ = cheerio.load(body);
      const l1 = [];
      const l2 = [];
      const dict = [];

      $('td.td7nl').each((i, elem) => {
        let text = $(elem).text();
        text = text.replace(/\d/g, '');
        text = text.replace(/\[.+\]/g, '');
        text = text.trim();
        if(i % 2 === 0){
          l1.push(text);
        } 
        else {
          l2.push(text);
        }
      });
      
      if (!fromEnOrDe) {
        l1.forEach((element, index) => {
          dict.push({
            from: element,
            to: l2[index]
          });
        }); 
      }
      else {
        l2.forEach((element, index) => {
          dict.push({
            from: element,
            to: l1[index]
          });
        }); 
      }
      callback(dict, null);
    });

  } else {
    callback([{from: '', to: ''}], 'Invalid Language Code');
  }
  
};
