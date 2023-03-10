let profileLoginData
let profileLoginOutput = document.getElementsByClassName("profileLogin")
let profileIdData
let profileIdOutput = document.getElementsByClassName("profileId")
let profileLastProjectData
let profileLastProjectOutput = document.getElementsByClassName("profileLastProject")
let profileTotalXpOutput = document.getElementsByClassName("profileTotalXp")
let profileAverageGradeOutput = document.getElementsByClassName("profileAverageGrade")
let barWidth = 0
let barHeight = 0
let lineWidth = 0
let lineHeight = 0
let points = ""
let projectMap = new Map()


function showProfileData() {
    const query = `
        query {
            user(where:{id:{_eq:125}}) {
                id
                login
            }
        }
    `;

    fetch("https://learn.01founders.co/api/graphql-engine/v1/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            query
        })
    }).then(response => {
        return response.json();
    }).then(data => {
        // login and id data sent to html
        profileLoginData = data.data.user[0].login;
        profileLoginOutput[0].textContent += profileLoginData;
        profileIdData = data.data.user[0].id;
        profileIdOutput[0].textContent += profileIdData;

        
    });
}

function showProgressData() {
    const query = `
        query {
                progress(
                where: {_and: [{user: {id: {_eq: "125"}}}, {object: {type: {_eq: "project"}}}, {isDone: {_eq: true}}, {grade: {_neq: 0}}]}
                order_by: {updatedAt: desc}
            ) {
                id
                grade
                createdAt
                updatedAt
                object {
                    id
                    name
                }
            }
        }
    `;

    fetch("https://learn.01founders.co/api/graphql-engine/v1/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            query
        })
    }).then(response => {
        return response.json();
    }).then(data => {

        // displays last project
        profileLastProjectData = data.data.progress[0].object.name
        profileLastProjectOutput[0].textContent += profileLastProjectData
        //calculates and displays average grade
        let noOfRecords = data.data.progress.length
        let gradesTotal = 0
        data.data.progress.forEach(item => {
            gradesTotal += item.grade
        })
        profileAverageGradeOutput[0].textContent += String((gradesTotal/noOfRecords).toFixed(2))
        let profileCompletedProjects = document.getElementById("completedProjects")
        data.data.progress.forEach(item => {

            //displays project completed section of profile

            let div = document.createElement("div")
            let h3Name = document.createElement("h3")
            h3Name.textContent = item.object.name
            let pCreatedAt = document.createElement("p")
            let date = new Date(Date.parse(item.createdAt))
            let day = date.getDate()
            let month = date.getMonth() + 1
            let year = date.getFullYear()
            pCreatedAt.textContent = "Created " + day + "/" + month + "/" + year
            let pGrade = document.createElement("p")
            pGrade.textContent = "Grade " + item.grade.toFixed(2)
            div.append(h3Name)
            div.append(pGrade)
            div.append(pCreatedAt)
            
            profileCompletedProjects.append(div)
        })

    });
}


function showTransactionData() {
    const query = `
        query {
            transaction(
                where: {_and: [{user: {id: {_eq: "125"}}}, {object: {type: {_eq: "project"}}}, {type: {_eq: "xp"}}]}
                order_by: {createdAt: asc}
            ) {
                amount
                object {
                    id
                    name
                }
                createdAt
            }
            
        }
    `;

    fetch("https://learn.01founders.co/api/graphql-engine/v1/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            query
        })
    }).then(response => {
        return response.json();
    }).then(data => {
        
        
        data.data.transaction.forEach(item => {

            // check if project name is in projectMap

            if (projectMap.has(item.object.name)) {
                // take latest date
                if (projectMap.get(item.object.name)[1] < item.createdAt) {
                    projectMap.set(item.object.name, [projectMap.get(item.object.name)[0] + item.amount, projectMap.get(item.object.name)[1]]) 
                } else {
                    projectMap.set(item.object.name, [projectMap.get(item.object.name)[0] + item.amount, item.createdAt]) 
                }
                
                
            } else {
                projectMap.set(item.object.name, [item.amount, item.createdAt]) 
            } 
        })

        let lineChart = document.getElementById("lineChart")
        let circle = document.getElementById("circle")
        let profileTotalXpData = 0

        projectMap.forEach((item, key) => {
            
            //used to find out total XP
            profileTotalXpData += item[0]
            // bar chart data showing amount of xp per project
            let barChart = document.getElementById("barChart")
            let bar = document.createElementNS('http://www.w3.org/2000/svg',"g")
            bar.setAttribute("class", "bar")
            let rect = document.createElementNS('http://www.w3.org/2000/svg',"rect")
            rect.setAttribute("width", (item[0]).toFixed(1)/1000)
            
            rect.setAttribute("height", 19)
            rect.setAttribute("y", barHeight)
            
            let text = document.createElementNS('http://www.w3.org/2000/svg', "text")
            text.setAttribute("x", (item[0]).toFixed(1)/1000 + 5 )
            text.setAttribute("y", barHeight + 19/2)
            text.setAttribute("dy", ".35em")
            text.textContent = key + " " + item[0] / 1000 + "kb"
            barHeight += 20
            barWidth.toFixed(1)
            bar.append(rect)
            bar.append(text)
            barChart.append(bar)

            //line graph showing xp earned over time

            let time = Date.parse(item[1])
            // circle data point
            let point = document.createElementNS('http://www.w3.org/2000/svg', "circle")
            let text1 = document.createElementNS('http://www.w3.org/2000/svg', "text")
            let text2 = document.createElementNS('http://www.w3.org/2000/svg', "text")
            text1.setAttribute("dy", ".35em")
            text1.setAttribute("x", "10" )
            text1.setAttribute("y", "10")
            text1.style.display = "none"
            text1.textContent = profileTotalXpData/1000 + "kb "
            text2.setAttribute("dy", ".35em")
            text2.setAttribute("x", "10" )
            text2.setAttribute("y", "35")
            text2.style.display = "none"
            let date = new Date(Date.parse(item[1]))
            let day = date.getDate()
            let month = date.getMonth() + 1
            let year = date.getFullYear()
            text2.textContent = day + "/" + month + "/" + year
            point.setAttribute("cx", (time/(1000*60*60*24*7)-2703)*6)
            point.setAttribute("cy", (320 - (profileTotalXpData/1000)/2))
            point.setAttribute("r", 4)
            point.onmouseover = function() {
                text1.style.display = "block"
                text2.style.display = "block"
            }
            point.onmouseleave = function() {
                text1.style.display = "none"
                text2.style.display = "none"
            }
            circle.append(point)
            circle.append(text1)
            circle.append(text2)
            points += (time/(1000*60*60*24*7)-2703)*6 + ", " + (320 - (profileTotalXpData/1000)/2) + " "
        })
        
        // appending points attribute to ployfill
        lineChart.setAttribute("points", points)
        // displaying total XP
        profileTotalXpOutput[0].textContent += profileTotalXpData/1000 + "kb"
    });
}



showProfileData()
showProgressData()
showTransactionData()
   
// things to do
// -- take out duplicate data