var running_bo = false;
var timeMinusStateIdx_u8 = 0;
var timePlusStateIdx_u8 = 0;
var timeStateArray_a = [10, 30, 60];
var ratingStateIdx_u8 = 1;
var recorded_start = Date.now();
var bookmark_time = Date.now();
var clicked_bookmarks_u8 = 0;
var comment_cstm = "";
var bookmark_dict = {"Bookmarks": []};
var audio_click;
var audio_confirm;
var audio_error;

$( document ).ready(function() {

    /* Create class instances */
    /* Initialize class instances */
    var btn_start_stop = document.getElementById("id_btn_start");
    var btn_time_p1 = document.getElementById("id_btn_time_plus_1");
    var btn_time_m1 = document.getElementById("id_btn_time_minus_1");
    var btn_time_rating = document.getElementById("id_btn_book_positive");
    var btn_comment = document.getElementById("id_btn_comment");
    var btn_add_bookmark = document.getElementById("id_btn_confirm");
    var btn_download = document.getElementById("id_btn_download");
    var btns_bookmarks = document.getElementsByClassName('btn-book');
    audio_click = document.getElementById('id_audio_click');
    audio_confirm = document.getElementById('id_audio_confirm');
    audio_error = document.getElementById('id_audio_error');

    btn_time_p1.addEventListener('click', function() {toggle_state_minus(this);} );
    btn_time_m1.addEventListener('click', function() {toggle_state_plus(this);} );
    btn_time_rating.addEventListener('click', function() {toggle_state_rating(this);} );
    btn_start_stop.addEventListener('click', function() {toggle_start_stop(this);} );
    btn_start_stop.addEventListener('click', function() {reset_bookmark_buttons(btns_bookmarks);} );
    btn_comment.addEventListener('click', function() {special_comment();} );
    btn_download.addEventListener('click', function() {download_bookmark_json();} );
    btn_add_bookmark.addEventListener('click', function() {add_bookmarks(btns_bookmarks);} );

    for(mbtn of btns_bookmarks) {
        mbtn.addEventListener('click', function() {bookmark_click(this);} );
    }

    var recording_interval = setInterval(update_record_time, 1000);
    clearInterval(recording_interval);
  
});


function toggle_state_minus(mthis)
{
    audio_click.play();
    timeMinusStateIdx_u8 += 1;
    if(2 < timeMinusStateIdx_u8)
    {
        timeMinusStateIdx_u8 = 0;
    }
    mthis.innerHTML = '<span>'.concat('-'.concat(timeStateArray_a[timeMinusStateIdx_u8].toString()).concat('s')).concat('</span>');
}


function toggle_state_plus(mthis)
{
    audio_click.play();
    timePlusStateIdx_u8 += 1;
    if(2 < timePlusStateIdx_u8)
    {
        timePlusStateIdx_u8 = 0;
    }
    mthis.innerHTML = '<span>'.concat('+'.concat(timeStateArray_a[timePlusStateIdx_u8].toString()).concat('s')).concat('</span>');
}

function toggle_state_rating(mthis)
{
    audio_click.play();
    ratingStateIdx_u8 += 1;
    if(1 < ratingStateIdx_u8)
    {
        ratingStateIdx_u8 = -1;
    }
    else
    {
        /* Do nothing */
    }
    
    switch(ratingStateIdx_u8)
    {
        case -1:
            mthis.innerHTML = '<span>NEGATIV</span>';
            mthis.classList.remove("icon-good");
            mthis.classList.add("icon-bad");
            mthis.setAttribute('style', 'color: #DD6633');
            break;
        case 0:
            mthis.innerHTML = '<span>NEUTRAL</span>';
            mthis.classList.remove("icon-bad");
            mthis.classList.add("icon-neutral");
            mthis.setAttribute('style', 'color: #CCCCCC');
            break;
        case 1:
            mthis.innerHTML = '<span>POSITIV</span>';
            mthis.classList.remove("icon-neutral");
            mthis.classList.add("icon-good");
            mthis.setAttribute('style', 'color: #66BB77');
            break;
        default:
            break;
    }
}

