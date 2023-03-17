import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';

import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './static/products',
        filename: function (_, file, callback) {
          const extensionFile = file.originalname.split('.').pop();
          console.log(extensionFile);
          const id = uuidv4();
          callback(null, `${id}.${extensionFile}`);
        },
      }),
    }),
  )
  uploadProductImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 3 }),
          new FileTypeValidator({
            fileType: '.(image|jpeg|png|jpg)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    //* ParseFilePipeBuilder option
    // @UploadedFile(
    //   new ParseFilePipeBuilder()
    //     .addFileTypeValidator({ fileType: 'jpg|png|jpeg' })
    //     .addMaxSizeValidator({ maxSize: 1024 * 1024 * 3 })
    //     .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    // )
    // file: Express.Multer.File,
  ) {
    return { file: file.originalname };
  }
}
