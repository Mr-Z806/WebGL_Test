// 顶点着色器程序
var VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "void main() {\n" +
  "  gl_Position = a_Position;\n" + // 设置坐标
  "  gl_PointSize = 10.0;\n" + // 设置尺寸
  "}\n";

// 片元着色器程序
var FSHADER_SOURCE =
  "precision mediump float;\n" +
  "uniform vec4 u_FragColor;\n" +
  "void main() {\n" +
  "  gl_FragColor = u_FragColor;\n" + // 设置颜色
  "}\n";

function main() {
  var canvas = document.getElementById("webgl");

  // 获取webgl绘图上下文
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  // 初始化着色器
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Fail to initialize shaders.");
    return;
  }

  // 获取a_Position变量的存储位置
  var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_position");
    return;
  }
  // 获取u_FragColor变量的存储位置
  var u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
  if (u_FragColor < 0) {
    console.log("Failed to get the storage location of u_FragColor");
    return;
  }

  // 注册鼠标点击事件响应函数
  canvas.onmousedown = function (ev) {
    click(ev, gl, canvas, a_Position, u_FragColor);
  };

  // 设置背景色
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // 清空
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = []; // 鼠标点击位置数组
var g_colors = []; // 存储点颜色的数组
function click(ev, gl, canvas, a_Position, u_FragColor) {
  var x = ev.clientX;
  var y = ev.clientY;
  var rect = ev.target.getBoundingClientRect();

  x = (x - rect.left - canvas.height / 2) / (canvas.height / 2);
  y = (canvas.width / 2 - (y - rect.top)) / (canvas.width / 2);
  // 将坐标存储在g_point数组中
  g_points.push([x, y]);

  // 将点的颜色存储到g_colors数组中
  if (x >= 0.0 && y >= 0.0) {
    g_colors.push([1.0, 0.0, 0.0, 1.0]);
  } else if (x < 0.0 && y < 0.0) {
    g_colors.push([0.0, 1.0, 0.0, 1.0]);
  } else {
    g_colors.push([1.0, 1.0, 1.0, 1.0]);
  }

  // 清空
  gl.clear(gl.COLOR_BUFFER_BIT);
  var len = g_points.length;
  for (let i = 0; i < len; i++) {
    var xy = g_points[i];
    var rgba = g_colors[i];

    // 将点的位置传递到变量中a_Position
    gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);

    // 将点的颜色传递到u_FragColor变量中
    gl.uniform4f(u_FragColor,rgba[0],rgba[1],rgba[2],rgba[3])
    // 绘制点
    gl.drawArrays(gl.POINTS, 0, 1);
  }
}
