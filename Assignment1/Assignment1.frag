
#ifdef GL_ES
precision highp float;
#endif

    
vec3 colorLine(vec2 stage, vec3 color,  float freq, float phase){
    return smoothstep(0.05, 0.0, abs(cos(stage.x * freq  + time + phase)) - stage.y - 0.2) * color / 4.0 +
           smoothstep(0.01, 0.0, abs(abs(cos(stage.x  * freq + time + phase)) - stage.y - 0.2));
} 


void main () {
    
vec2 stage = gl_FragCoord.y /resolution;

vec2 p = uv();
vec2 q = uv();
vec2 r = uv();
vec2 s = uv();


// frequency
float bass = bands.x;
float midLow = bands.y;
float midHigh = bands.z;
float high = bands.w;    
    
float bassControl = mouse.x/ 100.0;

//bass visualizer modifiers
p.y += cos(bassControl * bass / p.y / q.y);   
r.y += cos(bass / p.x / q.x); 

    //song beat per second to match song
float bps = 2.15;
    //waves turned into lines
    
    vec3 lineYellow = colorLine(stage, vec3(0.91,0.89,0.26), bps, 0.0);
    vec3 lineBlue = colorLine(stage, vec3(0.05,0.35,0.65),  (bps*2.0), 1.2);
    vec3 lineGreen = colorLine(stage, vec3(0.0,0.71,0.31),  bps, 4.0);
    vec3 linePurple = colorLine(stage, vec3(0.396,0.878,0.878),  (bps*2.0), 6.0);

    vec4  lines = vec4(lineYellow, 1.0) + vec4(lineBlue, 1.0) + vec4(lineGreen, 1.0) + vec4(linePurple,1.0);
   
   //for control
    float thresholdY = mouse.y / 100.0;
    float thresholdX = mouse.x / 100.0;
    
    //for testing
    vec4 black = vec4(0.0,0.0,0,0);

    vec2 rotatio = rotate(p, gl_FragCoord.xy/resolution.xy, time);
    vec4 bassViz = vec4(rotatio.x, p.y * bass, r.y, 1.0);
    gl_FragColor = bassViz;
        
    //scroller code from https://glslsandbox.com/e#78670.0 with different variables
    vec2 uv = (gl_FragCoord.xy - resolution * 0.5) / max(resolution.x, resolution.y) * 15.0;
	
	float e = 0.1/abs(cos(uv.x*uv.x - uv.y*uv.y) - sin(2.0*uv.x*uv.y+time) + atan(uv.x * uv.y)*(4./ length(uv)));
	
	float v = 0.5+sin(time+e)*0.5;
	
	vec4 scroll = vec4(vec3(v+e,v*0.1,v*0.2), 1.0);
	vec4 scrollAndLines = mix(scroll + lines, black, mouse.x /1000.0);
	
   
   if(thresholdX < 10.0){
    // mixes scroller and lines
    gl_FragColor = scrollAndLines;
   // gl_FragColor = black;

   }
    
    

}