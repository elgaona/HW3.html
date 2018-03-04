
function createPlaneSDF(w, h) {

    var geometry = new THREE.PlaneGeometry(w,h);

    var shaderInput = {
        resolution: {type: "v2", value: new THREE.Vector2(w,h) }
    };

    var material = new THREE.ShaderMaterial({
        uniforms: shaderInput,
        vertexShader: sdfVShader,
        fragmentShader: sdfFShader
    });

    var mesh = new THREE.Mesh(geometry, material);

    mesh.Start = function() {
    };

    mesh.Update = function() {

    }

    return mesh;
}
