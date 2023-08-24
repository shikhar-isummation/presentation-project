import { Controller, Get, Delete, Param, HttpStatus, HttpException, Post, Body, Patch, ParseIntPipe, UseGuards, HttpCode, Res, Header, Redirect, Headers, Query, Ip, DefaultValuePipe, ParseArrayPipe, UseFilters, BadRequestException, UseInterceptors } from '@nestjs/common';
import { OfficeService } from './office.service';
import { Office } from '../typeorm/office.entity';
import { CreateOfficeDto } from './dto/Create.User.dto';
import { UpdateOfficeDto } from './dto/Update.User.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/role.guard';
import { CONSTANTS } from 'src/constants';
import { Response } from 'express';
import { ParseDatePipe } from 'src/pipes/parse-date.pipe';
import { IdExceptionFilter } from 'src/exceptions/id-exception.filter';
import { IdException } from 'src/exceptions/id-exception';
import { HttpExceptionFilter } from 'src/exceptions/http-exception.filter';
import { RecentSearchInterceptor } from './interceptors/recent-search.interceptor';
import { RecentSearchService } from './services/recent-search.service';

@UseFilters(HttpExceptionFilter)
@Controller()
export class OfficeController {
  constructor(
    private readonly officeService: OfficeService,
    private readonly recentSearchService: RecentSearchService
  ) { }

  @UseGuards(JwtAuthGuard, new RoleGuard([CONSTANTS.ROLES.CEO]))
  @Get()
  async findAll(): Promise<Office[]> {
    return this.officeService.getAllOffices();
  }

  @Get("recent-search")
  public getRecentSearch(@Query("token") token: string) {
    return this.recentSearchService.find(token);
  }

  @UseGuards(JwtAuthGuard, new RoleGuard([CONSTANTS.ROLES.CEO]))
  @Delete(':officeCode')
  async deleteOffice(
    @Param('officeCode', ParseIntPipe) officeCode: number | any
  ): Promise<{ message: string }> {
    await this.officeService.deleteOffice(officeCode);
    return { message: 'Office deleted successfully' };
  }

  @UseGuards(JwtAuthGuard, new RoleGuard([CONSTANTS.ROLES.MANAGER, CONSTANTS.ROLES.CEO]))
  // @Header('Cache-Control', 'none')
  // @Redirect('/offices', 302)
  // @HttpCode(HttpStatus.OK)
  // @UseFilters(IdExceptionFilter)
  @Get(':officeCode')
  @UseInterceptors(RecentSearchInterceptor)
  async searchUserById(
    @Param(
      'officeCode',
      // new DefaultValuePipe(1),// use for Body
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })
    )
    officeCode: number,
    // @Headers('user-agent') header: Record<string, any>,
    // @Query(
    //   'name',
    //   // new ParseArrayPipe({ items: Number, separator:'-' })
    // ) query: any,
    // @Ip() ip: string,
    // @Body("timestamp", ParseDatePipe) date: Date,
    // @Body("timestamp1", ParseDatePipe) date1: string,
    // @Body("timestamp2", ParseDatePipe) date2: number
  ): Promise<Office | any> {
    if (officeCode <= 0)
      throw new IdException("Invalid id");
    if (officeCode > 10)
      throw new BadRequestException("Invalid id");
    // if (officeCode <= 0)
    //   throw new Error()
    // if (officeCode <= 0)
    //   throw new HttpException("Please pass Valid Office Code",HttpStatus.BAD_REQUEST)
    // console.log('user-agent === ', header);
    // console.log('query === ', query);
    // console.log('IP === ', ip);
    // console.log('Date Date === ', date);
    // console.log('Date1 string=== ', date1);
    // console.log('Date2 number === ', date2);
    return this.officeService.findOfficeById(officeCode);
  }
  // @Get(':officeCode')
  // async searchUserById(@Param('officeCode') officeCode: number, @Res({passthrough:true}) res: Response): Promise<Office | any> {
  //   res.status(200);
  //   return this.officeService.findOfficeById(officeCode);
  // }

  @UseGuards(JwtAuthGuard, new RoleGuard([CONSTANTS.ROLES.CEO]))
  @Post()
  registerOffice(
    @Body() createOffice: CreateOfficeDto
  ): Promise<any> {
    return this.officeService.registerOffice(createOffice, createOffice.officeCode);
  }

  @UseGuards(JwtAuthGuard, new RoleGuard([CONSTANTS.ROLES.CEO, CONSTANTS.ROLES.MANAGER]))
  @Patch(":officeCode")
  updateOffice(
    @Body() updateoffice: UpdateOfficeDto,
    @Param('officeCode') officeCode: number | any
  ): Promise<any> {
    console.log(updateoffice.phone, updateoffice.postalCode);
    return this.officeService.updateUser(officeCode, updateoffice);
  }

}
