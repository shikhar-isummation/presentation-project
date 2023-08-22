import { Module, NestModule, RequestMethod } from "@nestjs/common";
import { OfficeController } from "./offices.controller";
import { OfficeService } from "./office.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Office } from "../typeorm/office.entity";
import { Employees } from "src/typeorm/employees.entity";
import { UsersModule } from "src/users/users.module";
import { AuthModule } from "src/auth/auth.module";


@Module({
    imports: [TypeOrmModule.forFeature([Office, Employees]), AuthModule, UsersModule],
    controllers: [OfficeController],
    providers: [OfficeService]
})
export class OfficeModule {
}