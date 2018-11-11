(function () {

    var polylist = [];
    var main_canvas = document.getElementById("main_canvas");
    var ctx = main_canvas.getContext("2d");
    var hidden_canvas = document.getElementById("hidden_canvas");
    var hidden_ctx = hidden_canvas.getContext("2d");

    var temp_canvas = document.getElementById("temp_canvas");
    var temp_ctx = temp_canvas.getContext("2d");

    var target_poly = -1;
    var label_showtime = 1;
    var getInVertex = false, getInPoly = false;
    var state, style_width, style_height;
    var ShowMid = true;
    var MaxID = 0;
    var canvas_scale = 1;

    var MIN_DIS = 6;
    var VERTEX = 1;
    var MID_VERTEX = 2;
    var MAX_DIS = 10000;
    var VERTEX_FILL = "rgb(100,200,100)";
    var MID_VERTEX_FILL = "rgb(200,100,100)";
    var MID_CONTROL_POINT = "rgba(233, 133, 166, 0.7)";
    var LINE_COLOR = "rgb(100,0,100)";
    var BEZIER_COLOR = "rgba(200,200,100,0.7)";
    var SELECT_COLOR = "rgba(150,0,120,0.5)";
    var ALPHA = 0.3;


    function calcu_dis(point_1, point_2) {
        return Math.abs(point_1[0] - point_2[0]) +
            Math.abs(point_1[1] - point_2[1]);
    }
    function compare(v1, v2) {
        if (v1 < v2) return -1;
        else if (v1 > v2) return 1;
        else return 0;
    }
    function DeletePolyfromPolylist(poly) {
        var index = poly.list_index;
        polylist.splice(index, 1);
        addEvent("deletePoly", poly.id);
        num_poly -= 1;
        $("#poly_count").text(num_poly);

        for (var i = index; i < polylist.length; i++) {
            polylist[i].list_index--;
        }
    }

    function ResizeCanvas() {

        ratio = parseFloat(window.innerWidth / (1.35 * source_image.width));
        if (parseFloat(window.innerHeight / (1.35 * source_image.height)) < ratio)
            ratio = parseFloat(window.innerHeight / (1.35 * source_image.height));
        ratio = parseFloat(ratio.toFixed(6));

        style_width = Math.round(source_image.width * ratio);
        style_height = Math.round(source_image.height * ratio);
        console.log(style_width, style_height);
        

        main_canvas.style.width = style_width + "px";
        main_canvas.style.height = style_height + "px";
        hidden_canvas.style.width = style_width + "px";
        hidden_canvas.style.height = style_height + "px";
        temp_canvas.style.width = style_width + "px";
        temp_canvas.style.height = style_height + "px";

        main_canvas.height = style_height * 2;
        main_canvas.width = style_width * 2;
        hidden_canvas.height = style_height * 2;
        hidden_canvas.width = style_width * 2;
        temp_canvas.height = style_height * 2;
        temp_canvas.width = style_width * 2;

        ctx.scale(2, 2);
        temp_ctx.scale(2, 2);
        hidden_ctx.scale(2, 2);

    }

    function calcu_center(poly) {
        var x = 0, y = 0;
        for (var i = 0; i < poly.num; i++) {
            x += poly.p[i][0];
            y += poly.p[i][1];
        }
        return [Math.round(x / poly.num), Math.round(y / poly.num)];
    }

    function IncHandler() {
        canvas_scale = canvas_scale << 1;
        if (canvas_scale === 2)
            $("#decrease_btn").attr("disabled", false);
        if (canvas_scale === 4) {
            $("#increase_btn").attr("disabled", true);
        }

        style_width = style_width << 1;
        style_height = style_height << 1;

        main_canvas.style.width = style_width + "px";
        main_canvas.style.height = style_height + "px";
        temp_canvas.style.width = style_width + "px";
        temp_canvas.style.height = style_height + "px";
        hidden_canvas.style.width = style_width + "px";
        hidden_canvas.style.height = style_height + "px";
        document.getElementById("canvas_container").style.width=style_width + 200 + "px";
        document.getElementById("canvas_container").style.height=style_height + 200 + "px";
        document.getElementById("canvas_container").style.margin="10px";
        //1, 2: 2
        //4: 4
        if (canvas_scale > 2) { // 4
            main_canvas.height = main_canvas.height << 1;
            main_canvas.width = main_canvas.width << 1;
            temp_canvas.height = temp_canvas.height << 1;
            temp_canvas.width = temp_canvas.width << 1;
            hidden_canvas.height = hidden_canvas.height << 1;
            hidden_canvas.width = hidden_canvas.width << 1;

            ctx.scale(canvas_scale, canvas_scale);
            hidden_ctx.scale(canvas_scale, canvas_scale);
            temp_ctx.scale(canvas_scale, canvas_scale);
        }

        polyLabeling.redraw();
        polyLabeling.hidden_redraw();
    }

    function DecHandler() {
        canvas_scale = canvas_scale >> 1;

        if (canvas_scale === 1)
            $("#decrease_btn").attr("disabled", true);
        if (canvas_scale === 2)
            $("#increase_btn").attr("disabled", false);

        style_width = style_width >> 1;
        style_height = style_height >> 1;
        main_canvas.style.width = style_width + "px";
        main_canvas.style.height = style_height + "px";
        temp_canvas.style.width = style_width + "px";
        temp_canvas.style.height = style_height + "px";
        hidden_canvas.style.width = style_width + "px";
        hidden_canvas.style.height = style_height + "px";

        document.getElementById("canvas_container").style.width= style_width + 200 + "px";
        document.getElementById("canvas_container").style.height=style_height + 200 + "px";
        document.getElementById("canvas_container").style.margin="10px";

        if(canvas_scale === 1)
            document.getElementById("canvas_container").style.width= "0px";
            document.getElementById("canvas_container").style.height = "0px";

        if (canvas_scale >= 2) { //4
            main_canvas.height = main_canvas.height >> 1;
            main_canvas.width = main_canvas.width >> 1;
            temp_canvas.height = temp_canvas.height >> 1;
            temp_canvas.width = temp_canvas.width >> 1;

            hidden_canvas.height = hidden_canvas.height >> 1;
            hidden_canvas.width = hidden_canvas.width >> 1;

            ctx.scale(canvas_scale, canvas_scale);
            hidden_ctx.scale(canvas_scale, canvas_scale);
            temp_ctx.scale(canvas_scale, canvas_scale);
        }

        polyLabeling.redraw();
        polyLabeling.hidden_redraw();
    }


    this.PolyLabeling = (function () {
        function PolyLabeling(options) {

            this.options = options;
            $('#main_canvas').css({
                "background-image": "url('" + this.options.url + "')",
                "cursor": "crosshair"
            });
            // Start listening to events happening in the main panel
            return this.eventController();
        }

        PolyLabeling.prototype.updateImage = function (url) {
            source_image = new Image();
            source_image.src = url;
            this.options.url = url;
            var polyLabeling = this;
            $('#main_canvas').css({
                "background-image": "url('" + url + "')",
                "cursor": "crosshair"
            });
            if (source_image.complete) {
                ResizeCanvas();
                polyLabeling.replay();
            } else {
                source_image.onload = function () {
                    ResizeCanvas();
                    polyLabeling.replay();
                }
            }
        };

        PolyLabeling.prototype.DrawSelectVertex = function (mode, pos) {
            var color = VERTEX_FILL;
            if (mode === MID_VERTEX) color = MID_VERTEX_FILL;
            temp_ctx.beginPath();
            temp_ctx.arc(pos[0], pos[1], 6 / canvas_scale, 0,
                2 * Math.PI, false);
            temp_ctx.closePath();
            temp_ctx.fillStyle = color;
            temp_ctx.fill();
        }

        PolyLabeling.prototype.submitLabels = function () {
            this.output_labels = [];
            var tmp = [], poly, output;
            for (var key in polylist) {
                poly = polylist[key];
                if (ratio) {
                    tmp = [];
                    for (var i = 0; i < poly.num; i++) {
                        tmp[i] = [parseFloat((poly.p[i][0] / ratio).toFixed(6)),
                            parseFloat((poly.p[i][1] / ratio).toFixed(6))];
                    }
                    //console.log(ratio);
                }
                output = {
                    id: poly.id.toString(),
                    category: poly.category,
                    position: {
                        density: poly.density,
                        dir: poly.dir,
                        list_index: poly.list_index,
                        p: tmp,
                        num: poly.num,
                        BezierOffset: poly.BezierOffset,
                        beziernum: poly.beziernum
                    }
                };
                //console.log(output);
                this.output_labels.push(output);
            }
        };
        PolyLabeling.prototype.redraw = function (exception) {
            var poly, pos;

            ctx.clearRect(0, 0,
                main_canvas.width, main_canvas.height);

            if (polylist) {
                for (key in polylist) {
                    if (exception && polylist[key] == exception) {
                        continue;
                    } else {
                        poly = polylist[key];
                        poly.drawPoly(poly.num, ctx);
                        if (label_showtime) {
                            pos = calcu_center(poly);
                            poly.fillLabel(pos, ctx);
                        }
                    }
                }
            }

            if (target_poly !== -1 && state === 'select') {
                target_poly.drawPoly(target_poly.num, ctx, true);
                pos = calcu_center(target_poly);
                target_poly.fillLabel(pos, ctx, true);
            }

        };

        PolyLabeling.prototype.hidden_redraw = function () {
            var poly;
            hidden_ctx.clearRect(0, 0,
                hidden_canvas.width, hidden_canvas.height);
            if (polylist) {
                for (key in polylist) {
                    poly = polylist[key];
                    poly.drawHiddenPoly(poly.num);
                }
            }
        };

        PolyLabeling.prototype.clearGlobals = function () {
            getInVertex = false;
            getInPoly = false;
            this.resize = false;
            target_poly = -1;
            state = 'free';
            //$("#submit_btn").attr("disabled", false);
        };

        PolyLabeling.prototype.clearAll = function () {
            ctx.clearRect(0, 0,
                main_canvas.width, main_canvas.height);
            hidden_ctx.clearRect(0, 0,
                hidden_canvas.width, hidden_canvas.height);
    
            polylist = [];
            MaxID = 0;
            label_showtime = 1;
            canvas_scale = 1;
            $("#label_btn").text("Hide Label (L)");
            //magnify = false;
            $("#decrease_btn").attr("disabled", true);
            this.clearGlobals();
        };

        PolyLabeling.prototype.replay = function () {
            var polyLabeling;
            polyLabeling = this;

            //console.log(ratio);
            if (typeof(ratio) === "undefined" || ratio < 0) {
                alert("Error when preloading. Please refresh page.");
                return;
            }
            polylist = [];
            var poly, label, max_id = -1;
            var label_list = image_list[current_index].labels;

            ctx.clearRect(0, 0, main_canvas.width, main_canvas.height);
            hidden_ctx.clearRect(0, 0,
                hidden_canvas.width, hidden_canvas.height);
            if (label_list) {
                for (var key in label_list) {
                    if (!label_list.hasOwnProperty(key)) continue;
                    label = label_list[key];
                    poly = new Poly(label.category, parseInt(label.id));
                    poly.bbox = [10000, 10000, -1, -1];
                    poly.list_index = label.position.list_index;
                    if (poly.id > max_id) max_id = poly.id;
                    for (var i = 0; i < label.position.num; i++) {
                        poly.p.push([parseFloat((label.position.p[i][0] * ratio).toFixed(6)),
                            parseFloat((label.position.p[i][1] * ratio).toFixed(6))]);
                        if(poly.p[i][0] < poly.bbox[0]) poly.bbox[0] = poly.p[i][0];
                        if(poly.p[i][0] > poly.bbox[2]) poly.bbox[2] = poly.p[i][0];

                        if(poly.p[i][1] < poly.bbox[1]) poly.bbox[1] = poly.p[i][1];
                        if(poly.p[i][1] > poly.bbox[3]) poly.bbox[3] = poly.p[i][1];

                        if (i > 0) {
                            poly.hidden_p[i - 1] =
                                [(poly.p[i][0] + poly.p[i - 1][0]) / 2,
                                    (poly.p[i][1] + poly.p[i - 1][1]) / 2];
                        }
                    }
                    poly.hidden_p[label.position.num - 1] =
                        [(poly.p[label.position.num - 1][0] + poly.p[0][0]) / 2,
                            (poly.p[label.position.num - 1][1] + poly.p[0][1]) / 2];

                    poly.num = label.position.num;
                    poly.BezierOffset = label.position.BezierOffset;
                    if(typeof(label.position.density) !== "undefined")
                        poly.density = label.position.density;
                    if(typeof(label.position.dir) !== "undefined")
                        poly.dir = label.position.dir;
                    poly.beziernum = label.position.beziernum;
                    poly.ComputeDegree();
                    polylist[poly.list_index] = poly;
                }
            }
            polyLabeling.redraw();
            polyLabeling.hidden_redraw();
            MaxID = max_id + 1;
        };
        PolyLabeling.prototype.SelectPoly = function (clickX, clickY) {
            var r = 2, pixelData;
            if (canvas_scale > 2) r = canvas_scale;
            pixelData =
                hidden_ctx.getImageData(r * clickX, r * clickY, 1, 1).data;
            var selected_poly = -1;
            var id;
            if (pixelData[0] != 0 && pixelData[3] == 255) {
                id = pixelData[0] - 1;
                selected_poly = polylist[id];
            }
            return selected_poly;
        };
        PolyLabeling.prototype.SelectPolyVertex = function (clickX, clickY) {

            var r = 2, pixelData;
            if (canvas_scale > 2) r = canvas_scale;
            pixelData =
                hidden_ctx.getImageData(r * clickX, r * clickY, 1, 1).data;

            var selected_vertex = -1;
            if (pixelData[0] === 0) return selected_vertex;
            if (pixelData[2] === 0 && pixelData[1] === 0)
                return selected_vertex;

            //mid
            var y = pixelData[1];
            var z = pixelData[2];

            selected_vertex = ((y << 8) | z) - 1;
            //console.log(selected_vertex);
            return selected_vertex;
        };

        PolyLabeling.prototype.eventController = function () {
            var polyLabeling;
            var poly, selected_poly;
            var cnt = 0;
            var IfGenarate = false;
            var min_poly, min_point, min_mid_point, last_poly = -1;
            var curpos = [];
            var interval = null, enable = null;
            polyLabeling = this;
            state = 'free';

            function compute_position(e) {
                var bbox = main_canvas.getBoundingClientRect();
                var mouseX = parseFloat(((e.clientX - bbox.left)
                * (style_width / bbox.width)).toFixed(6));
                var mouseY = parseFloat(((e.clientY - bbox.top
                ) * (style_height / bbox.height)).toFixed(6));

                mouseX = parseFloat((mouseX / canvas_scale).toFixed(6));
                mouseY = parseFloat((mouseY / canvas_scale).toFixed(6));
                if (state == 'free' || state == 'select') {
                    if (mouseX < 0 || mouseY < 0 ||
                        mouseX > style_width || mouseY > style_height)
                        return [-1, -1];
                } else {
                    if (mouseX < 0) mouseX = 0.000000;
                    if (mouseY < 0) mouseY = 0.000000;
                    if (mouseX > style_width / canvas_scale)
                        mouseX = style_width / canvas_scale;
                    if (mouseY > style_height / canvas_scale)
                        mouseY = style_height / canvas_scale;
                }
                return [mouseX, mouseY];
            }

            function MouseDownHandler(e) {
                var Clickpos = compute_position(e);
                var clickX = Clickpos[0], clickY = Clickpos[1];
                if (clickX < 0 || clickY < 0) return;

                if (e.which === 1) {
                    if (state == 'free') cnt = 0;
                    if (state == 'select'
                        && polyLabeling.resize == 0) {
                        polyLabeling.clearGlobals();
                        polyLabeling.redraw();
                        cnt = 0;
                        state = 'free';
                    }
                    if (state == 'select') {
                        if (polyLabeling.resize > 0) {
                            state = 'select_resize';
                        }

                    } else if (cnt === 0 && state == 'free') {
                        target_poly = -1;
                        selected_poly =
                                polyLabeling.SelectPoly(clickX, clickY);
                        if (polyLabeling.resize == 0) {
                            state = 'draw';
                            var cat_idx = document.getElementById("category_select").selectedIndex;
                            var feat_idx = document.getElementById("name_select").selectedIndex;
                            var dir_idx = document.getElementById("dir_select").selectedIndex;
                            var cate = Catelist[cat_idx];
                            poly = new Poly(cate,
                                    MaxID);
                            poly.density = Featurelist[feat_idx];
                            poly.dir = Dirlist[dir_idx];

                            poly.list_index = polylist.length;
                            getInVertex = false;
                            getInPoly = false;
                        
                            poly.update(clickX, clickY, 0);
                            cnt++;
                            poly.num++;
                            
                        } else {
                            state = 'resize';
                        }
                    } else {
                        if (state == 'finish_draw') {//closing
                            window.addEventListener('dblclick', DoubleClick, false);
                            poly.num = cnt;
                            poly.hidden_p[cnt - 1] =
                                [(poly.p[cnt - 1][0] +
                                poly.p[0][0]) / 2,
                                    (poly.p[cnt - 1][1] +
                                    poly.p[0][1]) / 2];
                            poly.p.splice(cnt, 1);
                            poly.hidden_p.splice(cnt, 1);
                            poly.degree.splice(cnt, 1);

                            if (poly.num == 1) poly.hidden_p = [];
                            cnt = 0;

                            polylist.push(poly);
                            
                            MaxID += 1;
                            num_poly += 1;
                            $("#poly_count").text(num_poly);
                        
                            temp_ctx.clearRect(0, 0, temp_canvas.width, temp_canvas.height);

                            //poly.drawPoly(poly.num, ctx);
                            polyLabeling.clearGlobals();
                            poly.drawPoly(poly.num, ctx, true);
                            target_poly = poly;
                            state = 'select';
                            if(label_showtime){
                                var center = calcu_center(poly)
                                poly.fillLabel(center, ctx, true);
                            }
                            poly.RecomputeBbox();
                            poly.drawHiddenPoly(poly.num);

                        } else if (state == 'draw') {
                            var dis = calcu_dis(poly.p[cnt - 1], [clickX, clickY]);
                            selected_poly =
                                polyLabeling.SelectPoly(clickX, clickY);
                            if (dis > 2 / canvas_scale) {
                                poly.update(clickX, clickY, cnt);
                                cnt++;
                                poly.num++;
                                window.removeEventListener('dblclick', DoubleClick, false); 
                            }
                        }
                    }
                }

                return true;
            }

            function mouseDown(e) {
                if (polyLabeling.resize > 0) {
                    MouseDownHandler(e);
                    return;
                }
                var pos = compute_position(e);
                if (pos[0] < 0 || pos[1] < 0) return;

                var selected_poly = polyLabeling.SelectPoly(pos[0], pos[1]);

                if (state == 'select') {
                    //new draw or deselect/change selection
                    clearTimeout(interval);
                    interval = setTimeout(function () {
                        MouseDownHandler(e);
                    }, 300);
                    
                } else if (state == 'free' && selected_poly !== -1) {
                    //not background, judge if is dbclick
                    clearTimeout(interval);
                    interval = setTimeout(function () {
                        MouseDownHandler(e);
                    }, 300);
                } else {
                    MouseDownHandler(e);
                }
            }

            function drawPolyHandler(mouseX, mouseY) {
                poly.p[cnt] = [mouseX, mouseY];
                poly.num = cnt;
                curpos = [mouseX, mouseY];
                var current_dis = MIN_DIS / canvas_scale;

                if (calcu_dis(curpos, poly.p[0]) <= current_dis && (cnt > 1)) {
                    if (state == 'draw')
                        state = 'finish_draw';
                    temp_ctx.beginPath();
                    temp_ctx.arc(poly.p[0][0], poly.p[0][1],
                        6 / canvas_scale, 0, 2 * Math.PI, false);
                    temp_ctx.fillStyle = poly.colors(poly.id, 1);
                    temp_ctx.closePath();
                    temp_ctx.fill();
                    temp_ctx.beginPath();
                    temp_ctx.arc(poly.p[0][0], poly.p[0][1],
                        4 / canvas_scale, 0, 2 * Math.PI, false);
                    temp_ctx.fillStyle = VERTEX_FILL;
                    temp_ctx.closePath();
                    temp_ctx.fill();
                } else {
                    //keep drawing
                    if (state == 'draw') {
                        var tmpbbox = poly.bbox;
                        if (mouseX < poly.bbox[0]) tmpbbox[0] = mouseX;
                        if (mouseX > poly.bbox[2]) tmpbbox[2] = mouseX;

                        if (mouseY < poly.bbox[1]) tmpbbox[1] = mouseY;
                        if (mouseY > poly.bbox[3]) tmpbbox[3] = mouseY;
                        if(tmpbbox[0] < 4) tmpbbox[0] = 4;
                        if(tmpbbox[1] < 4) tmpbbox[1] = 4;
                        
                        temp_ctx.clearRect(tmpbbox[0]-4, tmpbbox[1]-4, 
                            tmpbbox[2]-tmpbbox[0]+8, tmpbbox[3]- tmpbbox[1]+8);
                        //temp_ctx.strokeRect(tmpbbox[0]-4, tmpbbox[1]-4, tmpbbox[2]-tmpbbox[0] + 2, tmpbbox[3]-tmpbbox[1] + 2);
                        poly.drawPoly(cnt + 1, temp_ctx);
                    }
                    if(cnt > 0){
                        temp_ctx.beginPath();
                        temp_ctx.arc(poly.p[0][0], poly.p[0][1],
                            4 / canvas_scale, 0, 2 * Math.PI, false);
                        temp_ctx.closePath();
                        temp_ctx.fillStyle = poly.colors(poly.id, 0.7)
                        temp_ctx.fill();
                    }
                }
            }

            function mousemoveHandler(mouseX, mouseY) {
                if (min_poly != -1) {
                    if (getInPoly == false) {
                        min_poly.showControlPoints(min_poly.num, temp_ctx);
                        min_poly.showControlPoints(min_poly.num, temp_ctx);
                        last_poly = min_poly;
                        getInPoly = true;
                    }
                    if (min_poly != last_poly) {
                        last_poly.clearControlPoints(last_poly.num, temp_ctx);
                        min_poly.showControlPoints(min_poly.num, temp_ctx);
                        last_poly = min_poly;
                    }

                    if (polyLabeling.resize == VERTEX) {
                        if (getInVertex == false) {
                            if (min_poly.num > min_point) {
                                getInVertex = true;
                                polyLabeling.DrawSelectVertex(polyLabeling.resize,
                                    min_poly.p[min_point]);
                            }
                        }
                    } else if (polyLabeling.resize == MID_VERTEX) {
                        if (getInVertex == false) {
                            if (min_poly.num > min_mid_point) {
                                getInVertex = true;
                                polyLabeling.DrawSelectVertex(polyLabeling.resize,
                                    min_poly.hidden_p[min_mid_point]);
                            }
                        }
                    } else {
                        if (getInVertex == true) {
                            getInVertex = false;
                            last_poly.clearControlPoints(last_poly.num, temp_ctx);
                        }
                    }
                } else {//undo
                    if (getInVertex == true) {
                        getInVertex = false;
                        polyLabeling.resize = 0;
                        last_poly.clearControlPoints(last_poly.num, temp_ctx);
                    }
                    if (getInPoly == true) {
                        getInPoly = false;
                        polyLabeling.resize = 0;
                        last_poly.clearControlPoints(last_poly.num, temp_ctx);
                        last_poly = -1;
                    }
                }
            }

            function mouseMove(e) {
                curpos = compute_position(e);
                if (curpos[0] < 0 || curpos[1] < 0) {
                    if (getInPoly === true) {
                        getInPoly = false;
                        getInVertex = false;
                        if(last_poly !== -1){
                            last_poly.clearControlPoints(last_poly.num, temp_ctx);
                        }
                    }
                    return;
                }
                var mouseX = curpos[0], mouseY = curpos[1];
                if (state == 'select' || state == 'free') {
                    polyLabeling.resize = 0;
                    min_poly = polyLabeling.SelectPoly(mouseX, mouseY);
                    if (state != 'select') {
                        min_point = polyLabeling.SelectPolyVertex(mouseX, mouseY);
                        //console.log(min_point);
                        if (min_point % 2 == 0) {
                            min_point = min_point / 2;
                            min_mid_point = -1;
                        } else if (min_point % 2 === 1 && min_point !== -1) {
                            min_mid_point = (min_point - 1) / 2;
                            min_point = -1;
                        } else {
                            min_point = -1;
                            min_mid_point = -1;
                        }
                    } else {
                        var min_dis = MAX_DIS;
                        var cur_dis = [];
                        min_poly = target_poly;
                        if (target_poly !== -1) {
                            for (var i = 0; i < target_poly.num; i++) {
                                cur_dis = [calcu_dis(curpos, target_poly.p[i]),
                                    calcu_dis(curpos, target_poly.hidden_p[i])];
                                if(i == target_poly.num - 1) cur_dis[1] = MAX_DIS;
                                if (cur_dis[1] < min_dis && ShowMid) {
                                    min_dis = cur_dis[1];
                                    min_mid_point = i;
                                    min_point = -1;
                                }
                                if (cur_dis[0] < min_dis) {
                                    min_dis = cur_dis[0];
                                    min_point = i;
                                    min_mid_point = -1;
                                }
                            }
                        }
                        if (min_dis >= 6 / canvas_scale) {
                            min_mid_point = -1;
                            min_point = -1;
                            min_poly = polyLabeling.SelectPoly(mouseX, mouseY);
                        }
                    }
                    
                    if (!ShowMid) min_mid_point = -1;

                    var vdis = MAX_DIS, mdis = MAX_DIS;

                    //double check
                    //console.log(min_point, min_mid_point);
                    if (min_point != -1 && min_poly.num > min_point)
                        vdis = calcu_dis(curpos, min_poly.p[min_point]);
                    if (min_mid_point != -1 && min_poly.num > min_mid_point)
                        mdis = calcu_dis(curpos,
                            min_poly.hidden_p[min_mid_point]);

                    if (min_point != -1 && min_mid_point == -1
                        && vdis < 6 / canvas_scale)
                        polyLabeling.resize = VERTEX;
                    else if (min_point == -1 && min_mid_point != -1 &&
                        mdis < 6 / canvas_scale)
                        polyLabeling.resize = MID_VERTEX;
                    else if (min_point != -1 && min_mid_point != -1) {
                        if (vdis < mdis && vdis < 6 / canvas_scale)
                            polyLabeling.resize = VERTEX;
                        else if (mdis <= vdis && mdis < 6 / canvas_scale)
                            polyLabeling.resize = MID_VERTEX;

                    } else
                        polyLabeling.resize = 0;

                    if (polyLabeling.resize == MID_VERTEX) {
                        if (min_poly.num <= min_mid_point || min_poly.num <= 0) {
                            polyLabeling.resize = 0;
                        } else if (min_poly.degree[min_mid_point] == 2 ||
                            min_poly.degree[(min_mid_point + 1) % min_poly.num] == 2) {
                            polyLabeling.resize = 0;
                        }
                    }

                    mousemoveHandler(mouseX, mouseY);

                } else if (state == 'draw') {
                    drawPolyHandler(mouseX, mouseY);
                } else if (state == 'finish_draw') {
                    if (calcu_dis(curpos, poly.p[0]) > MIN_DIS / canvas_scale) {
                        poly.p[cnt] = [mouseX, mouseY];
                        poly.num = cnt;
                        if (state == 'finish_draw')
                            state = 'draw';
                        poly.drawPoly(cnt + 1, temp_ctx);
                    }
                } else if (state == 'resize' || state == 'select_resize') {
                    selected_poly = polyLabeling.SelectPoly(mouseX, mouseY);
                    getInVertex = false;
                    getInPoly = false;
                    min_poly.clearControlPoints(min_poly.num, temp_ctx);
                    var tmpbbox = min_poly.bbox;
                    if (mouseX < min_poly.bbox[0]) tmpbbox[0] = mouseX;
                    if (mouseX > min_poly.bbox[2]) tmpbbox[2] = mouseX;

                    if (mouseY < min_poly.bbox[1]) tmpbbox[1] = mouseY;
                    if (mouseY > min_poly.bbox[3]) tmpbbox[3] = mouseY;
                    if(tmpbbox[0] < 2) tmpbbox[0] = 2;
                    if(tmpbbox[1] < 2) tmpbbox[1] = 2;

                    temp_ctx.clearRect(tmpbbox[0]-2, tmpbbox[1]-2, 
                        tmpbbox[2]+4-tmpbbox[0], tmpbbox[3]+4-tmpbbox[1]);
        
                    if (polyLabeling.resize == VERTEX) {
                        if (!IfGenarate) {
                            polyLabeling.redraw(min_poly);
                            IfGenarate = true;
                        }
                        min_poly.p[min_point] = [mouseX, mouseY];
                        min_poly.ChangeHiddenVertex(min_point);
                        min_poly.ChangeHiddenVertex(
                            (min_point - 1 + min_poly.num) % min_poly.num);

                        if (state == 'resize') {
                            min_poly.drawPoly(min_poly.num, temp_ctx);

                        } else if (state == 'select_resize') {
                            min_poly.drawPoly(min_poly.num, temp_ctx, true);
                        }

                    } else if (polyLabeling.resize == MID_VERTEX) {
                        if (!IfGenarate) {
                            min_poly.GenarateNewVertex(min_mid_point);
                            polyLabeling.redraw(min_poly);
                            IfGenarate = true;
                        }
                        min_poly.p[min_mid_point + 1] = [mouseX, mouseY];

                        min_poly.ChangeHiddenVertex(min_mid_point);
                        min_poly.ChangeHiddenVertex(
                            (min_mid_point + 1) % min_poly.num);
                        if (state == 'resize') {
                            min_poly.drawPoly(min_poly.num, temp_ctx);
                        } else if (state == 'select_resize') {
                            min_poly.drawPoly(min_poly.num, temp_ctx, true);
                        }
                    }
                }
                
            }

            function mouseUp(e) {
                if (state == 'resize' ||
                    state == 'select_resize') {
                    IfGenarate = false;
                    cnt = 0;
                    if (min_poly && min_poly != -1)
                        polylist[min_poly.list_index] = min_poly;

                    if (state == 'resize') {
                        temp_ctx.clearRect(0, 0, 
                            temp_canvas.width, temp_canvas.height);
                        if(!getInVertex){
                            min_poly.drawPoly(min_poly.num, ctx);
                        }
                        polyLabeling.clearGlobals();
                        polyLabeling.hidden_redraw();
                    } else {
                        temp_ctx.clearRect(0, 0, temp_canvas.width, temp_canvas.height);
                        state = 'select';
                        if(!getInVertex){
                            min_poly.drawPoly(min_poly.num, ctx, true);
                        }
                        polyLabeling.hidden_redraw();
                    }

                    min_poly.RecomputeBbox();
                    if(label_showtime){
                        var pos = calcu_center(min_poly);
                        if(state == 'select')
                            min_poly.fillLabel(pos, ctx, true);
                        else
                            min_poly.fillLabel(pos, ctx);
                    }

                    var tmp;
                    if (ratio) {
                        tmp = [];
                        for (var i = 0; i < min_poly.num; i++) {
                            tmp[i] = [parseFloat((min_poly.p[i][0] / ratio).toFixed(6)),
                                parseFloat((min_poly.p[i][1] / ratio).toFixed(6))];
                        }
                    }
                    addEvent("resize", min_poly.id, {
                        p: tmp,
                        num: min_poly.num,
                        BezierOffset: min_poly.BezierOffset,
                        beziernum: min_poly.beziernum
                    });
                } 
            }

            function KeyDown(e) {
                var keyID = e.KeyCode ? e.KeyCode : e.which;
                if (keyID === 27) {
                    if (state == 'draw') {
                        cnt = 0;
                        temp_ctx.clearRect(0, 0, temp_canvas.width, temp_canvas.height);
                        state = 'free';
                        window.addEventListener('dblclick', DoubleClick, false);
                        $('#toolhead').css("background-color", "#DDDDDD");
                        delete poly;
                    } else if (getInVertex == true &&
                        polyLabeling.resize == VERTEX) {
                        min_poly.clearControlPoints(min_poly.num, temp_ctx);
                        if (min_poly.degree[min_point] == 0)
                            min_poly.DeleteVertex(min_point);
                        else
                            min_poly.DeleteBezier(min_point);

                        cnt = 0;
                        if (min_poly.num > 1)
                            polylist[min_poly.list_index] = min_poly;

                        if (min_poly.num <= 1) {
                            if (target_poly == min_poly) {
                                target_poly = -1;
                                state = 'free';
                            }
                        }
                        if (state != 'select')
                            polyLabeling.clearGlobals();
                        else {
                            getInVertex = false;
                            getInPoly = false;
                            polyLabeling.resize = 0;
                        }
                        polyLabeling.redraw();
                        polyLabeling.hidden_redraw();

                    } else {
                        alert("Nothing to delete!");
                    }

                } else if (keyID === 66) {//B
                    if (getInVertex == true && polyLabeling.resize == MID_VERTEX) {
                        min_poly.clearControlPoints(min_poly.num, temp_ctx);
                        min_poly.AddBezier(min_mid_point);
                        cnt = 0;

                        if (state !== 'select')
                            polyLabeling.clearGlobals();
                        else {
                            getInVertex = false;
                            getInPoly = false;
                            polyLabeling.resize = 0;
                        }

                        polylist[min_poly.list_index] = min_poly;
                        polyLabeling.hidden_redraw();

                    } else {
                        alert("Can not add Bezier Curve here!");
                    }
                } else if (keyID === 72) {//H
                    if (ShowMid) {
                        ShowMid = false;
                        alert("Now the midpoints are invisiable, press <H> or" +
                            " <h> again to show them. You can not add points " +
                            "and curve until you press <H> or <h> again.");
                        polyLabeling.hidden_redraw();
                    }
                    else {
                        ShowMid = true;
                        alert("Now the midpoints are visiable, " +
                            "you can add points and curve freely. " +
                            "press <H> or <h> again to hide them.");
                        polyLabeling.hidden_redraw();
                    }
                } else if (keyID === 46 || keyID === 8) {
                    if (state !== 'draw' &&
                        getInVertex == true &&
                        polyLabeling.resize == VERTEX) {
                        min_poly.clearControlPoints(min_poly.num, temp_ctx);

                        if (min_poly.degree[min_point] == 0)
                            min_poly.DeleteVertex(min_point);
                        else
                            min_poly.DeleteBezier(min_point);
                        cnt = 0;
                        if (min_poly.num > 1)
                            polylist[min_poly.list_index] = min_poly;

                        if (min_poly.num <= 1) {
                            if (min_poly == target_poly) {
                                target_poly = -1;
                                state = 'free';
                            }
                        }
                        if (state != 'select')
                            polyLabeling.clearGlobals();
                        else {
                            getInVertex = false;
                            getInPoly = false;
                            polyLabeling.resize = 0;
                        }

                        polyLabeling.redraw();
                        polyLabeling.hidden_redraw();

                    } else if (state == 'select') {
                        if (target_poly != -1) {
                            target_poly.clearControlPoints(target_poly.num, temp_ctx);
                            DeletePolyfromPolylist(target_poly);
                            polyLabeling.clearGlobals();
                            polyLabeling.redraw();
                            polyLabeling.hidden_redraw();
                            cnt = 0;
                        } else {
                            alert("Please select the object you want to delete.");
                        }
                    } else if (state === 'draw') {
                        if (cnt > 0) {
                            poly.p.splice(cnt - 1, 1);
                            poly.degree.splice(cnt - 1, 1);
                            if (cnt > 1);
                            poly.hidden_p.splice(cnt - 2, 1);
                            cnt--;
                            poly.num--;
                            temp_ctx.clearRect(0, 0, temp_canvas.width, temp_canvas.height);
                            if (cnt == 0) {
                                state = 'free';
                            } else {
                                poly.drawPoly(poly.num, temp_ctx);
                            }
                        }
                        window.addEventListener('dblclick', DoubleClick, false);
                    } else {
                        alert("Nothing to delete!");
                    }
                } else if (keyID === 76) {
                    if (state == 'free' || state == 'select') {
                        if (label_showtime === 0) {
                            label_showtime = 1;
                            polyLabeling.redraw();
                            $("#label_btn").text("Hide Label (L)");
                            if (state === 'select') {
                                getInVertex = false;
                                getInPoly = false;
                                polyLabeling.resize = 0;
                            }
                        }
                        else {
                            label_showtime = 0;
                            polyLabeling.redraw();
                            $("#label_btn").text("Show Label (L)");
                            if (state === 'select') {
                                getInVertex = false;
                                getInPoly = false;
                                polyLabeling.resize = 0;
                            }
                        }
                    }
                } else if (keyID === 38) {//up
                    if (canvas_scale === 4) return;
                    IncHandler();
                } else if (keyID === 40) {//down
                    if (canvas_scale === 1) return;
                    DecHandler();
                }
            }

            function DoubleClick(e) {
                var pos = compute_position(e);
                var mouseX = pos[0], mouseY = pos[1];
                if (pos[0] < 0 || pos[1] < 0) {
                    if (state === 'select') {
                        polyLabeling.clearGlobals();
                        polyLabeling.redraw();
                    }
                    return;
                }
                //avoid user hit more than twice
                window.removeEventListener('mousedown', mouseDown, false);
                selected_poly = polyLabeling.SelectPoly(mouseX, mouseY);
                clearTimeout(interval);
                clearTimeout(enable);

                if (state == 'draw') {
                    if (cnt > 1 && poly
                        && calcu_dis(poly.p[cnt - 2], pos) > MIN_DIS) {
                        window.addEventListener('mousedown', mouseDown, false);
                        return;
                    }
                    cnt = 0;
                    state = 'free';
                    temp_ctx.clearRect(0, 0, temp_canvas.width, temp_canvas.height);
                }
                if (selected_poly !== -1) {
                    state = 'select';
                    cnt = 0;

                    if (selected_poly !== target_poly) {
                        target_poly = selected_poly;

                        var tmp, idx;
                        polyLabeling.redraw();
                        for (idx = 0; idx < Catelist.length; idx++) {
                            tmp = Catelist[idx];
                            if (tmp == selected_poly.category) {
                                $("#category_select").val(Catelist[idx]);
                                break;
                            }
                        }
                        $("#name_select").val(selected_poly.density);
                        $("#dir_select").val(selected_poly.dir);
                    }
                } else {
                    if(state === 'select') {
                        polyLabeling.clearGlobals();
                        polyLabeling.redraw();
                    }
                }

                enable = setTimeout(function () {
                    window.addEventListener('mousedown', mouseDown, false);
                }, 350);
            }

            window.addEventListener('keydown', KeyDown, true);
            window.addEventListener('mousedown', mouseDown, false);
            window.addEventListener('mousemove', mouseMove, false);
            window.addEventListener('mouseup', mouseUp, false);
            window.addEventListener('dblclick', DoubleClick, false);

            $("#toolbox").mouseover(function () {
                window.removeEventListener('mousedown', mouseDown, false);
                window.removeEventListener('mousemove', mouseMove, false);
                window.removeEventListener('mouseup', mouseUp, false);
                window.removeEventListener('dblclick', DoubleClick, false);
            });
            $("#toolbox").mouseleave(function () {
                window.addEventListener('mousedown', mouseDown, false);
                window.addEventListener('mousemove', mouseMove, false);
                window.addEventListener('mouseup', mouseUp, false);
                window.addEventListener('dblclick', DoubleClick, false);
            });

            $("#pagination_control").mouseover(function () {
                window.removeEventListener('mousedown', mouseDown, false);
                window.removeEventListener('mousemove', mouseMove, false);
                window.removeEventListener('mouseup', mouseUp, false);
                window.removeEventListener('dblclick', DoubleClick, false);
            });
            $("#pagination_control").mouseleave(function () {
                window.addEventListener('mousedown', mouseDown, false);
                window.addEventListener('mousemove', mouseMove, false);
                window.addEventListener('mouseup', mouseUp, false);
                window.addEventListener('dblclick', DoubleClick, false);
            });
            $("#header").mouseover(function () {
                window.removeEventListener('mousedown', mouseDown, false);
                window.removeEventListener('mousemove', mouseMove, false);
                window.removeEventListener('mouseup', mouseUp, false);
                window.removeEventListener('dblclick', DoubleClick, false);
            });
            $("#header").mouseleave(function () {
                window.addEventListener('mousedown', mouseDown, false);
                window.addEventListener('mousemove', mouseMove, false);
                window.addEventListener('mouseup', mouseUp, false);
                window.addEventListener('dblclick', DoubleClick, false);
            });

            $("#delete_btn").click(function () {
                //ctx.putImageData(lastScene,0,0);
                if (target_poly != -1) {
                    DeletePolyfromPolylist(target_poly);
                    polyLabeling.clearGlobals();
                    polyLabeling.redraw();
                    polyLabeling.hidden_redraw();
                    cnt = 0;
                } else {
                    alert("Please select the object you want to delete.");
                }
            });
            $("#increase_btn").click(function () {
                IncHandler();
            });

            $("#decrease_btn").click(function () {
                DecHandler();
            });

            $("#label_btn").click(function () {
                if (state == 'free' || state == 'select') {
                    if (label_showtime === 0) {
                        label_showtime = 1;
                        polyLabeling.redraw();
                        $("#label_btn").text("Hide Label (L)");
                        if (state === 'select') {
                            getInVertex = false;
                            getInPoly = false;
                            polyLabeling.resize = 0;
                        }
                        
                    }
                    else {
                        label_showtime = 0;
                        polyLabeling.redraw();
                        $("#label_btn").text("Show Label (L)");
                        if (state === 'select') {
                            getInVertex = false;
                            getInPoly = false;
                            polyLabeling.resize = 0;
                        }
                        
                    }
                }
            });

            $("#category_select").change(function () {
                var cat_idx = document.getElementById("category_select").selectedIndex;
                if (state == 'select') {
                    var cate = Catelist[cat_idx];
                    cnt = 0;
                    if (target_poly !== -1) {    
                        polylist[target_poly.list_index].category = cate;
                        polyLabeling.redraw();
                    }
                    getInVertex = false;
                    getInPoly = false;
                    polyLabeling.resize = 0;
                    //$("#clear_btn").attr("disabled", false);
                }
            });

            $("#name_select").change(function () {
                if (state == 'select') {
                    var feat_idx = document.getElementById("name_select").selectedIndex;
                    var feature = Featurelist[feat_idx];
                    cnt = 0;
                    if (target_poly !== -1) {
                        polylist[target_poly.list_index].density = feature;
                        polyLabeling.redraw();
                    }
                    getInVertex = false;
                    getInPoly = false;
                    polyLabeling.resize = 0;
                }
            });
            $("#dir_select").change(function () {
                if (state == 'select') {
                    var dir_idx = document.getElementById("dir_select").selectedIndex;
                    var direct = Dirlist[dir_idx];
                    cnt = 0;
                    if (target_poly !== -1) {
                        polylist[target_poly.list_index].dir = direct;
                        polyLabeling.redraw();
                    }
                    getInVertex = false;
                    getInPoly = false;
                    polyLabeling.resize = 0;
                }
            });
        };

        return PolyLabeling;
    })();


    var Poly;

    Poly = (function () {

        function Poly(fixed_label, id) {
            this.id = id;
            this.list_index = 0;
            this.num = 0;
            this.beziernum = 0;
            this.p = [];
            this.degree = [];
            this.BezierOffset = [];
            this.hidden_p = [];
            this.category = fixed_label;
            this.density = "full";
            this.dir = "parallel"
            this.bbox = [10000, 10000, -1, -1];
        }

        Poly.prototype.update = function (clickX, clickY, cnt) {
            var vec = [clickX, clickY];
            var prevX, prevY;
            this.p[cnt] = vec;
            this.degree[cnt] = 0;

            if(clickX < this.bbox[0]) this.bbox[0] = clickX;
            if(clickX > this.bbox[2]) this.bbox[2] = clickX;
            if(clickY < this.bbox[1]) this.bbox[1] = clickY;
            if(clickY > this.bbox[3]) this.bbox[3] = clickY;

            if (cnt > 0) {
                prevX = this.p[cnt - 1][0];
                prevY = this.p[cnt - 1][1];
                this.hidden_p[cnt - 1] = [(clickX + prevX) / 2,
                    (clickY + prevY) / 2];
            }

            return true;
        };

        Poly.prototype.ComputeDegree = function () {
            for (var i = 0; i < this.num; i++)
                this.degree[i] = 0;
            if (this.beziernum > 0) {
                for (var j = 0; j < this.beziernum; j++) {
                    var start = this.BezierOffset[j];
                    this.degree[start]++;
                    this.degree[start + 1] = 2;
                    this.degree[start + 2] = 2;
                    this.degree[(start + 3) % this.num]++;
                }
            }
        };

        Poly.prototype.AddBezier = function (index) {

            var prev = this.p[index];
            var next = this.p[(index + 1) % this.num];

            this.num += 2;
            var mid_1 = [Math.round((prev[0] * 2 +
                next[0]) / 3), Math.round((prev[1] * 2 +
                next[1]) / 3)];
            var mid_2 = [Math.round((prev[0] +
                next[0] * 2) / 3), Math.round((prev[1] +
                next[1] * 2) / 3)];

            this.p.splice(index + 1, 0, mid_1, mid_2);


            this.hidden_p.splice(index, 1);
            this.hidden_p.splice(index, 0, 0, 0, 0);

            this.ChangeHiddenVertex(index);
            this.ChangeHiddenVertex(index + 1);
            this.ChangeHiddenVertex(index + 2);

            this.degree.splice(index + 1, 0, 2, 2);
            this.degree[index]++;

            this.degree[(index + 3) % this.num]++;
            //console.log(this.degree);
            this.beziernum++;

            this.BezierOffset.push(index);
            this.BezierOffset.sort(compare);
            for (var i = 0; i < this.beziernum; i++) {
                if (this.BezierOffset[i] > index) {
                    this.BezierOffset[i] += 2;
                }
            }
            addEvent("addBezier", this.id, {
                bezieroffset: this.BezierOffset,
                beziernum: this.beziernum
            });

        };
        Poly.prototype.DeleteBezier = function (index) {
            var offset = -1;
            for (var i = 0; i < this.beziernum; i++) {
                if (this.BezierOffset[i] <= index &&
                    this.BezierOffset[i] + 3 >= index) {
                    offset = i;
                    break;
                } else if (index == 0 && this.BezierOffset[i] + 3
                    == this.num) {
                    offset = i;
                    break;
                }
            }
            if (offset == -1) {
                alert("cannot delete bezier");
                return;
            }

            var start = this.BezierOffset[offset];

            this.num -= 2;
            this.beziernum--;

            this.BezierOffset.splice(offset, 1);
            for (var i = offset; i < this.beziernum; i++) {
                this.BezierOffset[i] -= 2;
            }
            this.p.splice(start + 1, 2);
            this.degree.splice(start + 1, 2);
            this.degree[start]--;
            this.degree[(start + 1) % this.num]--;
            this.hidden_p.splice(start, 3);

            var hid = [(this.p[start][0] +
            this.p[(start + 1) % this.num][0]) / 2,
                (this.p[start][1] +
                this.p[(start + 1) % this.num][1]) / 2];

            this.hidden_p.splice(start, 0, hid);

            addEvent("delBezier", this.id, {
                bezieroffset: this.BezierOffset,
                beziernum: this.beziernum
            });
        };

        Poly.prototype.drawPoly = function (cnt, context, select) {
            var width = 2;
            var withBezier = false;
            //context.globalCompositeOperation="destination-out";
            if (this.beziernum > 0) withBezier = true;
            if (withBezier == false) {
                this.drawPolyWithoutBezier(cnt, context);
            } else if (withBezier == true) {
                this.drawPolyWithBezier(cnt, context);
            }

            if (select) {
                context.strokeStyle = SELECT_COLOR;
                width = 4;
            }
            else
                context.strokeStyle = this.colors(this.id, 1);

            context.lineWidth = width / canvas_scale;
            context.stroke();

            if (withBezier) {
                this.drawDashLine(cnt, context);
            }
        };

        Poly.prototype.drawPolyWithoutBezier = function (cnt, context) {
            context.beginPath();
            context.moveTo(this.p[0][0], this.p[0][1]);
            for (var j = 1; j < cnt; j++) {
                context.lineTo(this.p[j][0], this.p[j][1]);
            }
        };

        Poly.prototype.drawPolyWithBezier = function (cnt, context) {
            var num = this.beziernum;
            if (num == 0) return;
            var index = this.BezierOffset[0];
            var next_index;
            var pos = 0;

            context.beginPath();
            context.moveTo(this.p[0][0], this.p[0][1]);
            for (var i = 0; i < num; i++) {
                index = this.BezierOffset[i];
                while (pos < index){
                    context.lineTo(this.p[pos + 1][0], this.p[pos + 1][1]);
                    pos++;
                }
                context.bezierCurveTo(this.p[(index + 1) % cnt][0],
                    this.p[(index + 1) % cnt][1],
                    this.p[(index + 2) % cnt][0], this.p[(index + 2) % cnt][1],
                    this.p[(index + 3) % cnt][0], this.p[(index + 3) % cnt][1]);
                pos = (index + 3) % cnt;
            }
            while(pos < cnt - 1){
                context.lineTo(this.p[pos + 1][0], this.p[pos + 1][1]);
                pos++;
            }
        };

        Poly.prototype.drawDashLine = function (cnt, context) {
            var num = this.beziernum;
            if (num == 0) return;
            var index = this.BezierOffset[0];
            context.setLineDash([3]);

            for (var i = 0; i < num; i++) {
                index = this.BezierOffset[i];
                next_index = this.BezierOffset[(i + 1) % num];

                context.moveTo(this.p[index][0], this.p[index][1]);
                context.lineTo(this.p[(index + 1) % cnt][0],
                    this.p[(index + 1) % cnt][1]);
                context.lineTo(this.p[(index + 2) % cnt][0],
                    this.p[(index + 2) % cnt][1]);
                context.lineTo(this.p[(index + 3) % cnt][0],
                    this.p[(index + 3) % cnt][1]);

                context.stroke();
            }
            context.setLineDash([]);
        };

        Poly.prototype.fillLabel = function (pos, context, select) {
            var tab = this.category.indexOf(" ");
            var word;
            if(tab > 0)
                word = this.category.substring(0, 1) + this.category.substring(tab + 1, tab + 2);
            else
                word = this.category.substring(0, 2);
            word += "," + this.density.substring(0, 1);
            word += "," + this.dir.substring(0, 1);

            var tag_width = word.length;
            var tag_height = 15;
            context.font = "13px Verdana";
            if(canvas_scale == 4){
                context.font = "9px Verdana";
                tag_height = 10;
                tag_width = word.length - 1;
            }
            if(context == hidden_ctx){
                return;
            }
            if (select)
                context.fillStyle = SELECT_COLOR;
            else 
                context.fillStyle = this.colors(this.id, 1);

            context.fillRect(pos[0] - tag_width, pos[1]
                - 2, tag_width * 9, tag_height);

            context.fillStyle = "rgb(0, 0, 0)";
            context.fillText(word, pos[0] - tag_width, pos[1] + tag_height
                - 3);
        };

        Poly.prototype.drawHiddenPoly = function (cnt) {

            hidden_ctx.strokeStyle = this.hidden_colors(this.list_index, -1);

            var withBezier = false;
            if (this.beziernum > 0) withBezier = true;
            if (withBezier == false) {
                this.drawPolyWithoutBezier(cnt, hidden_ctx);
            } else if (withBezier == true && cnt > 4) {
                this.drawPolyWithBezier(cnt, hidden_ctx);
            }
            hidden_ctx.lineWidth = 7 / canvas_scale;
            hidden_ctx.stroke();

            if (withBezier && cnt == 4) {
                var index = this.BezierOffset[0];
                hidden_ctx.beginPath();
                hidden_ctx.moveTo(this.p[index][0], this.p[index][1]);
                hidden_ctx.bezierCurveTo(this.p[(index + 1) % cnt][0],
                    this.p[(index + 1) % cnt][1],
                    this.p[(index + 2) % cnt][0], this.p[(index + 2) % cnt][1],
                    this.p[(index + 3) % cnt][0], this.p[(index + 3) % cnt][1]);
            }
            hidden_ctx.stroke();
            this.drawHiddenVertex(cnt);
            var pos = calcu_center(this);
            this.fillLabel(pos, hidden_ctx);
        };

        Poly.prototype.GenarateNewVertex = function (index) {
            for (var i = this.num - 1; i > index; i--) {
                this.p[i + 1] = this.p[i];
                this.hidden_p[i + 1] = this.hidden_p[i];
            }
            this.p[index + 1] = this.hidden_p[index];
            this.num++;
            this.degree.splice(index + 1, 0, 0);
            for (var i = 0; i < this.beziernum; i++) {
                if (this.BezierOffset[i] >= index + 1) {
                    this.BezierOffset[i]++;
                }
            }
            this.ChangeHiddenVertex(index);
            this.ChangeHiddenVertex(index + 1);
            addEvent("addvertex", this.id, {
                new_index: index
            });
        };
        Poly.prototype.DeleteVertex = function (index) {
            if (this.num <= this.beziernum * 3) {
                return;
            }
            this.num--;
            for (var i = 0; i < this.beziernum; i++)
                this.BezierOffset[i] = this.BezierOffset[i] % this.num;

            this.p.splice(index, 1);
            this.hidden_p.splice(index, 1);
            this.degree.splice(index, 1);
            if (this.num < 2) {
                DeletePolyfromPolylist(this);
                return;
            }
            for (var i = 0; i < this.beziernum; i++) {
                if (this.BezierOffset[i] > index) {
                    this.BezierOffset[i]--;
                }
            }
            var prev = (index - 1 + this.num) % this.num;

            this.ChangeHiddenVertex(prev);
            addEvent("delvertex", this.id, {
                del_index: index
            });
        };

        Poly.prototype.ChangeHiddenVertex = function (index) {
            var next = (index + 1) % this.num;
            var index = index % this.num;

            this.hidden_p[index] = [(this.p[index][0] +
            this.p[next][0]) / 2, (this.p[index][1] +
            this.p[next][1]) / 2];
        };

        Poly.prototype.drawHiddenVertex = function (cnt) {

            if (this.num > 1 && ShowMid) {
                for (var i = 0; i < cnt - 1; i++) {
                    if (cnt == 2 && i == 1) break;
                    if (this.degree[i] < 2 && this.degree[(i + 1) % cnt] < 2) {
                        hidden_ctx.beginPath();
                        if (calcu_dis(this.hidden_p[i], this.p[i]) > MIN_DIS * 2
                            && calcu_dis(this.hidden_p[i], this.p[(i + 1) % cnt]) > MIN_DIS * 2)
                            hidden_ctx.arc(this.hidden_p[i][0], this.hidden_p[i][1],
                                4 / canvas_scale, 0, 2 * Math.PI, false);
                        else
                            hidden_ctx.arc(this.hidden_p[i][0], this.hidden_p[i][1],
                                3 / canvas_scale, 0, 2 * Math.PI, false);
                        hidden_ctx.closePath();
                        hidden_ctx.fillStyle = this.hidden_colors(this.list_index, 2 * i + 1);
                        hidden_ctx.fill();
                    }
                }
            }

            for (var j = 0; j < cnt; j++) {
                hidden_ctx.beginPath();
                hidden_ctx.arc(this.p[j][0], this.p[j][1],
                    4 / canvas_scale, 0, 2 * Math.PI, false);
                hidden_ctx.closePath();
                hidden_ctx.fillStyle = this.hidden_colors(this.list_index, 2 * j);
                hidden_ctx.fill();
            }

        };
        Poly.prototype.clearControlPoints = function (cnt, context) {
            var radius = 7 / canvas_scale;
            var startpos, endpos;
            for(var j = 0; j < cnt; j++){
                startpos = [this.p[j][0]-radius-1, this.p[j][1]-radius-1];
                if(startpos[0] < 0) startpos[0] = 0;
                if(startpos[1] < 0) startpos[1] = 0;
                endpos = [this.p[j][0]+radius+1, this.p[j][1]+radius+1];
                context.clearRect(startpos[0], startpos[1], endpos[0], endpos[1]);
                startpos = [this.hidden_p[j][0]-radius-1, this.hidden_p[j][1]-radius-1];
                endpos = [this.hidden_p[j][0]+radius+1, this.hidden_p[j][1]+radius+1];
                context.clearRect(startpos[0], startpos[1], endpos[0], endpos[1]);
            }
        };
        Poly.prototype.showControlPoints = function (cnt, context) {
            var radius = 4 / canvas_scale;
            context.fillStyle = this.colors(this.id, 0.7);
            for (var j = 0; j < cnt; j++) {
                context.beginPath();
                context.arc(this.p[j][0], this.p[j][1],
                    radius, 0, 2 * Math.PI, false);
                context.closePath();
                context.fill();
            }

            context.fillStyle = MID_CONTROL_POINT;
            if(cnt < 2) return;
            for (var j = 0; j < cnt - 1; j++) {
                if (this.degree[j] < 2 && this.degree[(j + 1) % cnt] < 2 && ShowMid) {
                    context.beginPath();
                    context.arc(this.hidden_p[j][0], this.hidden_p[j][1],
                        radius, 0, 2 * Math.PI, false);
                    context.closePath();
                    context.fill();
                }
            }

            if (this.beziernum > 0) {
                context.fillStyle = BEZIER_COLOR;
                for (var i = 0; i < this.beziernum; i++) {
                    var start = this.BezierOffset[i];
                    for (var j = 0; j < 4; j++) {
                        context.beginPath();
                        context.arc(this.p[start + j][0], this.p[start + j][1],
                            radius, 0, 2 * Math.PI, false);
                        context.closePath();
                        context.fill();
                    }
                }
            }
        };
        Poly.prototype.RecomputeBbox = function(){
            this.bbox = [10000, 10000, -1, -1];
            for(var i = 0; i < this.num; i++){
                if(this.p[i][0] < this.bbox[0]) this.bbox[0] = this.p[i][0];
                if(this.p[i][0] > this.bbox[2]) this.bbox[2] = this.p[i][0];
                if(this.p[i][1] < this.bbox[1]) this.bbox[1] = this.p[i][1];
                if(this.p[i][1] > this.bbox[3]) this.bbox[3] = this.p[i][1];
            }
        };
        Poly.prototype.colors = function (id, alpha) {
            var tableau_colors = ["rgba(31, 119, 180, " + alpha + ")",
                "rgba(174, 199, 232, " + alpha + ")",
                "rgba(255, 127, 14, " + alpha + ")",
                "rgba(255, 187, 120, " + alpha + ")",
                "rgba(44, 160, 44," + alpha + ")",
                "rgba(152, 223, 138," + alpha + ")",
                "rgba(214, 39, 40, " + alpha + ")",
                "rgba(255, 152, 150," + alpha + ")",
                "rgba(148, 103, 189, " + alpha + ")",
                "rgba(197, 176, 213, " + alpha + ")",
                "rgba(140, 86, 75, " + alpha + ")",
                "rgba(196, 156, 148," + alpha + ")",
                "rgba(227, 119, 194, " + alpha + ")",
                "rgba(247, 182, 210, " + alpha + ")",
                "rgba(127, 127, 127, " + alpha + ")",
                "rgba(199, 199, 199, " + alpha + ")",
                "rgba(188, 189, 34, " + alpha + ")",
                "rgba(219, 219, 141, " + alpha + ")",
                "rgba(23, 190, 207," + alpha + ")",
                "rgba(158, 218, 229, " + alpha + ")"];
            return tableau_colors[id % 20]
        };
        Poly.prototype.hidden_colors = function (x, num) {
            var y, z;
            num += 1;
            z = num & 255;
            y = (num & (255 << 8)) >> 8;
            return "rgb(" + (x + 1) + "," + y + "," + z + ")";
        };
        return Poly;

    })();

}).call(this);
