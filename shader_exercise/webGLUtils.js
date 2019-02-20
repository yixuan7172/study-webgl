let gl, canvas

createCanvas()

function createCanvas() {
    canvas = document.createElement('canvas')
    canvas.width = 500 * 1.5
    canvas.height = 350 * 1.5
    document.body.appendChild(canvas)
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) {
        throw '没有webgl渲染上下文！'
    }
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
}

function createShader(type, shaderSrc) {
    let shader = gl.createShader(type)
    gl.shaderSource(shader, shaderSrc)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader)
        console.warn('compile shader error!')
        return null
    }
    return shader
}

function createProgram(vertexShaderSrc, fragmentShaderSrc) {
    let program = gl.createProgram()
    let vs = createShader(gl.VERTEX_SHADER, vertexShaderSrc),
        fs = createShader(gl.FRAGMENT_SHADER, fragmentShaderSrc)
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program)
        console.warn('link program error!')
        return null
    }
    gl.useProgram(program)
    return program
}

function initVertexBuffer(a_pos, a_texCoord) {
    const vertices = new Float32Array([
        -1.0, 1.0, 0.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        -1.0, -1.0, 0.0, 0.0,
        1.0, -1.0, 1.0, 0.0
    ])
    let vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const SIZE = vertices.BYTES_PER_ELEMENT
    gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, SIZE * 4, 0)
    gl.enableVertexAttribArray(a_pos)

    gl.vertexAttribPointer(a_texCoord, 2, gl.FLOAT, false, SIZE * 4, SIZE * 2)
    gl.enableVertexAttribArray(a_texCoord)
}

function initTexture(image, sampler) {
    let texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

    gl.activeTexture(gl.TEXTURE0)
    gl.uniform1i(sampler, 0)
}

function clear() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

function getLocation(program, type, name) {
    let location = null
    if (type === 'uniform') {
        location = gl.getUniformLocation(program, name)
    } else {
        location = gl.getAttribLocation(program, name)
    }
    return location
}

function loadImage(imgSrc) {
    return new Promise((resolve, reject) => {
        let oImage = new Image()
        oImage.onload = () => {
            resolve(oImage)
        }
        oImage.onerror = () => {
            reject(new Error('img load error!'))
        }
        oImage.src = imgSrc
    })
}