var running_bo = false;

$( document ).ready(function() {

    /* Create class instances */
    /* Initialize class instances */
    var btn_start_stop = document.getElementById("id_btn_start");

    var btn_time_p1 = document.getElementById("id_btn_time_plus_1");
    var btn_time_m1 = document.getElementById("id_btn_time_minus_1");
    var btns_time_p = [btn_time_p1];
    var btns_time_m = [btn_time_m1];


    btn_time_p1.addEventListener('click', function() {toggle_state(this, btns_time_p);} );
    btn_time_m1.addEventListener('click', function() {toggle_state(this, btns_time_m);} );

    btn_start_stop.addEventListener('click', function() {toggle_start_stop(this);} );
  
});

function toggle_state(mthis, mbtns)
{
    for(btn of mbtns)
    {
        btn.classList.remove("selected");
    }
    mthis.classList.add("selected");
    var currentdate = new Date(); 
    var datetime = "Last Sync: " + currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/" 
                    + currentdate.getFullYear() + " @ "  
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();
    console.log(datetime);
}

function toggle_start_stop(mthis)
{
    if(running_bo == false)
    {
        running_bo = true;
        mthis.innerHTML = 'STOP';
        mthis.classList.remove('collapsible_book_green');
        mthis.classList.add('collapsible_book_red');
    }
    else
    {
        running_bo = false;
        mthis.innerHTML = 'START';
        mthis.classList.remove('collapsible_book_red');
        mthis.classList.add('collapsible_book_green');
    }
}
  
  
  