var running_bo = false;
var timeMinusStateIdx_u8 = 0;
var timePlusStateIdx_u8 = 0;
var timeStateArray_a = [10, 30, 60]
var ratingStateIdx_u8 = 0;
var recorded_seconds = 0;

$( document ).ready(function() {

    /* Create class instances */
    /* Initialize class instances */
    var btn_start_stop = document.getElementById("id_btn_start");
    var btn_time_p1 = document.getElementById("id_btn_time_plus_1");
    var btn_time_m1 = document.getElementById("id_btn_time_minus_1");
    var btn_time_rating = document.getElementById("id_btn_book_positive");

    btn_time_p1.addEventListener('click', function() {toggle_state_minus(this);} );
    btn_time_m1.addEventListener('click', function() {toggle_state_plus(this);} );
    btn_time_rating.addEventListener('click', function() {toggle_state_rating(this);} );
    btn_start_stop.addEventListener('click', function() {toggle_start_stop(this);} );

    var recording_interval = setInterval(update_record_time, 1000);
    clearInterval(recording_interval);
  
});


function toggle_state_minus(mthis)
{
    timeMinusStateIdx_u8 += 1;
    if(2 < timeMinusStateIdx_u8)
    {
        timeMinusStateIdx_u8 = 0;
    }
    mthis.innerHTML = '<span>'.concat('-'.concat(timeStateArray_a[timeMinusStateIdx_u8].toString()).concat('s')).concat('</span>');
}


function toggle_state_plus(mthis)
{
    timePlusStateIdx_u8 += 1;
    if(2 < timePlusStateIdx_u8)
    {
        timePlusStateIdx_u8 = 0;
    }
    mthis.innerHTML = '<span>'.concat('+'.concat(timeStateArray_a[timePlusStateIdx_u8].toString()).concat('s')).concat('</span>');
}

function toggle_state_rating(mthis)
{
    ratingStateIdx_u8 += 1;
    if(2 < ratingStateIdx_u8)
    {
        ratingStateIdx_u8 = 0;
    }
    switch(ratingStateIdx_u8)
    {
        case 0:
            mthis.innerHTML = '<span>POSITIVE</span>';
            mthis.classList.remove("icon-^bad");
            mthis.classList.add("icon-good");
            break;
        case 1:
            mthis.innerHTML = '<span>NEUTRAL</span>';
            mthis.classList.remove("icon-good");
            mthis.classList.add("icon-neutral");
            break;
        case 2:
            mthis.innerHTML = '<span>NEGATIVE</span>';
            mthis.classList.remove("icon-neutral");
            mthis.classList.add("icon-bad");
            break;
        default:
            break;
    }
}

function toggle_start_stop(mthis)
{
    if(running_bo == false)
    {
        running_bo = true;
        mthis.innerHTML = '<span>STOP</span>';
        mthis.classList.remove("icon-camera");
        mthis.classList.add("icon-stop");
        recording_interval = setInterval(update_record_time, 1000);
    }
    else
    {
        clearInterval(recording_interval);      
        running_bo = false;
        mthis.innerHTML = '<span>START</span>';
        mthis.classList.remove("icon-stop");
        mthis.classList.add("icon-camera");
        recorded_seconds = 0;   
    }
}

function update_record_time() {
    mthis = document.getElementById("id_btn_start");
    recorded_seconds += 1;
    mthis.innerHTML = '<span>'.concat(String(toDateTime(recorded_seconds))).concat('</span>');
  }
  

function toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    var mhours = t.getHours();
    var mminutes = t.getMinutes();
    var mseconds = t.getSeconds();
    var strhours = mhours > 9 ? String(mhours) : '0'.concat(String(mhours));
    var strminutes = mminutes > 9 ? String(mminutes) : '0'.concat(String(mminutes));
    var strseconds = mseconds > 9 ? String(mseconds) : '0'.concat(String(mseconds));
    return strhours.concat(':').concat(strminutes).concat(':').concat(strseconds);
}