/**
 * Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

/**module.exports = function (api) {
  return {
    plugins: ["macros"],
  };
};
Se comenta todo el modulo a causa del analisis de EsLint. Esta variable no se utiliza en el proyecto.
*/
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-react', // Si estás usando React
  ],
  // Puedes agregar otros plugins o presets si es necesario
};


