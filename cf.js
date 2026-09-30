async function getCfContest(){
    try {
        const cont = await fetch('https://codeforces.com/api/contest.list');
        const contJson = await cont.json();
        
        if(contJson.status !== "OK"){
            return null;
        }
        
        let upcoming = contJson.result.filter(conti => conti.phase === 'BEFORE');
        upcoming = upcoming.reverse();
        const contestDict = {};
        upcoming.forEach(c => {
            const dateObj = new Date(c.startTimeSeconds*1000);
            contestDict[c.name] = dateObj.toLocaleString();
        });
        
        return contestDict;
    }
    catch{
        console.error("Failed to fetch Codeforces contests:", error);
        return null;
    }
}

module.exports = { getCfContest };