function toggle_start_stop(mthis)
{
    if(running_bo == false)
    {
        audio_click.play();
        running_bo = true;
        bookmark_dict = {"Bookmarks": []};
        mthis.innerHTML = '<span>STOP</span>';
        mthis.classList.remove("icon-camera");
        mthis.classList.add("icon-stop");
        recorded_start = Date.now();
        recording_interval = setInterval(update_record_time, 1000);
    }
    else
    {
        audio_click.play();
        if(window.confirm("OK um Aufnahme zu stoppen!"))
        {
            clearInterval(recording_interval);      
            running_bo = false;
            mthis.innerHTML = '<span>START</span>';
            mthis.classList.remove("icon-stop");
            mthis.classList.add("icon-camera");
        }
        else
        {
            /* Do nothing */
        }
    }
}

function download_bookmark_json() {
    if(0 < bookmark_dict['Bookmarks'].length)
    {
        audio_click.play();
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bookmark_dict));
        var csvStr = "data:text/text;charset=utf-8," + encodeURIComponent(json_to_csv(bookmark_dict));
        var textStr = "data:text/text;charset=utf-8," + encodeURIComponent(json_to_text(bookmark_dict));
        var json_data = document.getElementById("id_jsondata");
        var json_csv = document.getElementById("id_jsoncsv");
        var json_text = document.getElementById("id_jsontext");
        json_data.setAttribute("href",     dataStr     );
        json_data.setAttribute("download", "lulila_data.json");
        json_csv.setAttribute("href",     csvStr     );
        json_csv.setAttribute("download", "lulila_data.csv");
        json_text.setAttribute("href",     textStr     );
        json_text.setAttribute("download", "lulila_data.txt");

        if(window.confirm("Download JSON? Abbrechen für CSV!"))
        {
            json_data.click();
        }
        else
        {
            if(window.confirm("Download CSV? Abbrechen für TXT!"))
            {
                json_csv.click();
            }
            else
            {
                if(window.confirm("Download TXT?"))
                {
                    json_text.click();
                }
                else
                {
                    /* Do nothing */
                }
            }
        }
    }
    else
    {
        audio_error.play();
        window.confirm('Keine Daten hinzugefügt - Kein Download!');
    }
}

function update_record_time() {
    var recorded_seconds = Date.now() - recorded_start;
    mthis = document.getElementById("id_btn_start");
    mthis.innerHTML = '<span>'.concat(String(toDateTime(recorded_seconds))).concat('</span>');
  }
  

function toDateTime(msecs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setMilliseconds(msecs);
    var mhours = t.getHours();
    var mminutes = t.getMinutes();
    var mseconds = t.getSeconds();
    var strhours = mhours > 9 ? String(mhours) : '0'.concat(String(mhours));
    var strminutes = mminutes > 9 ? String(mminutes) : '0'.concat(String(mminutes));
    var strseconds = mseconds > 9 ? String(mseconds) : '0'.concat(String(mseconds));
    return strhours.concat(':').concat(strminutes).concat(':').concat(strseconds);
}

function special_comment() {
    if(clicked_bookmarks_u8 > 0)
    {
        audio_click.play();
        comment_cstm = prompt("Kommentar", "Leer");   
    }
    else
    {
        audio_error.play();
    }
}

function bookmark_click(mthis) {
    if(true == running_bo)
    {
        audio_click.play();
        if(mthis.classList.contains('btn-2'))
        {
            mthis.classList.remove('btn-2');
            mthis.classList.add('btn-selected');
            clicked_bookmarks_u8 += 1;
            if(clicked_bookmarks_u8 == 1)
            {
                bookmark_time = Date.now();
            }
        }
        else
        {
            mthis.classList.remove('btn-selected');
            mthis.classList.add('btn-2');
            clicked_bookmarks_u8 -= 1;
        }
    }
    else
    {
        audio_error.play();
        /* Do nothing */
    }
}

function add_bookmarks(mbtns_bookmarks) {
    if((true == running_bo) && (0 < clicked_bookmarks_u8))
    {
        audio_confirm.play();
        var mdict = {'Tags':[]};
        for(mbtn of mbtns_bookmarks)
        {
            if(mbtn.classList.contains("btn-selected"))
            {
                mdict['Tags'].push(lookup_button_tag(mbtn.id));
            }
        }
        
        mdict['Time'] = toDateTime(bookmark_time - recorded_start);
        mdict['Postset'] = timeStateArray_a[timePlusStateIdx_u8];
        mdict['Preset'] = timeStateArray_a[timeMinusStateIdx_u8];
        mdict['Rating'] = ratingStateIdx_u8;
        mdict['Comment'] = comment_cstm;
        
        bookmark_dict['Bookmarks'].push(mdict);
        reset_bookmark_buttons(mbtns_bookmarks);
    }
    else
    {
        audio_error.play();
        /* Do nothing */
    }
}

