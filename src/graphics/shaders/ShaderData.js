export const VERTEX_SHADER_BASE = `
precision mediump float;

attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;
uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void) {
    // Calculate vertex position.
    vec3 pos = projectionMatrix * vec3(aVertexPosition, 1.0);
    gl_Position = vec4(pos.xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}
`;

// Fragment shader code
export const FRAGMENT_SHADER_SHINE = `
precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float intensity;

void main(void) {
    // Get current colour at the position.
    vec4 color = texture2D(uSampler, vTextureCoord);
    
    // increase color intensity.
    color = color * intensity;
    
    // Apply colour to output.
    gl_FragColor = vec4(color.xyz, color.a);
}
`;
