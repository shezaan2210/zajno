
varying vec2 Vuv;

void main(){
      // Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    Vuv = uv;
}