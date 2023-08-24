import { MiddlewareConsumer, Module, NestModule, OnModuleInit, RequestMethod } from "@nestjs/common";
import { OfficeController } from "./offices.controller";
import { OfficeService } from "./office.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Office } from "../typeorm/office.entity";
import { Employees } from "src/typeorm/employees.entity";
import { UsersModule } from "src/users/users.module";
import { AuthModule } from "src/auth/auth.module";
import { UserAgentMiddleware, UserAgentOptions } from "./middlewares/user-agent.middleware";


@Module({
    imports: [TypeOrmModule.forFeature([Office, Employees]), AuthModule, UsersModule],
    controllers: [OfficeController],
    providers: [
        OfficeService, {
            provide: UserAgentOptions,
            useValue: { accepted: ["chrome", "firefox", "postman"] },
        }
    ]
})
export class OfficeModule implements NestModule, OnModuleInit {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(UserAgentMiddleware)
            // .exclude({ path: "offices", method: RequestMethod.POST })
            .forRoutes("offices");
    }

    onModuleInit() {
        console.log("Office module init");
    }
}