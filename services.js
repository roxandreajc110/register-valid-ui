var xmlhttp;
var urlUser = "http://localhost:8080/api/user/";
var urlProccesedUser = "http://localhost:8080/api/user/updateProcessed";
var data;
var usersToProcess = [];

function initIndex() {
    xmlhttp = new XMLHttpRequest();
    $('#msnResponse').html("");
}

function initList() {
    xmlhttp = new XMLHttpRequest();
    getUsers();
}

function register() {
    if (document.getElementById('form').checkValidity()) {
        var user = {};
        user.name = document.getElementById("name").value;
        user.surname = document.getElementById("surname").value;
        var obj = JSON.stringify(user);
        xmlhttp.open('POST', urlUser, true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
        xmlhttp.send(obj);
        xmlhttp.onreadystatechange = function () {
            $('#msnResponse').html("");
            if (xmlhttp.readyState == 4 && xmlhttp.status == 201) {
                $('#msnResponse').append("Usuario creado exitosamente.")
            } else {
                if (xmlhttp.responseText != null) {
                    $('#msnResponse').append(xmlhttp.responseText)
                } else {
                    $('#msnResponse').append("Ha ocurrido un error. Por favor intentelo nuevamente. ")
                }
            }
        };
    }
}

function getUsers() {
    xmlhttp.open('GET', urlUser, true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xmlhttp.send(null);
    xmlhttp.onreadystatechange = function () {
        $('#msnResponse').html("");
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if (xmlhttp.responseText != null && xmlhttp.responseText.length > 0) {
                data = JSON.parse(xmlhttp.responseText);
                constructTable($('#table')[0], JSON.parse(xmlhttp.responseText));
            } else {
                $('#msnResponse').append("No hay usuarios registrados.");
            }
        } else {
            if (xmlhttp.responseText != null) {
                $('#msnResponse').append(xmlhttp.responseText)
            } else {
                $('#msnResponse').append("Ha ocurrido un error. Por favor intentelo nuevamente. ");
            }
        }
    };
}

function constructTable(selector, list) {
    var cols = Headers(list, selector);
    for (var i = 0; i < list.length; i++) {
        var row = $('<tr/>');
        for (var colIndex = 0; colIndex < cols.length; colIndex++) {
            var val = list[i][cols[colIndex]];
            if (val == null) {
                val = "";
            }
            if (colIndex == cols.length - 1) {
                var checked = "";
                if (val == true) {
                    checked = "checked disabled";
                }
                val = "<input type='checkbox' id='" + i + "' name='check" + i + "' value='" + val + "'" + checked + " onclick='onChangeCheckProcessed(this)'>";
            }
            row.append($('<td/>').html(val));
        }
        $(selector).append(row);
    }
}

function Headers(list, selector) {
    var columns = [];
    var header = $('<tr/>');
    for (var i = 0; i < list.length; i++) {
        var row = list[i];
        for (var k in row) {
            if ($.inArray(k, columns) == -1) {
                columns.push(k);
                header.append($('<th/>').html(k));
            }
        }
    }
    $(selector).append(header);
    return columns;
}

function onChangeCheckProcessed(event) {
    var idSelected = data[event.id].id;
    if (event.checked) {
        if (!usersToProcess.find(user => user.id == idSelected)) {
            usersToProcess.push({
                "id": data[event.id].id
            })
        }
    } else if (!event.checked) {
        const index = usersToProcess.findIndex(user => user.id == idSelected);
        if (index !== undefined && index >= 0) {
            usersToProcess.splice(index, 1);
        }
    }
}

function processUsers() {
    $('#msnResponse').html("");
    if (usersToProcess.length > 0) {
        xmlhttp.open('POST', urlProccesedUser, true);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
        var obj = JSON.stringify({
            'listUserDto': usersToProcess
        });
        xmlhttp.send(obj);
        xmlhttp.onreadystatechange = function () {
            $('#msnResponse').html("");
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                if (xmlhttp.responseText != null) {
                    const response = JSON.parse(xmlhttp.responseText);
                    $('#msnResponse').append(response.message);
                } else {
                    $('#msnResponse').append("No hay usuarios registrados.");
                }
                $('#table').html("");
                getUsers();
				usersToProcess = [];
            } else {
                if (xmlhttp.responseText != null) {
                    $('#msnResponse').append(xmlhttp.responseText)
                } else {
                    $('#msnResponse').append("Ha ocurrido un error. Por favor intentelo nuevamente. ");
                }
            }
        };
    } else {
        $('#msnResponse').append("No hay usuarios para procesar.")
    }
}
