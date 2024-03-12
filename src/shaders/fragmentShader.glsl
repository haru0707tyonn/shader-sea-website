uniform vec3 uDepthColor; // 36 色情報なのでvec3 波の低い部分（暗い）
uniform vec3 uSurfaceColor; // 36 色情報なのでvec3 波の高い部分（明るい）
uniform float uColorOffset; // 38
uniform float uColorMutiplier; // 38

varying float vElevation; // 37

void main() {
    float mixStrengthColor = (vElevation + uColorOffset) * uColorMutiplier; // 38 濃淡をはっきりさせる
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrengthColor); // 37 1.0だと第二引数の色が適用させる0.0の場合は第一引数
    gl_FragColor = vec4(color, 1.0);
}