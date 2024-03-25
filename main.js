var url = "http://localhost:3000/comments"; // Thay đổi URL cho phù hợp với API Comments
var listGlobal;

function Load() {
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (comments) {
            listGlobal = comments;
            comments.sort(compare);
            var tbody = document.getElementById('tbody');
            tbody.innerHTML = "";
            for (const comment of comments) {
                tbody.innerHTML += (ConvertFormCommentToRow(comment));
            }
        });
}

function compare(a, b) {
    if (parseInt(a.id) > parseInt(b.id)) {
        return 1;
    }
    return -1;
}

function getMaxID() {
    var ids = listGlobal.map(element => {
        return element.id
    });
    return Math.max(...ids);
}

function Delete(id) {
    fetch(url + "/" + id, {
        method: 'DELETE'
    }).then(Load);
}

function Edit(id, data) {
    fetch(url + "/" + id, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(Load);
}

function Save() {
    var id = parseInt(document.getElementById('id').value);
    if (isNaN(id)) {
        let newItem = {
            id: (getMaxID() + 1) + "",
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            body: document.getElementById('body').value,
        }
        Create(newItem);
    } else {
        let ids = listGlobal.map(element => {
            return element.id
        });
        let checkexist = ids.includes(id + "");
        if (checkexist) {
            let editItem = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                body: document.getElementById('body').value,
            }
            Edit(id, editItem);
        } else {
            let newItem = {
                id: id + "",
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                body: document.getElementById('body').value,
            }
            Create(newItem);
        }
    }
}

function Create(data) {
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(Load);
}

function ConvertFormCommentToRow(comment) {
    let string = '<tr>'
    string += '<td>' + comment.id + '</td>'
    string += '<td>' + comment.name + '</td>'
    string += '<td>' + comment.email + '</td>'
    string += '<td>' + comment.body + '</td>'
    string += '<td><button onclick="Delete(' + comment.id + ')">Delete</button></td>'
    string += '</tr>'
    return string;
}
