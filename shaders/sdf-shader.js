var sdfVShader = `
        varying vec3 v_pos;
        void main() {
            v_pos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 0.5);
        }
    `;

var sdfFShader = `
        const int MAX_MARCHING_STEPS = 500;
        const float EPISOLON = 0.0001;
        const float START = 0.0;
        const float END = 300.0;
        const float movex = 5.0;
        const float movey = 5.0;
        

        uniform vec2 resolution;
        varying vec3 v_pos;

        float sphereSDF(vec3 samplePoint) {
            return(length(samplePoint) - 1.3);
        }

        float sceneSDF(vec3 point) {
            return sphereSDF(point);
        }



        // Cheated and copied from shader toy example:
        // https://www.shadertoy.com/view/lt33z7
        vec3 rayDirection(float fieldOfView, vec2 size, vec2 fragCoord) {
            vec2 xy = fragCoord;
            float z = size.y / tan(radians(fieldOfView) / 2.0);
            return normalize(vec3(xy, -z));
        }

        // Cheated and copied from shader toy example:
        // https://www.shadertoy.com/view/lt33z7
        mat3 rayMarchViewMatrix(vec3 cam, vec3 center, vec3 up) {
            // Based on gluLookAt man page
            vec3 f = normalize(center - cam);
            vec3 s = normalize(cross(f, up));
            vec3 u = cross(s, f);

            return mat3(-s, -u,-f);
        }


        

        float rayMarch(vec3 cam, vec3 dir, float start, float end) {
            float step = start;
            for(int i = 0; i < MAX_MARCHING_STEPS; i++) {
                float dist = sceneSDF(cam + step * dir);
                if(dist < EPISOLON) {
                    // I am inside the geometry
                    return step;
                }

                step += dist;
                if(step >= end) {
                    return end;
                }
            }

            return end;
        }

        void main() {
            float s = 8.0;
            float t = 5.0;
            float u = 7.0;
            vec3 cam = vec3(s,t,u);
            vec3 dir = rayDirection(77.0, resolution, v_pos.xy);

            mat3 viewToWorld = rayMarchViewMatrix(cam, vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0));
            vec3 worldDir = viewToWorld * dir;

            float dist = rayMarch(cam, worldDir, START, END);
            if(dist > END - EPISOLON) {
                gl_FragColor = vec4(0.0,0.0,2.0,0.0);
                return;
            }

            

            gl_FragColor = vec4(0.0,10.0,0.0,0.0);
        }
    `;
