let profileLoginData
let profileLoginOutput = document.getElementsByClassName("profileLogin")
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
        profileLoginOutput[0].textContent = profileLoginData;
    });
}

showProfileData()