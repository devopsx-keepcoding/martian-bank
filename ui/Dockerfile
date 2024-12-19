# Copyright (c) 2023 Cisco Systems, Inc. and its affiliates All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

FROM --platform=linux/amd64 node:18-alpine
WORKDIR /bankapp
COPY ui/package*.json ./
RUN npm install --silent
COPY ui/ ./
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "run", "ui"]