function reset_bookmark_buttons(mbtns_bookmarks) {
    bookmark_time = Date.now();
    clicked_bookmarks_u8 = 0;
    comment_cstm = "";
    for(mbtn of mbtns_bookmarks)
    {
        mbtn.classList.remove('btn-selected');
        mbtn.classList.add('btn-2');
    }
}

function lookup_button_tag(mbtn_id)
{
    var rval = "BOOK";
    switch(mbtn_id)
    {
        case "id_btn_book_besonderheit":
            rval = "SPEC_GEN";
            break;
        case "id_btn_book_spielaufbau":
            rval = "PREP_OFF";
            break;
        case "id_btn_book_fortsetzung":
            rval = "CONT_GEN";
            break;
        case "id_btn_book_umschalten_off":
            rval = "SWIT_OFF";
            break;
        case "id_btn_book_umschalten_def":
            rval = "SWIT_DEF";
            break;
        case "id_btn_book_gegenpressing":
            rval = "PRES_DEF";
            break;
        case "id_btn_book_anlaufverhalten":
            rval = "RUNN_DEF";
            break;
        case "id_btn_book_standard_off":
            rval = "STAN_OFF";
            break;
        case "id_btn_book_standard_def":
            rval = "STAN_DEF";
            break;
        case "id_btn_book_ecke_off":
            rval = "CORN_OFF";
            break;
        case "id_btn_book_ecke_def":
            rval = "CORN_DEF";
            break;
        default:
            break;
    }
    return rval;
}

function lookup_button_tag_inverse(mbtn_id)
{
    var rval = "Unbekannt";
    switch(mbtn_id)
    {
        case "SPEC_GEN":
            rval = "Besonderheit";
            break;
        case "PREP_OFF":
            rval = "Spielaufbau";
            break;
        case "CONT_GEN":
            rval = "Fortsetzung";
            break;
        case "SWIT_OFF":
            rval = "Umschalten Offensiv";
            break;
        case "SWIT_DEF":
            rval = "Umschalten Defensiv";
            break;
        case "PRES_DEF":
            rval = "Gegenpressing";
            break;
        case "RUNN_DEF":
            rval = "Anlaufverhalten";
            break;
        case "STAN_OFF":
            rval = "Standard Offensiv";
            break;
        case "STAN_DEF":
            rval = "Standard Defensiv";
            break;
        case "CORN_OFF":
            rval = "Eckball Offensiv";
            break;
        case "CORN_DEF":
            rval = "Eckball Defensiv";
            break;
        default:
            break;
    }
    return rval;
}

function json_to_text(mjson)
{
    var mtext = '';
    for(mbookmark of mjson['Bookmarks'])
    {
        mtext = mtext.concat('Time:    ').concat(mbookmark['Time']).concat('\n');
        mtext = mtext.concat('Preset:  ').concat(mbookmark['Preset']).concat('\n');
        mtext = mtext.concat('Postset: ').concat(mbookmark['Postset']).concat('\n');
        mtext = mtext.concat('Rating:  ').concat(mbookmark['Rating']).concat('\n');
        mtext = mtext.concat('Comment: ').concat(mbookmark['Comment']).concat('\n');
        mtext = mtext.concat('Tags:    ')
        for(mtag of mbookmark['Tags'])
        {
            mtext = mtext.concat(lookup_button_tag_inverse(mtag)).concat(' - ');
        }
        mtext = mtext.concat('\n\n');
    }
    return mtext;
}

function json_to_csv(mjson)
{
    var mtext = 'Time,Preset,Postset,Rating,Comment,Tags\n';
    for(mbookmark of mjson['Bookmarks'])
    {
        mtext = mtext.concat(mbookmark['Time']).concat(',');
        mtext = mtext.concat(mbookmark['Preset']).concat(',');
        mtext = mtext.concat(mbookmark['Postset']).concat(',');
        mtext = mtext.concat(mbookmark['Rating']).concat(',');
        mtext = mtext.concat(mbookmark['Comment']).concat(',');
        for(mtag of mbookmark['Tags'])
        {
            mtext = mtext.concat(lookup_button_tag_inverse(mtag)).concat(' - ');
        }
        mtext = mtext.concat('\n');
    }
    return mtext;
}