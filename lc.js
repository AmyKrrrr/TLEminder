async function getLcContest(){
    try{
        const cont = await fetch('https://alfa-leetcode-api.onrender.com/contests/upcoming');
        let contJson = await cont.json();
        const contestDict = {};
        const contestsArray = contJson.contests.reverse();
        contestsArray.forEach(c => {
            const dateObj = new Date(c.originStartTime*1000);
            contestDict[c.title] = dateObj.toLocaleString();
        })
        return contestDict;
    }
    catch (error){
        console.error("Failed to fetch Codeforces contests:", error);
        return null;
    }
}

module.exports = { getLcContest };
// const cont = await fetch('https://alfa-leetcode-api.onrender.com/contests/upcoming');
// let contJson = await cont.json();
// console.log(contJson);  