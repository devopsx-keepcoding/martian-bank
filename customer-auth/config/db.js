/**
 * Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import mongoose from 'mongoose';
import 'colors'; /**Importacion debido a errores con las pruebas Unitarias */
const logger = console;

const connectDB = async () => {
  try {
    logger.info(
      ' --- Connecting to MongoDB for customer-auth microservice --- '.cyan,
    );

    if (process.env.DATABASE_HOST) {
      logger.info(
        `Connecting to local MongoDB at ${process.env.DATABASE_HOST} ...`,
      );
      await mongoose.connect(`mongodb://${process.env.DATABASE_HOST}:27017/`);
    } else {
      logger.info(
        `Connecting to MongoDB Atlas for customer-auth at ${process.env.DB_URL}`,
      );
      await mongoose.connect(process.env.DB_URL);
    }
    logger.info(' --- MongoDB Connected --- '.cyan);
  } catch (error) {
    logger.info(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

export default connectDB;
