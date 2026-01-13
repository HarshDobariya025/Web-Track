(function(){
    console.log("Analytics script loaded.");

    function generateUUID(){   
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    const session_duration = 12*60*50*1000; // 12 hours in milliseconds
    const now = Date.now();
    let visitorId = localStorage.getItem('webtrack_visitor_id');  // this is for avoiding multitab time tracking
    let sessionTime = localStorage.getItem('webtrack_session_time');
    if(!visitorId || (now-sessionTime) > session_duration){
        if(visitorId){
            localStorage.removeItem('webtrack_visitor_id');
            localStorage.removeItem('webtrack_session_time');
        }
        visitorId = generateUUID();
        localStorage.setItem('webtrack_visitor_id', visitorId);
        localStorage.setItem('webtrack_session_time', now);
    }else{
        console.log("Existing session");
    }

    const script=document.currentScript;
    const websiteId=script.getAttribute("data-website-id");
    const domain=script.getAttribute("data-domain");

    const entryTime = Math.floor(Date.now() / 1000); // get entry time
    const referrer=document.referrer || 'Direct'; // get referrer

    // utm sources
    const urlParams=new URLSearchParams(window.location.search);
    const utmSource=urlParams.get('utm_source') || '';
    const utmMedium=urlParams.get('utm_medium') || '';
    const utmCampaign=urlParams.get('utm_campaign') || '';
    const RefParams=window.location.href.split('?')[1] || '';

    const data={
        type: 'entry',
        websiteId: websiteId,
        domain: domain,
        entryTime: entryTime,
        referrer: referrer,
        url: window.location.href,
        visitorId: visitorId,
        urlParams,
        utmSource,
        utmMedium,
        utmCampaign,
        RefParams
    }

    fetch('https://web-track-phi.vercel.app/api/track', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })


    // Active time tracking ------------------------------------
    let activeTime = Math.floor(Date.now() / 1000);
    let totalActiveTime = 0;

    const handleExit = () => {
        const exitTime = Math.floor(Date.now() / 1000);
        totalActiveTime += Math.floor(Date.now() / 1000) - activeTime;
        fetch('https://web-track-phi.vercel.app/api/track', {
            method: 'POST',
            keepalive: true,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'exit',
                websiteId: websiteId,
                domain: domain,
                exitTime: exitTime,
                totalActiveTime: totalActiveTime,
                visitorId: visitorId,
                exitUrl: window.location.href
            })
        })
        // localStorage.clear(); // clear visitor ID on exit
    }

    window.addEventListener('beforeunload', handleExit);
    // window.addEventListener('pagehide', handleExit);

    const sendLivePing = () => {
        fetch('https://web-track-phi.vercel.app/api/live', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                visitorId,
                websiteId,
                last_seen: Date.now().toString(),
                url: window.location.href
            })
        })
    }

    setInterval(sendLivePing, 10000); // send ping every 10 seconds

})();