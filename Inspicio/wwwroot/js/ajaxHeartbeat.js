setInterval
    // Pings server every 30 seconds or so.
    (function heartbeat() {
    $.ajax({
        url: "/Images/View",
        type: 'POST',
        dataType: 'json',
        data: { userid: userid },
        success: function (response) {
            setTimeout(chatHeartbeatForOnlineUsers(), 10000);
        }
        })
    }, 30000);