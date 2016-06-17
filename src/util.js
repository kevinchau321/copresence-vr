var Util = {};

// From http://goo.gl/4WX3tg
Util.getQueryParameter = function(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

/**
 * Loads an .obj / .mtl model, taking the prefix of the filename and assuming
 * that the obj and mtl are at +".obj" and +".mtl" respectively.
 *
 * @return {Promise} With the loaded mesh as the first argument.
 */
Util.loadObj = function(root) {
  var mtl = root + '.mtl';
  var obj = root + '.obj';

  var mtlLoader = new THREE.MTLLoader();
  return new Promise(function(resolve, reject) {
    mtlLoader.load(mtl, function(materials) {
      materials.preload();
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load(obj, resolve, onProgress, reject);
    });
  });

  function onProgress(e) {
    console.log('onProgress', e);
  }
};

Util.tileMesh2D = function(tileMesh) {
  var w = 20;
  var h = 20;
  var rows = 2;
  var cols = 2;
  tileMesh.material.color.set(new THREE.Color(0, 0.5, 0));
  tileMesh.material = new THREE.MeshLambertMaterial({color: 0x009900});
  tileMesh.geometry.computeVertexNormals(THREE.Geometry.FlatStrategy)
  var field = new THREE.Object3D();
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      var patch = tileMesh.clone();
      patch.position.x = i * w;
      patch.position.z = j * h;
      field.add(patch);
    }
  }
  field.scale.y = 1.5;
  field.position.set(-w*rows/4, 0, -h*cols/4);
  return field;
}  

Util.createTorus = function(opt_params) {
  var params = opt_params || {};
  params.color = params.color || 0xffff00;
  // Make a torus.
  var geometry = new THREE.TorusGeometry(1, 0.1, 8, 20);
  var material = new THREE.MeshBasicMaterial({color: params.color});
  var torus = new THREE.Mesh(geometry, material);

  return torus;
};
  
Util.serializePose = function(pose) {
  return JSON.stringify(pose);
};

module.exports = Util;