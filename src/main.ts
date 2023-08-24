import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { readFileSync } from "fs";
import { resolve } from "path";
import { createServer as createHttpServer } from "http";
import { createServer as createHttpsServer } from "https";
import * as express from "express";


const PORT = 3500;
async function bootstrap() {
  try {
    const server = express();
    const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(server));
    console.log(`Running on Express adapter at port: ${PORT}`);
    await app.init();

    app.useGlobalPipes(new ValidationPipe());

    await createHttpServer(server).listen(PORT);
    await createHttpsServer(
      {
        key: readFileSync(resolve(__dirname, "../cert/server.key")),
        cert: readFileSync(resolve(__dirname, "../cert/server.cert")),
      },
      server
    ).listen(443); 
    

    // setTimeout(()=>app.close(),5000)
  } catch (error) {
    console.log(error);
  }
}
bootstrap();
