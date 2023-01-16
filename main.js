let profileLoginData
let profileLoginOutput = document.getElementsByClassName("profileLogin")
let profileIdData
let profileIdOutput = document.getElementsByClassName("profileId")
let profileLastProjectData
let profileLastProjectOutput = document.getElementsByClassName("profileLastProject")
let profileTotalXpData = 0
let profileTotalXpOutput = document.getElementsByClassName("profileTotalXp")
let profileAverageGradeOutput = document.getElementsByClassName("profileAverageGrade")


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
        console.log(data)
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
                grade
                createdAt
                updatedAt
                object {
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
        console.log(data)
        profileLastProjectData = data.data.progress[0].object.name
        profileLastProjectOutput[0].textContent += profileLastProjectData

        let noOfRecords = data.data.progress.length
        let gradesTotal = 0
        data.data.progress.forEach(item => {
            gradesTotal += item.grade
        })
        profileAverageGradeOutput[0].textContent += String((gradesTotal/noOfRecords).toFixed(2))
        let profileCompletedProjects = document.getElementById("completedProjects")
        data.data.progress.forEach(item => {
            let div = document.createElement("div")
            let h3Name = document.createElement("h3")
            h3Name.textContent = item.object.name
            let pCreatedAt = document.createElement("p")
            let date = new Date(Date.parse(item.createdAt))
            let day = date.getDate()
            let month = date.getMonth() + 1
            let year = date.getFullYear()
            pCreatedAt.textContent = day + "/" + month + "/" + year
            let pGrade = document.createElement("p")
            pGrade.textContent = item.grade.toFixed(2)
            div.append(h3Name)
            div.append(pCreatedAt)
            div.append(pGrade)
            profileCompletedProjects.append(div)
        })

    });
}


function showTransactionData() {
    const query = `
        query {
            transaction(
                where: {_and: [{user: {id: {_eq: "125"}}}, {object: {type: {_eq: "project"}}}, {type: {_eq: "xp"}}]}
                order_by: {amount: desc}
            ) {
                amount
                object {
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
        console.log(data)
        data.data.transaction.forEach(item => {
            profileTotalXpData += item.amount
        })

        profileTotalXpOutput[0].textContent += profileTotalXpData   
    });
}

showProfileData()
showProgressData()
showTransactionData()