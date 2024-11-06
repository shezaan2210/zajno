
uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uHover;
uniform float uIntensity;

varying vec2 Vuv;

void main(){
    float blocks = 20.0;
    vec2 blocksUv = floor(Vuv * blocks) / blocks;
    float Distance = length(blocksUv - uMouse);
    float effect = smoothstep(0.4, 0.0, Distance);
    vec2 distortion = vec2(0.03) * effect;


    vec4 color = texture2D(uTexture, Vuv + (uIntensity * distortion * uHover));

    gl_FragColor = color;
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}