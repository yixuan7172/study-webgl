let gl

createCanvas()

function createCanvas() {
    let canvas = docuement.createElement('canvas')
    canvas.width = innerWidth
    canvas.height = innerHeight
    document.body.appendChild(canvas)
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) {
        throw '没有webgl渲染上下文！'
    }
}

function createShader(type, shaderSrc) {
    let shader = gl.createShader(type)
    gl.shaderSource(shader, shaderSrc)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader)
        console.warn('conpile shader error!')
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
    return program
}