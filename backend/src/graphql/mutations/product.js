import { ProductTC } from '../../models'
import { schemaComposer } from 'graphql-compose'
import { GraphQLUpload } from 'apollo-upload-server';

import { generateRandomString } from '../../utils/generateRandomString'

const path = require('path')
const fs = require('fs')

schemaComposer.add(GraphQLUpload);

const UploadPayload = schemaComposer.createObjectTC({
  name: 'UploadPayload',
  fields: {
    url: 'String!',
  },
})

export const uploadFile = schemaComposer.createResolver({
  name: "uploadFile",
  args: {
    file: 'Upload!'
  },
  type: UploadPayload,
  resolve: async ({ args }) => {
    const file = args.file.file
    const { createReadStream, filename} = await file

    const { ext } = path.parse(filename)
    const randomName = generateRandomString(12) + ext

    const pathName = path.join(__dirname, `../../../public/images/${randomName}`)
    await new Promise((res) =>
      createReadStream().pipe(fs.createWriteStream(pathName)).on("close", res)
    );

    return {
      url: `http://localhost:3001/images/${randomName}`,
    };
  },
})

export const createProduct = ProductTC.getResolver('createOne')
export const updateProductById = ProductTC.getResolver('updateById')
