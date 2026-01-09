(function(){
    console.log("Analytics script loaded.");

    function generateUUID(){   
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }
    let visitorId = localStorage.getItem('webtrack_visitor_id');  // this is for avoiding multitab time tracking
    if(!visitorId){
        visitorId = generateUUID();
        localStorage.setItem('webtrack_visitor_id', visitorId);
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

    fetch('http://localhost:3000/api/track', {
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
        fetch('http://localhost:3000/api/track', {
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
            })
        })
        localStorage.clear(); // clear visitor ID on exit
    }

    window.addEventListener('beforeunload', handleExit);
    // window.addEventListener('pagehide', handleExit);

})();