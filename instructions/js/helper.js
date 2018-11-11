function addEvent(action, index, position) {
    if (!assignment.events) {
        assignment.events = [];
    }
    var event = {
        "timestamp": Math.round(new Date() / 1000),
        "action": action,
        "targetIndex": index.toString(),
        "position": position // only applicable to certain actions
    };
    assignment.events.push(event);
}

function preload(imageArray, index) {
    index = index || 0;
    if (imageArray && imageArray.length > index) {
        preloaded_images[index] = new Image();
        preloaded_images[index].onload = function () {
            addEvent("image loaded", index);
            preload(imageArray, index + 1);
        };
        preloaded_images[index].onerror = function () {
            addEvent("image fails to load", index);
            alert("Fail when loading images, please contact whom it concerned.");
        };
        preloaded_images[index].src = imageArray[index].url;
        if (index === 0) {
            // display when the first image is loaded
            polyLabeling = new PolyLabeling({
                url: preloaded_images[current_index].src
            });
            polyLabeling.updateImage(preloaded_images[current_index].src);
        }
    } else {
        $("#prev_btn").attr("disabled", false);
        $("#next_btn").attr("disabled", false);
        console.log("finish preloading all images.");

    }
}
function saveLabels() {
    polyLabeling.submitLabels();
    image_list[current_index].labels = polyLabeling.output_labels;
}

function updateProgress() {

    var completed = (current_index + 1).toString() + "/" + assignment.taskSize.toString();
    if ($("#pagination_control")) {
        var progress = "";

        progress += '<div class="text-muted" id="progress_percentage">' + completed + '</div>';
        $("#progress_percentage").remove();
        $("#pagination_control").append(progress);
    }
}

function submitAssignment() {
    polyLabeling.submitLabels();
    //console.log(ratio);
    //console.log("output", polyLabeling.output_labels);
    image_list[current_index].labels = polyLabeling.output_labels;
    var x = new XMLHttpRequest();
    x.onreadystatechange = function () {
        if (x.readyState === 4) {
            //console.log(x.response);
        }
    };
    assignment.images = image_list;
    assignment.numLabeledImages = current_index + 1;
    assignment.userAgent = navigator.userAgent;
    console.log(assignment);

    x.open("POST", "/label/lane/postSubmission");
    x.send(JSON.stringify(assignment));
}

function submitLog() {
    var x = new XMLHttpRequest();
    x.onreadystatechange = function () {
        if (x.readyState === 4) {
            console.log(x.response)
        }
    };
    assignment.images = image_list;
    assignment.numLabeledImages = current_index + 1;
    assignment.userAgent = navigator.userAgent;

    x.open("POST", "/label/lane/postLog");
    x.send(JSON.stringify(assignment));
}

function updateCategory(){
            //var category = assignment.category;
    var category = Catelist;
    var select = document.getElementById("category_select");
    select.setAttribute("size", Catelist.length);
    if (category.length !== 0) {
        for (var i = 0; i < category.length; i++) {
            var tmp = category[i];
            if (category[i]) {
                $("select#category_select").append("<option>" + category[i] + "</option>");
            }
        }
        $("#category_select").val(category[0]);
        document.getElementById("name_select").setAttribute("size", Featurelist.length);
        for(var j = 0; j < Featurelist.length; j++)
            $("select#name_select").append("<option>" + Featurelist[j] + "</option>");
        $("#name_select").val(Featurelist[0]);
        document.getElementById("dir_select").setAttribute("size", Dirlist.length);
        for(var j = 0; j < Dirlist.length; j++)
            $("select#dir_select").append("<option>" + Dirlist[j] + "</option>");
        $("#dir_select").val(Dirlist[0]);
    }
}

function loadAssignment() {
    var x = new XMLHttpRequest();
    x.onreadystatechange = function () {
        if (x.readyState === 4) {
            //console.log(x.response);
            assignment = JSON.parse(x.response);
            image_list = assignment.images;
            addEvent("start labeling", current_index);
            assignment.startTime = Math.round(new Date() / 1000);
            current_index = 0;
            // preload images
            preload(image_list);
            updateCategory();
            getIPAddress();
            updateProgress();

            for (var idx in image_list) {
                var labels = image_list[idx].labels;
                for (var key in labels) {
                    if (labels.hasOwnProperty(key)) {
                        var label = labels[key];
                        num_poly = num_poly + 1;
                    }
                }
            }
            $("#poly_count").text(num_poly);
        }
    };

    var searchParams = new URLSearchParams(window.location.search);
    var task_id = searchParams.get('task_id');
    var project_name = searchParams.get('project_name');

    var request = JSON.stringify({
        "assignmentId": task_id,
        "projectName": project_name
    });
    x.open("POST", "/label/lane/requestSubmission");
    x.send(request);
}

function getIPAddress() {
    $.getJSON('//ipinfo.io/json', function (data) {
        assignment.ipAddress = data;
    });
}