const request =  new XMLHttpRequest,
$users = document.querySelector(".users");

function showUsers(json){
    return new Promise((resolve,reject)=>{
        request.addEventListener("load",e=>{
            if(request.status == 200) resolve(request.response);
            else reject(request.statusText || "Error " + request.status);
        })
    })
}

request.open("GET","https://jsonplaceholder.typicode.com/users");
request.send();

function extractUsersData(obj,fragment){
    let $user =  document.createElement("div");
    $user.classList.add("user");

    function createSubGroup(data,key,group){
        let $subGroup = document.createElement("div");
        $subGroup.classList.add("subGroup");
        let $subGroupName = document.createElement("div");
        $subGroupName.classList.add("subGroupName");
        $subGroupName.innerHTML = `${key}`;
        $subGroup.appendChild($subGroupName);
        for(key in data){
            let $row =  document.createElement("div");
            if(typeof data[key] == "string" || typeof data[key] == "number"){
                $row.innerHTML = `<span class="key">${key}:</span><span class="value">${data[key]}`;
                $row.classList.add("row");
                $subGroup.appendChild($row);
            }
            else if(typeof data[key] == "object") createSubGroup(data[key],key); 
        }
        group.appendChild($subGroup);
    }

    function createGroup(data,key){
        let $group = document.createElement("div");
        $group.classList.add("group");
        let $groupName = document.createElement("div");
        $groupName.classList.add("groupName");
        $groupName.innerHTML = `${key}`;
        $group.appendChild($groupName);
        for(key in data){
            let $row =  document.createElement("div");
            if(typeof data[key] == "string" || typeof data[key] == "number"){
                $row.innerHTML = `<span class="key">${key}:</span><span class="value">${data[key]}`;
                $row.classList.add("row");
                $group.appendChild($row);
            }
            else if(typeof data[key] == "object") createSubGroup(data[key],key,$group); 
        }
        $user.appendChild($group);
    }

    function createRows(data){
        for(key in data){
            let $row =  document.createElement("div");
            if(typeof data[key] == "string" || typeof data[key] == "number"){
                $row.innerHTML = `<span class="key">${key}:</span><span class="value">${data[key]}`;
                $row.classList.add("row");
                $user.appendChild($row);
            }
            else if(typeof data[key] == "object") createGroup(data[key],key); 
        }
    }
    createRows(obj);
    fragment.appendChild($user);
}

function printUsers(json){
    let arr = JSON.parse(json),
    $fragment = document.createDocumentFragment();
    arr.forEach(obj=> extractUsersData(obj,$fragment));
    $users.appendChild($fragment); 
}

showUsers(request)
    .then(response=>printUsers(response))
    .catch(err=>{
        let $err = document.createElement("span");
        $err.classList.add("error");
        $err.innerText = err;
        $users.appendChild($err);
    });